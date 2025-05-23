const fs = require('fs');
const mysql = require('mysql2');
const path = require('path');

// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'mon_projet_db'
});

// Connect to database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
    processLogFiles();
});

async function clearMssTables() {
    try {
        console.log('Clearing existing MSS tables...');
        await connection.promise().query('DELETE FROM mss_imsi_analysis');
        await connection.promise().query('DELETE FROM mss_bnumber_analysis');
        await connection.promise().query('DELETE FROM mss_gt_series');
        console.log('Successfully cleared all MSS tables');
    } catch (error) {
        console.error('Error clearing tables:', error);
        throw error;
    }
}

async function processLogFiles() {
    // Clear existing data first
    await clearMssTables();

    // Use the MSS_Ericson directory in the parent directory
    const logDir = path.join(__dirname, 'MSS_Ericson');
    console.log('Current directory:', __dirname);
    console.log('Looking for log files in directory:', logDir);
    
    // Lister tous les fichiers .log du dossier
    let files = [];
    try {
        files = fs.readdirSync(logDir).filter(f => f.endsWith('.log'));
        console.log('Log files found in directory:', files);
    } catch (error) {
        console.error('Error reading directory:', error);
    }

    if (files.length === 0) {
        console.error('No .log files found in the directory.');
        connection.end();
        return;
    }

    let importedCount = 0;
    for (const file of files) {
        const filePath = path.join(logDir, file);
        let fileContent = '';
        try {
            fileContent = fs.readFileSync(filePath, 'utf8');
        } catch (error) {
            console.error(`Error reading file ${file}:`, error);
            continue;
        }
        // Vérification du format MSS Ericsson
        if (
            fileContent.includes('IMSIS') ||
            fileContent.includes('<anbsp:b=32;') ||
            fileContent.includes('<c7gsp;')
        ) {
            const node = file.replace('.log', '');
            console.log(`\nProcessing MSS Ericsson log file: ${file}`);
            try {
                // Process IMSI Analysis
                await parseImsiAnalysis(fileContent, node);
                // Process B-Number Analysis
                await parseBNumberAnalysis(fileContent, node);
                // Process GT Series
                await parseGTSeries(fileContent, node);
                importedCount++;
            } catch (error) {
                console.error(`Error processing ${file}:`, error);
            }
        } else {
            console.log(`File ${file} ignored: not recognized as a valid MSS Ericsson log.`);
        }
    }
    console.log(`Imported ${importedCount} MSS Ericsson log file(s).`);
    connection.end();
}


async function parseImsiAnalysis(content, nodeName) {
    console.log(`\nParsing IMSI Analysis for ${nodeName}...`);
    const lines = content.split('\n');
    let headerFound = false;
    const data = [];
    let currentImsi = null, currentM = null, currentNA = null, currentAnresValues = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].replace('\r', '').trimEnd();
        const originalLine = lines[i]; // keep the original for indentation check

        // Find the IMSIS header
        if (!headerFound) {
            if (line.includes('IMSIS')) {
                headerFound = true;
                console.log('Found IMSIS header');
                continue;
            }
            continue;
        }

        // Skip empty lines
        if (!line.trim()) continue;

        // If line starts with a number and has the expected format
        const match = line.match(/^(\d+)\s+([^\s]+)\s+(\d+)(?:\s+(.*))?$/);
        if (match) {
            // Save previous record if exists
            if (currentImsi) {
                data.push([
                    nodeName,
                    currentImsi,
                    currentM,
                    currentNA,
                    currentAnresValues.join(', ')
                ]);
                console.log(`Processed record: IMSI=${currentImsi}, M=${currentM}, NA=${currentNA}, ANRES=${currentAnresValues.join(', ')}`);
            }
            // Start new record
            currentImsi = match[1];
            currentM = match[2];
            currentNA = match[3];
            currentAnresValues = match[4] ? [match[4].trim()] : [];
        } else if (currentImsi && /^\s+/.test(originalLine)) {
            // Additional ANRES value (indented line in the original)
            const anresValue = line.trim();
            if (anresValue && !anresValue.includes('IMSIS')) {
                currentAnresValues.push(anresValue);
            }
        }
    }

    // Add the last record
    if (currentImsi) {
        data.push([
            nodeName,
            currentImsi,
            currentM,
            currentNA,
            currentAnresValues.join(', ')
        ]);
        console.log(`Processed final record: IMSI=${currentImsi}, M=${currentM}, NA=${currentNA}, ANRES=${currentAnresValues.join(', ')}`);
    }

    console.log(`Found ${data.length} IMSI records to insert for ${nodeName}`);

    if (data.length > 0) {
        try {
            // First clear existing data for this node
            await connection.promise().query('DELETE FROM mss_imsi_analysis WHERE node_name = ?', [nodeName]);
            console.log(`Cleared existing data for node ${nodeName}`);

            const query = 'INSERT INTO mss_imsi_analysis (node_name, imsi_series, m_value, na_value, anres_value) VALUES ?';
            await connection.promise().query(query, [data]);
            console.log(`Successfully inserted ${data.length} IMSI records for ${nodeName}`);
        } catch (error) {
            console.error(`Error inserting IMSI records for ${nodeName}:`, error);
            throw error;
        }
    } else {
        console.log(`No IMSI records found for ${nodeName}`);
    }
}

async function parseBNumberAnalysis(content, node_name) {
    console.log(`Processing B-Number Analysis for node ${node_name}...`);
    
    // Find the B-NUMBER ANALYSIS DATA section
    const bnumberSection = content.match(/<anbsp:b=32;[\s\S]*?(?=\nEND|\n<|$)/);
    
    if (!bnumberSection) {
        console.log(`No B-Number Analysis section found for node ${node_name}`);
        return;
    }
    
    console.log(`Found B-Number Analysis section for node ${node_name}`);
    
    const lines = bnumberSection[0].split('\n');
    const records = [];
    let currentRecord = null;
    let miscellData = [];
    
    for (const line of lines) {
        // Skip header lines and empty lines
        if (line.includes('B-NUMBER ANALYSIS DATA') || line.includes('<anbsp:b=32;') || 
            line.includes('OPERATING AREA') || line.trim() === '') {
            continue;
        }
        
        // Skip the header line that shows column names
        if (line.includes('B-NUMBER           MISCELL   F/N    ROUTE      CHARGE L       A')) {
            continue;
        }
        
        const trimmedLine = line.trim();
        
        // If line starts with 32-, it's a new B-NUMBER record
        if (trimmedLine.startsWith('32-')) {
            // Save previous record if exists
            if (currentRecord) {
                // Combine all MISCELL data
                if (miscellData.length > 0) {
                    currentRecord[2] = miscellData.join(', ');
                }
                records.push(currentRecord);
                miscellData = []; // Reset MISCELL data for new record
            }
            
            // Parse the main record line
            // Example: "32-1                                RC=250     CC=14  L=10-20 A=300"
            const mainParts = trimmedLine.split(/\s+/);
            
            currentRecord = [
                node_name,                    // node_name
                mainParts[0],                // b_number (e.g., "32-1")
                '',                          // miscell (will be updated with combined data)
                '',                          // f_n (will be updated if BNT is found)
                mainParts.find(p => p.startsWith('RC='))?.replace('RC=', '') || '',    // route
                mainParts.find(p => p.startsWith('CC='))?.replace('CC=', '') || '',    // charge
                mainParts.find(p => p.startsWith('L='))?.replace('L=', '') || '',      // l_value
                mainParts.find(p => p.startsWith('A='))?.replace('A=', '') || ''       // a_value
            ];
            
        } else if (currentRecord && trimmedLine) {
            // Handle additional information lines (D= and BNT=)
            const parts = trimmedLine.split(/\s+/);
            
            if (parts[0] === 'D=') {
                miscellData.push(trimmedLine); // Add D= value to MISCELL data
            } else if (parts[0] === 'BNT=') {
                currentRecord[3] = trimmedLine;  // Update f_n with BNT value
            } else if (parts[0]) {
                miscellData.push(trimmedLine); // Add any other MISCELL data
            }
        }
    }
    
    // Don't forget to add the last record
    if (currentRecord) {
        if (miscellData.length > 0) {
            currentRecord[2] = miscellData.join(', ');
        }
        records.push(currentRecord);
    }
    
    console.log(`Found ${records.length} B-Number Analysis records for node ${node_name}`);
    
    if (records.length > 0) {
        try {
            const query = 'INSERT INTO mss_bnumber_analysis (node_name, b_number, miscell, f_n, route, charge, l_value, a_value) VALUES ?';
            await connection.promise().query(query, [records]);
            console.log(`Successfully inserted ${records.length} B-Number Analysis records for node ${node_name}`);
        } catch (error) {
            console.error(`Error inserting B-Number Analysis records for node ${node_name}:`, error);
        }
    }
}

async function parseGTSeries(content, nodeName) {
    console.log(`\nProcessing GT Series for ${nodeName}...`);
    const gtSection = content.match(/<c7gsp;[^]*?(?=<|$)/);
    
    if (!gtSection) {
        console.log(`No GT Series section found in ${nodeName}`);
        return;
    }
    
    console.log(`Found GT Series section in ${nodeName}`);
    const lines = gtSection[0].split('\n');
    const data = [];

    for (const line of lines) {
        // Skip header lines and empty lines
        if (line.includes('TT') || !line.trim() || line.includes('OPERATING') || line.includes('c7gsp')) continue;

        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5) {
            data.push([
                nodeName,
                parts[0], // TT
                parts[1], // NP
                parts[2], // NA
                parts[3], // NS
                parts[4]  // GTRC
            ]);
        }
    }

    if (data.length > 0) {
        const query = 'INSERT INTO mss_gt_series (node_name, tt, np, na, ns, gtrc) VALUES ?';
        await connection.promise().query(query, [data]);
        console.log(`Inserted ${data.length} GT Series records for ${nodeName}`);
    } else {
        console.log(`No GT Series records found in ${nodeName}`);
    }
} 
