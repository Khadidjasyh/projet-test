import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaChartBar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const InboundRoamingResults = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allTestsSuccessful, setAllTestsSuccessful] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5178/inbound-roaming');
        setData(response.data);
        setAllTestsSuccessful(response.data.every(entry => entry.test_final === 'réussite'));
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        alert('Erreur lors de la récupération des données. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCellClass = (value) => {
    if (value === 'erreur') return 'bg-red-200 text-red-700 font-semibold';
    if (value === 'réussite') return 'bg-green-200 text-green-700 font-semibold';
    return '';
  };

  const handleGenerateReport = async () => {
    try {
      const now = new Date();
      const dateStr = now.toLocaleString();
      
      // Préparation des données pour le rapport
      const erreurs = data.filter(row => row.test_final === 'erreur');
      const erreurGlobale = erreurs.length > 0 
        ? `Détecté ${erreurs.length} problème(s) dans les tests inbound roaming`
        : "Aucune erreur majeure détectée.";

      // Construction du tableau pour le fichier texte
      const col1 = 'Pays';
      const col2 = 'Opérateur';
      const col3 = 'Phase 1';
      const col4 = 'Phase 2';
      const col5 = 'Test Final';
      const col6 = 'Commentaire';

      const width1 = Math.max(col1.length, ...data.map(r => (r.country || '').length));
      const width2 = Math.max(col2.length, ...data.map(r => (r.operateur || '').length));
      const width3 = Math.max(col3.length, ...data.map(r => (r.phase_1 || '').length));
      const width4 = Math.max(col4.length, ...data.map(r => (r.phase_2 || '').length));
      const width5 = Math.max(col5.length, ...data.map(r => (r.test_final || '').length));
      const width6 = Math.max(col6.length, ...data.map(r => (r.commentaire || '').length));

      const pad = (txt, len) => (txt || '').padEnd(len, ' ');
      const sep = `| ${pad(col1, width1)} | ${pad(col2, width2)} | ${pad(col3, width3)} | ${pad(col4, width4)} | ${pad(col5, width5)} | ${pad(col6, width6)} |\n`;
      const sepLine = `|-${'-'.repeat(width1)}-|-${'-'.repeat(width2)}-|-${'-'.repeat(width3)}-|-${'-'.repeat(width4)}-|-${'-'.repeat(width5)}-|-${'-'.repeat(width6)}-|\n`;
      let table = sep + sepLine;

      data.forEach(row => {
        table += `| ${pad(row.country, width1)} | ${pad(row.operateur, width2)} | ${pad(row.phase_1, width3)} | ${pad(row.phase_2, width4)} | ${pad(row.test_final, width5)} | ${pad(row.commentaire, width6)} |\n`;
      });

      const aide = `\n\n\n🔴 Erreur dans la vérification des E.212 (IMSI Prefix)
Cause probable :
- Format d'IMSI incorrect
- Préfixe IMSI non reconnu
- Données manquantes dans la base

Solutions :
- Vérifier le format de l'IMSI (15 chiffres maximum)
- S'assurer que le préfixe est bien enregistré
- Mettre à jour la base de données des préfixes

🔴 Erreur dans la vérification des E.214 (MGT)
Cause probable :
- Format de MGT incorrect
- MGT non reconnu
- Données manquantes

Solutions :
- Vérifier le format du MGT (14 chiffres)
- S'assurer que le MGT est bien enregistré
- Mettre à jour la base de données des MGT

⚠️ Test partiellement réussi
Cause probable :
- Une seule phase a réussi
- Données incomplètes

Solutions :
- Vérifier les données de la phase en échec
- Compléter les informations manquantes
- Relancer le test après correction
`;

      const txt = `Nom du test : Inbound Roaming\n` +
                  `Date : ${dateStr}\n` +
                  `Erreur globale : ${erreurGlobale}\n\n` +
                  table + aide;

      // Création et téléchargement du fichier
      const blob = new Blob([txt], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport_inbound_roaming_${now.toISOString().slice(0,19).replace(/[:T]/g, "-")}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Préparation des données pour la sauvegarde dans la base de données
      const reportData = {
        id: `AUD_${Date.now()}`,
        test_id: 2, // ID du test Inbound Roaming
        title: `Rapport Inbound Roaming - ${now.toLocaleDateString()}`,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0],
        status: 'En cours',
        created_by: 'Système',
        total_operators: data.length,
        total_issues: erreurs.length,
        results_data: JSON.stringify(data),
        solutions: JSON.stringify([
          "Vérifier le format de l'IMSI (15 chiffres maximum)",
          "S'assurer que le préfixe est bien enregistré",
          "Mettre à jour la base de données des préfixes",
          "Vérifier le format du MGT (14 chiffres)",
          "S'assurer que le MGT est bien enregistré",
          "Mettre à jour la base de données des MGT"
        ]),
        validation_notes: erreurGlobale
      };

      // Sauvegarde dans la base de données
      const response = await fetch('http://localhost:5178/audit-reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reportData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la sauvegarde du rapport');
      }

      alert('Rapport généré et sauvegardé avec succès !');

    } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error);
      alert("Une erreur est survenue lors de la génération du rapport.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-700">Chargement des résultats...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-7xl mx-auto"
    >
        <div className="flex justify-between items-center mb-6">
          <button
          onClick={() => navigate('/roaming-tests')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft />
            <span>Retour aux tests</span>
          </button>

        <div className="text-right">
            <button
            onClick={handleGenerateReport}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
            >
            <FaChartBar />
            <span>Générer un rapport</span>
            </button>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Résultats Inbound Roaming
        </h1>
        <p className="text-gray-600 text-center">
          Visualisez les résultats des tests inbound roaming avec statut par phase
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opérateur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pays</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vérification des E.212 (IMSI Prefix)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vérification des E.214 (MGT – Mobile Global Titles)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Final</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commentaire</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((entry, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.operateur}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.country}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getCellClass(entry.phase_1)}`}>{entry.phase_1}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getCellClass(entry.phase_2)}`}>{entry.phase_2}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getCellClass(entry.test_final)}`}>{entry.test_final}</td>
                  <td className="px-6 py-4 whitespace-pre-wrap text-sm text-gray-700">{entry.commentaire}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default InboundRoamingResults; 