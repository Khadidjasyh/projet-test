import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaDownload, FaPrint } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CamelInboundResults = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5178/camel-inbound-test');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(`Erreur lors du chargement des résultats: ${err.message}`);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBack = () => {
    navigate('/roaming-tests');
  };

  const handleDownload = () => {
    console.log('Téléchargement du rapport...');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateReport = async () => {
    try {
      const now = new Date();

      // --- Logique de téléchargement local du rapport TXT ---
      let txtContent = 'Rapport CAMEL Inbound – Tests Inbound Roaming ATM Mobilis\n\n';

      // Ajouter les en-têtes du tableau
      const headers = ['Opérateur', 'Pays', 'TADIG', 'Valeur CAMEL Inbound (IR.21/IR.85)', 'Valeur observée ANRES', 'Résultat du test', 'Commentaires'];
      const columnWidths = headers.map(header => header.length);

      // Calculer la largeur maximale pour chaque colonne en fonction des données
      data.forEach(row => {
          columnWidths[0] = Math.max(columnWidths[0], (row.operateur || '').length);
          columnWidths[1] = Math.max(columnWidths[1], (row.pays || '').length);
          columnWidths[2] = Math.max(columnWidths[2], (row.tadig || '').length);
          columnWidths[3] = Math.max(columnWidths[3], (row.Valeur_CAMEL_IR || '').length);
          columnWidths[4] = Math.max(columnWidths[4], (row.ValeurObservee || '').length);
          columnWidths[5] = Math.max(columnWidths[5], (row.Resultat || '').length);
          columnWidths[6] = Math.max(columnWidths[6], (row.Commentaire || '').length);
      });

      const padText = (text, width) => (text || '').padEnd(width, ' ');

      // Ajouter la ligne d'en-têtes formatée
      txtContent += '|' + headers.map((header, i) => ` ${padText(header, columnWidths[i])} `).join('|') + '|\n';
      // Ajouter la ligne de séparation
      txtContent += '|' + columnWidths.map(width => '-'.repeat(width + 2)).join('|') + '|\n';

      // Ajouter les lignes de données formatées
      data.forEach(row => {
          txtContent += '|' + [
              padText(row.operateur, columnWidths[0]),
              padText(row.pays, columnWidths[1]),
              padText(row.tadig, columnWidths[2]),
              padText(row.Valeur_CAMEL_IR, columnWidths[3]),
              padText(row.ValeurObservee, columnWidths[4]),
              padText(row.Resultat, columnWidths[5]),
              padText(row.Commentaire, columnWidths[6]),
          ].map((text, i) => ` ${text} `).join('|') + '|\n';
      });

      txtContent += '\n\nLégende :\n';
      txtContent += '✅ = Test réussi, aucune action requise\n';
      txtContent += '❌ = Test échoué, action requise\n';
      txtContent += '⚠️ = Attention, données manquantes ou incohérentes\n';
      txtContent += 'ℹ️ = Information complémentaire\n\n';
      txtContent += 'Ce rapport a été généré automatiquement.\n';

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
      link.setAttribute('download', `rapport_camel_inbound_${now.toISOString().slice(0,19).replace(/[:T]/g, "-")}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
      // --- Fin logique de téléchargement local ---

      const reportData = {
        id: `AUD_CI_${now.getTime().toString().slice(-8)}`,
        test_id: 4,
        title: `Rapport CAMEL Inbound - ${now.toLocaleDateString()}`,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0],
        status: 'En cours',
        created_by: 'Système',
        total_operators: data.length,
        total_issues: data.filter(row => row.Resultat !== 'Réussi').length,
        results_data: JSON.stringify(data),
        solutions: JSON.stringify([
          "Vérifier la configuration CAMEL sur le HLR/HSS",
          "Contrôler les accords de roaming avec les opérateurs partenaires",
          "Vérifier la signalisation MAP/CAP",
          "Analyser les logs pour identifier les problèmes potentiels"
        ]),
        validation_notes: `Total : ${data.length}, Échoués : ${data.filter(row => row.Resultat !== 'Réussi').length}`
      };

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
      console.error('Erreur lors de la génération du rapport:', error);
      alert('Une erreur est survenue lors de la génération du rapport: ' + error.message);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 max-w-7xl mx-auto"
    >
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft />
            <span>Retour aux tests</span>
          </button>
          <div className="flex space-x-4">
        <button
              onClick={handleGenerateReport}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
              <span>Générer un rapport</span>
        </button>
          </div>
      </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Résultats des Tests CAMEL Phase Service Inbound Roaming</h1>
        <p className="text-gray-600">Analyse détaillée des résultats pour chaque opérateur</p>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 mb-4 rounded">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-500">Total des opérateurs</div>
              <div className="text-2xl font-bold text-gray-800">{data.length}</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-500">Tests réussis</div>
              <div className="text-2xl font-bold text-green-600">
                {data.filter(op => op.Resultat === 'Réussi').length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-500">Taux de réussite</div>
              <div className="text-2xl font-bold text-blue-600">
                {data.length > 0 ? `${Math.round(
                  data.filter(op => op.Resultat === 'Réussi').length * 100 / data.length
                )}%` : "0%"}
              </div>
            </div>
        </div>

          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opérateur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pays</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TADIG</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valeur CAMEL Inbound (IR.21/IR.85)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valeur observée ANRES</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Résultat du test</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commentaires</th>
              </tr>
            </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.operateur}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.pays}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.tadig}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.Valeur_CAMEL_IR}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.ValeurObservee}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        row.Resultat === 'Réussi' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {row.Resultat}
                      </span>
                  </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{row.Commentaire}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded">
          <p>Aucun résultat disponible</p>
        </div>
      )}
    </motion.div>
  );
};

export default CamelInboundResults;