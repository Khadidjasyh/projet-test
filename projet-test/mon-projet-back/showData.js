const mysql = require('mysql2');
const Table = require('cli-table3');

// Configuration de la connexion
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'bechafiyasmine',
    database: 'mon_projet_db'
});

// Création d'une table formatée pour l'affichage
const table = new Table({
    head: ['ID', 'Opérateur', 'IMSI Prefix', 'GT', 'MCC', 'MNC', 'Pays', 'Bilatéral', 'Date Création'],
    colWidths: [8, 30, 15, 15, 8, 8, 20, 12, 25]
});

// Connexion et récupération des données
connection.connect((err) => {
    if (err) {
        console.error('❌ Erreur de connexion:', err);
        return;
    }
    console.log('✅ Connecté à MySQL\n');

    // Requête pour récupérer toutes les données
    connection.query('SELECT * FROM roaming_partners', (err, results) => {
        if (err) {
            console.error('❌ Erreur lors de la requête:', err);
            connection.end();
            return;
        }

        // Si aucune donnée n'est trouvée
        if (results.length === 0) {
            console.log('❌ Aucune donnée trouvée dans la table roaming_partners');
            connection.end();
            return;
        }

        // Ajout des données dans la table
        results.forEach(row => {
            table.push([
                row.id,
                row.operator_name || 'N/A',
                row.imsi_prefix || 'N/A',
                row.gt || 'N/A',
                row.mcc || 'N/A',
                row.mnc || 'N/A',
                row.country || 'N/A',
                row.bilateral ? 'Oui' : 'Non',
                new Date(row.created_at).toLocaleString()
            ]);
        });

        // Affichage des statistiques
        console.log(`📊 Statistiques:`);
        console.log(`- Nombre total d'opérateurs: ${results.length}`);
        console.log(`- Nombre d'opérateurs bilatéraux: ${results.filter(r => r.bilateral).length}`);
        console.log('\n');

        // Affichage de la table
        console.log(table.toString());
        
        // Fermeture de la connexion
        connection.end();
    });
}); 