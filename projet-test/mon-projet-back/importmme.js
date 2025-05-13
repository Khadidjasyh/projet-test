const fs = require('fs').promises;
const path = require('path');
const mysql = require('mysql2/promise');

// Database connection configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: process.env.MYSQL_PASSWORD || '1234',
    database: 'mon_projet_db'
};

const parseMmeData = (text) => {
    // Split the text into blocks by IMSI
    const imsiBlocks = text.split('IMSI:').slice(1);
    
    return imsiBlocks.map(block => {
        const lines = block.trim().split('\n');
        const imsi = lines[0].trim();
        
        const parsedData = {
            imsi: imsi,
            default_apn_operator_id: '',
            digits_to_add: '',
            misc_info1: '',
            hss_realm_name: ''
        };
        
        lines.slice(1).forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('dn (DefaultAPNOperatorID)')) {
                parsedData.default_apn_operator_id = trimmedLine.split(/\s+/)[2];
            } else if (trimmedLine.startsWith('ad (DigitsToAdd)')) {
                parsedData.digits_to_add = trimmedLine.split(/\s+/)[2];
            } else if (trimmedLine.startsWith('m1 (MiscInfo1)')) {
                parsedData.misc_info1 = trimmedLine.split(/\s+/).slice(2).join(' ').replace(/_/g, ' ').trim();
            } else if (trimmedLine.startsWith('rn (HssRealmName)')) {
                parsedData.hss_realm_name = trimmedLine.split(/\s+/)[2];
            }
        });
        
        return parsedData;
    });
};

const importMmeData = async () => {
    try {
        // Adjust the file path as needed
       const filePath = path.join(__dirname, 'MME', 'all_imsins_parameterset.txt');

        // Read file
        const content = await fs.readFile(filePath, 'utf-8');
        
        // Parse data
        const entries = parseMmeData(content);
        
        // Create database connection
        const connection = await mysql.createConnection(dbConfig);
        
        // Prepare insert query
        const query = `
            INSERT INTO mme_imsi_analysis 
            (imsi, default_apn_operator_id, digits_to_add, misc_info1, hss_realm_name) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        // Insert entries
        for (const entry of entries) {
            try {
                await connection.execute(query, [
                    entry.imsi,
                    entry.default_apn_operator_id,
                    entry.digits_to_add,
                    entry.misc_info1,
                    entry.hss_realm_name
                ]);
                console.log(`Imported IMSI: ${entry.imsi}`);
            } catch (insertError) {
                console.error(`Error importing IMSI ${entry.imsi}:`, insertError);
            }
        }
        
        // Close connection
        await connection.end();
        
        console.log(`✅ Imported ${entries.length} MME entries`);
    } catch (err) {
        console.error('❌ Error importing MME data:', err);
    }
};

// Run the import
importMmeData();