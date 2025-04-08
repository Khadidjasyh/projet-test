const mysql = require("mysql2");
const xlsx = require("xlsx");

// Connexion à MySQL
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "mon_projet_db"
});

// Lecture du fichier Excel
const workbook = xlsx.readFile("MMEs IMSI-GT Roaming Partner MAPPING.xlsx");
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Afficher les en-têtes des colonnes
const range = xlsx.utils.decode_range(worksheet['!ref']);
const headers = [];
for (let C = range.s.c; C <= range.e.c; ++C) {
    const cell = worksheet[xlsx.utils.encode_cell({r: 0, c: C})];
    headers.push(cell ? cell.v : undefined);
}
console.log("En-têtes des colonnes:", headers);

// Convertir en JSON avec les en-têtes personnalisés
const data = xlsx.utils.sheet_to_json(worksheet, {
    raw: true,
    defval: null
});

console.log("Premier enregistrement:", JSON.stringify(data[0], null, 2));

connection.connect((err) => {
    if (err) {
        console.error("Erreur de connexion:", err);
        return;
    }
    console.log("✅ Connecté à MySQL");

    // Vider la table avant l'import
    connection.query("TRUNCATE TABLE roaming_partners", (err) => {
        if (err) {
            console.error("Erreur lors du nettoyage de la table:", err);
            return;
        }

        let processed = 0;
        data.forEach((row, index) => {
            // Convertir les valeurs en chaînes de caractères et nettoyer les espaces
            const imsiPrefix = row['IMSI PREFIX'] ? String(row['IMSI PREFIX']).trim() : null;
            const gt = row['GT'] ? String(row['GT']).trim() : null;
            const operateur = row['OPERATOR'] ? String(row['OPERATOR']).trim() : null;

            const query = `
                INSERT INTO roaming_partners 
                (imsi_prefix, gt, operateur)
                VALUES (?, ?, ?)
            `;

            connection.query(query, [imsiPrefix, gt, operateur], (err) => {
                if (err) {
                    console.error("❌ Erreur insertion ligne", index + 1, ":", err);
                    console.error("Données:", { imsiPrefix, gt, operateur });
                } else {
                    console.log("✅ Ligne", index + 1, "importée:", { imsiPrefix, gt, operateur });
                }
                processed++;
                
                if (processed === data.length) {
                    console.log(`✅ Import terminé! ${processed} lignes traitées`);
                    connection.end();
                }
            });
        });
    });
}); 