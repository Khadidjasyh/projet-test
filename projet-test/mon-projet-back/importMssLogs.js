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

async function processLogFiles() {
    // Use the MSS_Ericson directory in the parent directory
    const logDir = path.join(__dirname, 'MSS_Ericson');
    const ericssonNodes = ['BCORN1', 'BCMUS1', 'BCCNM1', 'BCCNE1', 'BCBMR1', 'BCANA1'];

    // First check if any log files exist
    const existingFiles = ericssonNodes.filter(node => {
        const filePath = path.join(logDir, `${node}.log`);
        return fs.existsSync(filePath);
    });

    if (existingFiles.length === 0) {
        console.error('No log files found in the current directory. Please ensure the following files exist:');
        ericssonNodes.forEach(node => console.log(`- ${node}.log`));
        connection.end();
        return;
    }

    console.log(`Found ${existingFiles.length} log files to process`);

    for (const node of existingFiles) {
        const filePath = path.join(logDir, `${node}.log`);
        console.log(`\nProcessing ${node} log file...`);

        try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            
            // Process IMSI Analysis
            await parseImsiAnalysis(fileContent, node);
            
            // Process B-Number Analysis
            await parseBNumberAnalysis(fileContent, node);
            
            // Process GT Series
            await parseGTSeries(fileContent, node);

        } catch (error) {
            console.error(`Error processing ${node}:`, error);
            console.error(`Please ensure the file exists at: ${filePath}`);
        }
    }
    
    console.log('All files processed');
    connection.end();
}

async function parseImsiAnalysis(content, nodeName) {
    const imsiSection = content.match(/<mgisp:imsis=all;[^]*?(?=<|$)/);
    if (!imsiSection) return;

    const lines = imsiSection[0].split('\n');
    const data = [];

    for (const line of lines) {
        // Skip header lines and empty lines
        if (line.includes('IMSIS') || !line.trim() || line.includes('OPERATING') || line.includes('mgisp')) continue;

        const parts = line.trim().split(/\s+/);
        if (parts.length >= 3) {
            data.push([
                nodeName,
                parts[0], // IMSIS
                parts[1], // M
                parts[2], // NA
                parts[3] || '' // ANRES
            ]);
        }
    }

    if (data.length > 0) {
        const query = 'INSERT INTO mss_imsi_analysis (node_name, imsi_series, m_value, na_value, anres_value) VALUES ?';
        await connection.promise().query(query, [data]);
        console.log(`Inserted ${data.length} IMSI records for ${nodeName}`);
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