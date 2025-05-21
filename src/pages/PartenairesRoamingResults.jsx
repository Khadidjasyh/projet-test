import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaDownload } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PartenairesRoamingResults = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5178/situation-globale');
        if (!response.ok) throw new Error('Erreur lors de la récupération');
        const res = await response.json();
        setData(res);
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la récupération des données');
      }
    };

    fetchData();
  }, []);

  const handleGenerateReport = async () => {
    try {
      const now = new Date();
      const dateStr = now.toLocaleString();
      
      // Préparation des données pour le rapport
      const missingServices = data.filter(row => row.services_manquants);
      const erreurGlobale = missingServices.length > 0 
        ? `Détecté ${missingServices.length} service(s) manquant(s)`
        : "Aucun service manquant détecté.";

      // Construction du tableau pour le fichier texte
      const col1 = 'Pays';
      const col2 = 'Opérateur';
      const col3 = 'Services Manquants';
      const width1 = Math.max(col1.length, ...data.map(r => (r.pays || '').length));
      const width2 = Math.max(col2.length, ...data.map(r => (r.operateur || '').length));
      const width3 = Math.max(col3.length, ...data.map(r => (r.services_manquants || '').length));

      const pad = (txt, len) => (txt || '').padEnd(len, ' ');
      const sep = `| ${pad(col1, width1)} | ${pad(col2, width2)} | ${pad(col3, width3)} |\n`;
      const sepLine = `|-${'-'.repeat(width1)}-|-${'-'.repeat(width2)}-|-${'-'.repeat(width3)}-|\n`;
      let table = sep + sepLine;

      data.forEach(row => {
        table += `| ${pad(row.pays, width1)} | ${pad(row.operateur, width2)} | ${pad(row.services_manquants, width3)} |\n`;
      });

      const aide = `\n\n\n🔴 Services manquants détectés
Cause probable :
- Services non activés dans le système
- Données manquantes dans la base
- Configuration incomplète

Solutions :
- Vérifier l'activation des services dans le système
- Compléter les données manquantes
- Mettre à jour la configuration des services
- Vérifier les accords de roaming avec les opérateurs
`;

      const txt = `Nom du test : Partenaires Roaming & Services\n` +
                  `Date : ${dateStr}\n` +
                  `Erreur globale : ${erreurGlobale}\n\n` +
                  table + aide;

      // Création et téléchargement du fichier
      const blob = new Blob([txt], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport_partenaires_roaming_${now.toISOString().slice(0,19).replace(/[:T]/g, "-")}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Préparation des données pour la sauvegarde dans la base de données
      const simplifiedData = data.map(row => ({
        pays: row.pays,
        operateur: row.operateur,
        services_manquants: row.services_manquants
      }));

      const reportData = {
        id: `AUD_${Date.now()}`,
        test_id: 1,
        title: `Rapport Partenaires Roaming - ${now.toLocaleDateString()}`,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0],
        status: 'En cours',
        created_by: 'Système',
        total_operators: data.length,
        total_issues: missingServices.length,
        results_data: JSON.stringify(simplifiedData),
        solutions: JSON.stringify([
          "Vérifier l'activation des services dans le système",
          "Compléter les données manquantes",
          "Mettre à jour la configuration des services",
          "Vérifier les accords de roaming avec les opérateurs"
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
            <FaDownload />
            <span>Générer un rapport</span>
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Résultats Partenaires Roaming
        </h1>
        <p className="text-gray-600 text-center">
          Analyse des services manquants par opérateur
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pays</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opérateur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services Manquants</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.pays}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.operateur}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{row.services_manquants}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default PartenairesRoamingResults; 