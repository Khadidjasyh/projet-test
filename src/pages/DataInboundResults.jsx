import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaDownload, FaPrint } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DataInboundResults = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5178/inbound-roaming-test');
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
      const reportData = {
        id: `AUD_DI_${now.getTime().toString().slice(-8)}`,
        test_id: 6,
        title: `Rapport Data Inbound - ${now.toLocaleDateString()}`,
        date: now.toISOString().split('T')[0],
        time: now.toTimeString().split(' ')[0],
        status: 'En cours',
        created_by: 'Système',
        total_operators: data.length,
        total_issues: data.filter(row => row.status !== 'Réussi').length,
        results_data: JSON.stringify(data),
        solutions: JSON.stringify([
          "Vérifier la configuration des APN sur le SGSN/MME",
          "Contrôler les accords de roaming data avec les opérateurs partenaires",
          "Vérifier les plages IP allouées",
          "Analyser les logs pour identifier les problèmes potentiels"
        ]),
        validation_notes: `Total : ${data.length}, Échoués : ${data.filter(row => row.status !== 'Réussi').length}`
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
      navigate('/rapport-audit');
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

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Résultats des Tests Data Inbound Roaming</h1>
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
                {data.filter(op => op.status === 'Réussi').length}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="text-sm text-gray-500">Taux de réussite</div>
              <div className="text-2xl font-bold text-blue-600">
                {data.length > 0 ? `${Math.round(
                  data.filter(op => op.status === 'Réussi').length * 100 / data.length
                )}%` : "0%"}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opérateur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pays</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conformité IR21 (%)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conformité IR85 (%)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conformité IMSI (%)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commentaire IP</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commentaire IMSI</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.operateur}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.pays}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.pourcentage_conformite_ir21}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.pourcentage_conformite_ir85}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.pourcentage_conformite_imsi}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{row.commentaire_ip}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{row.commentaire_imsi}</td>
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

export default DataInboundResults;