const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors({ origin: 'http://localhost:5176' }));
app.use(express.json());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'Aaa!121212',
  database: 'mon_projet_db',
};

function cleanPrefix(value) {
  return value ? value.replace(/\s/g, '').trim() : '';
}

async function runInboundRoamingTest() {
  const connection = await mysql.createConnection(dbConfig);

  const [ir21] = await connection.execute('SELECT * FROM ir21_data');
  const [ir85] = await connection.execute('SELECT * FROM ir85_data');
  const [mss] = await connection.execute('SELECT * FROM mss_imsi_analysis');
  const [mobiles] = await connection.execute('SELECT * FROM mobile_networks');

  const resultsMap = {};

  const processTest = (source, label) => {
    for (const entry of source) {
      const country = entry.pays || 'Inconnu';
      const operateur = entry.tadig || 'Inconnu';
      const key = `${country}-${operateur}`;

      const e212_list = cleanPrefix(entry.e212).split(',').map(e => e.trim()).filter(Boolean);
      const e214_list = cleanPrefix(entry.e214).split(',').map(e => e.trim()).filter(Boolean);

      let phase1_success = false;
      let phase2_success = false;

      const e212_trouves = [];
      const e212_non_trouves = [];

      for (const imsi of e212_list) {
        const found = (
          mss.some(row => row.imsi_series && row.imsi_series.startsWith(imsi)) ||
          mobiles.some(row => row.imsi_prefix && row.imsi_prefix.startsWith(imsi))
        );
        if (found) e212_trouves.push(imsi);
        else e212_non_trouves.push(imsi);
      }

      if (e212_trouves.length > 0) {
        phase1_success = true;

        const e214_trouves = [];
        const e214_non_trouves = [];

        for (const e214 of e214_list) {
          const found = (
            mss.some(row => row.m_value && row.m_value.replace(/^m_/, '').trim() === e214) ||
            mobiles.some(row => row.msisdn_prefix && row.msisdn_prefix.trim() === e214)
          );
          if (found) e214_trouves.push(e214);
          else e214_non_trouves.push(e214);
        }

        if (e214_trouves.length > 0) {
          phase2_success = true;
        }

        if (!phase2_success) {
          const reason = `Les MSISDN Prefix (${e214_non_trouves.join(', ')}) ne sont pas trouvés dans ${label}. Cela indique une absence de configuration de routage E.214.`;
          if (!resultsMap[key]) resultsMap[key] = { country, operateur, phase_1: 'réussite', phase_2: 'échec', test_final: 'échec', commentaires: [] };
          resultsMap[key].phase_2 = 'échec';
          resultsMap[key].test_final = 'échec';
          resultsMap[key].commentaires.push(reason);
        }
      } else {
        const reason = `Les IMSI Prefix (${e212_non_trouves.join(', ')}) sont absents dans ${label}, phase 2 non exécutée. Cela signifie que les abonnés du partenaire ne seront pas reconnus dans les MSS/MSC.`;
        if (!resultsMap[key]) resultsMap[key] = { country, operateur, phase_1: 'échec', phase_2: 'non exécutée', test_final: 'échec', commentaires: [] };
        resultsMap[key].phase_1 = 'échec';
        resultsMap[key].phase_2 = 'non exécutée';
        resultsMap[key].test_final = 'échec';
        resultsMap[key].commentaires.push(reason);
      }

      if (phase1_success && phase2_success) {
        if (!resultsMap[key]) {
          resultsMap[key] = {
            country,
            operateur,
            phase_1: 'réussite',
            phase_2: 'réussite',
            test_final: 'réussite',
            commentaires: ['Les IMSI et MSISDN Prefix sont bien configurés dans les MSS et dans la base mobile_networks. Aucun problème détecté.'],
          };
        }
      }
    }
  };

  processTest(ir21, 'IR.21');
  processTest(ir85, 'IR.85');

  const finalResults = Object.values(resultsMap).map(entry => ({
    ...entry,
    commentaire: entry.commentaires.join(' '),
  }));

  await connection.end();
  return finalResults;
}

app.post('/api/inbound-roaming', async (req, res) => {
  try {
    const results = await runInboundRoamingTest();
    res.json(results);
  } catch (error) {
    console.error('Erreur Inbound Roaming:', error);
    res.status(500).json({ error: 'Erreur serveur Inbound Roaming' });
  }
});

app.listen(3000, () => {
  console.log('✅ Serveur démarré sur http://localhost:3000');
});