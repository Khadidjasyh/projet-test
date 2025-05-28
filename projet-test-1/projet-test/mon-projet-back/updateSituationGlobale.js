const mysql = require('mysql2/promise');

async function updateSituationGlobale() {
  let connection;
  try {
    // Connexion à MySQL
    connection = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "1234",
      database: "mon_projet_db"
    });
    
    console.log("✅ Connecté à MySQL");
    
    // Vérifier si la colonne IMSI existe
    try {
      const [columns] = await connection.execute(`
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'situation_globales' 
        AND COLUMN_NAME = 'imsi'
      `);

      if (columns.length === 0) {
        // La colonne n'existe pas, on l'ajoute
        await connection.execute(`
          ALTER TABLE situation_globales 
          ADD COLUMN imsi VARCHAR(255)
        `);
        console.log("✅ Colonne IMSI ajoutée");
      } else {
        console.log("✅ Colonne IMSI déjà existante");
      }
    } catch (error) {
      console.error("Erreur lors de la vérification/ajout de la colonne IMSI:", error);
      return;
    }

    console.log('Début de la mise à jour...');

    // Récupérer les données des deux tables
    const [situationData] = await connection.execute('SELECT id, operateur FROM situation_globales');
    const [roamingData] = await connection.execute('SELECT operateur, imsi_prefix FROM roaming_partners');

    console.log(`\nDonnées récupérées:`);
    console.log(`- Nombre d'enregistrements dans situation_globales: ${situationData.length}`);
    console.log(`- Nombre d'enregistrements dans roaming_partners: ${roamingData.length}`);
    
    // Afficher les 5 premiers opérateurs de chaque table
    console.log('\nExemples d\'opérateurs dans situation_globales:');
    situationData.slice(0, 5).forEach(item => {
      console.log(`- ${item.operateur}`);
    });
    
    console.log('\nExemples d\'opérateurs dans roaming_partners:');
    roamingData.slice(0, 5).forEach(item => {
      console.log(`- ${item.operateur} (IMSI: ${item.imsi_prefix})`);
    });

    // Fonction pour normaliser les noms d'opérateurs avec plusieurs variations
    const normalizeOperator = (name) => {
      if (!name) return '';
      
      // Liste des mots à supprimer
      const wordsToRemove = [
        'telecom', 'telecommunications', 'mobile', 'communications', 
        'network', 'networks', 'group', 'company', 'ltd', 'limited', 
        's.a', 'sa', 'inc', 'corporation', 'corp', 'co', 'ag', 'ab',
        'plc', 'holdings', 'holding', 'services', 'service', 'wireless',
        'cellular', 'cell', 'digital', 'technology', 'technologies',
        'international', 'natl', 'national', 'tel', 'telco'
      ];
      
      // Liste des mots à remplacer
      const wordsToReplace = {
        'telefonica': 'o2',
        'deutsche telekom': 't-mobile',
        'vodafone group': 'vodafone',
        'orange s.a': 'orange',
        'orange france': 'orange',
        'bouygues telecom': 'bouygues',
        'sfr': 'societe francaise du radiotelephone',
        't-mobile': 'tmobile',
        'tmobile': 't-mobile',
        'deutsche': 'dt',
        'at&t': 'att',
        'at & t': 'att',
        'america movil': 'amx',
        'american mobile': 'amx',
        'bharti airtel': 'airtel',
        'china mobile': 'cmcc',
        'china unicom': 'cu',
        'etisalat': 'eti',
        'hutchison': 'three',
        'mtn group': 'mtn',
        'ooredoo': 'oredo',
        'singtel': 'singapore telecom',
        'sprint': 'softbank',
        'telenor': 'telia',
        'verizon': 'vzw'
      };

      // Remplacer les caractères spéciaux
      let normalized = name.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Enlever les accents
        .replace(/[&.,()\/\\+]/g, '') // Enlever les caractères spéciaux
        .replace(/\s+/g, ' ') // Normaliser les espaces
        .trim();
      
      // Remplacer les abréviations courantes
      normalized = normalized
        .replace(/\btel\b/g, 'telecom')
        .replace(/\btelco\b/g, 'telecom')
        .replace(/\bcomm\b/g, 'communications')
        .replace(/\bsvcs\b/g, 'services')
        .replace(/\bintl\b/g, 'international')
        .replace(/\btech\b/g, 'technology');
      
      // Remplacer les mots selon le mapping
      Object.entries(wordsToReplace).forEach(([oldWord, newWord]) => {
        normalized = normalized.replace(new RegExp(oldWord, 'gi'), newWord);
      });
      
      // Supprimer les mots inutiles
      wordsToRemove.forEach(word => {
        normalized = normalized.replace(new RegExp(`\\b${word}\\b`, 'gi'), '');
      });
      
      // Final cleanup
      normalized = normalized
        .replace(/\s+/g, '_') // Remplacer les espaces par des underscores
        .replace(/-/g, '_')   // Remplacer les tirets par des underscores
        .replace(/_+/g, '_')  // Normaliser les underscores multiples
        .replace(/^_+|_+$/g, '') // Enlever les underscores au début et à la fin
        .replace(/[^a-z0-9_]/g, ''); // Ne garder que les lettres, chiffres et underscores

      return normalized;
    };

    // Créer un mapping des opérateurs vers leurs données avec plusieurs variations
    const operatorMap = {};
    roamingData.forEach(partner => {
      if (partner.operateur && partner.imsi_prefix) {
        const normalizedOperator = normalizeOperator(partner.operateur);
        operatorMap[normalizedOperator] = partner.imsi_prefix;
        
        // Ajouter des variations supplémentaires
        const variations = [
          partner.operateur.toLowerCase(),
          partner.operateur.toLowerCase().replace(/\s+/g, ''),
          partner.operateur.toLowerCase().replace(/\s+/g, '_'),
          partner.operateur.toLowerCase().replace(/\s+/g, '-'),
          normalizedOperator.replace(/_/g, ''),
          normalizedOperator.replace(/_/g, '-')
        ];
        
        // Ajouter des variations avec/sans espaces pour les mots composés
        if (normalizedOperator.includes('_')) {
          variations.push(normalizedOperator.replace(/_/g, ''));
          variations.push(normalizedOperator.split('_').reverse().join('_'));
        }
        
        variations.forEach(variation => {
          if (variation !== normalizedOperator) {
            operatorMap[variation] = partner.imsi_prefix;
          }
        });
      }
    });

    console.log(`\nNombre de correspondances trouvées: ${Object.keys(operatorMap).length}`);

    // Mettre à jour chaque enregistrement
    let updatedCount = 0;
    let notFoundCount = 0;
    console.log("\nDébut de la mise à jour des enregistrements...");

    for (const item of situationData) {
      const normalizedOperator = normalizeOperator(item.operateur);
      const imsiPrefix = operatorMap[normalizedOperator];
      
      if (imsiPrefix) {
        console.log(`Mise à jour de ${item.operateur} (normalisé: ${normalizedOperator}) avec IMSI: ${imsiPrefix}`);
        await connection.execute(
          'UPDATE situation_globales SET imsi = ? WHERE id = ?',
          [imsiPrefix, item.id]
        );
        updatedCount++;
        if (updatedCount % 10 === 0) {
          console.log(`${updatedCount} enregistrements mis à jour...`);
        }
      } else {
        notFoundCount++;
        console.log(`❌ Pas de correspondance trouvée pour l'opérateur: ${item.operateur} (normalisé: ${normalizedOperator})`);
      }
    }

    // Vérifier les données mises à jour
    const [updatedData] = await connection.execute('SELECT id, operateur, imsi FROM situation_globales WHERE imsi IS NOT NULL LIMIT 5');
    console.log('\nExemples de données mises à jour:');
    updatedData.forEach(item => {
      console.log(`- ${item.operateur}: ${item.imsi}`);
    });

    console.log(`\nMise à jour terminée:`);
    console.log(`✅ ${updatedCount} enregistrements mis à jour`);
    console.log(`❌ ${notFoundCount} opérateurs sans correspondance`);

  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

updateSituationGlobale(); 