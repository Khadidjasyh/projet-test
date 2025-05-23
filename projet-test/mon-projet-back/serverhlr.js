const fs = require('fs').promises;
const path = require('path');
const mysql = require('mysql2/promise');

// Database connection configuration
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '1234',  // Updated to match your system password
    database: 'mon_projet_db'
};

const parseHlrData = (text) => {
    const lines = text.split('\n').map(line => line.trim());
    const dataStartIndex = lines.findIndex(line => line.startsWith('TT   NP  NA   NS'));

    if (dataStartIndex === -1) {
        console.warn('Warning: Could not find the data section in the HLR file.');
        return [];
    }

    const dataLines = lines.slice(dataStartIndex + 1).filter(line => line !== '' && !line.startsWith('OPERATING'));

    return dataLines.map(line => {
        const columns = line.split(/\s+/).filter(col => col !== '');
        if (columns.length === 5) {
            return {
                tt: columns[0],
                np: columns[1],
                na: columns[2],
                ns: columns[3],
                gtrc: columns[4],
            };
        } else {
            console.warn(`Warning: Skipping line with incorrect number of columns: "${line}"`);
            return null;
        }
    }).filter(item => item !== null);
};

// Route pour l'importation du fichier HLR
router.post('/api/upload-hlr', upload.single('file'), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Aucun fichier n\'a été uploadé' });
    }
  

try {
    // Parser le fichier
    const hlrData = await parseHLRFile(req.file.path);

    // Connexion à la base de données
    const connection = await mysql.createConnection(dbConfig);

    // Insérer les données dans la base
    for (const data of hlrData) {
      await connection.execute(
        'INSERT INTO hlr (tt, np, na, ns, gtrc) VALUES (?, ?, ?, ?, ?)',
        [data.tt, data.np, data.na, data.ns, data.gtrc]
      );
    }

    await connection.end();

    // Supprimer le fichier après import
    await fs.promises.unlink(req.file.path);

    res.json({
      success: true,
      message: `${hlrData.length} enregistrements HLR ont été importés avec succès`
    });
  } catch (error) {
    console.error('Erreur lors de l\'import:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'import du fichier HLR: ' + error.message
    });
  }
});

const importHlrData = async (filePaths) => {
    const connection = await mysql.createConnection(dbConfig);
    const currentDate = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

    try {
        const query = `
            INSERT INTO hlr (tt, np, na, ns, gtrc, imported_date)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        let totalImported = 0;

        for (const filePath of filePaths) {
            try {
                const content = await fs.readFile(filePath, 'utf-8');
                const entries = parseHlrData(content);
                let fileImportedCount = 0;

                for (const entry of entries) {
                    await connection.execute(query, [
                        entry.tt,
                        entry.np,
                        entry.na,
                        entry.ns,
                        entry.gtrc,
                        currentDate
                    ]);
                    fileImportedCount++;
                    console.log(`Imported HLR entry from ${path.basename(filePath)}: TT=${entry.tt}, NP=${entry.np}, NA=${entry.na}, NS=${entry.ns}, GTRC=${entry.gtrc}, Date=${currentDate}`);
                }
                console.log(`✅ Imported ${fileImportedCount} entries from: ${path.basename(filePath)}`);
                totalImported += fileImportedCount;

            } catch (fileError) {
                console.error(`❌ Error importing file ${path.basename(filePath)}:`, fileError);
            }
        }

        console.log(`✅ Successfully imported a total of ${totalImported} entries from all files.`);

    } catch (dbError) {
        console.error('❌ Error during database operations:', dbError);
    } finally {
        if (connection.end) {
            await connection.end();
        }
    }
};

// Define an array of the file paths you want to import
const filesToImport = [
    path.join(__dirname, 'HLR', 'HRFEBMR1 ERICSSON GT_160920.log'),
    path.join(__dirname, 'HLR', 'HRFECNEA1 ERICSSON GT_160920.log'),
    path.join(__dirname, 'HLR', 'HRFEORNI1 ERICSSON GT_160920.log'),
    // Add more file paths here if needed
];

// Main execution function
const main = async () => {
    console.log('Starting HLR data import...');
    try {
        // Run the import for multiple files
        await importHlrData(filesToImport);
        console.log('✅ HLR data import completed successfully');
    } catch (error) {
        console.error('❌ Failed to import HLR data:', error);
    }
};

// Execute the main function
main();