import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const InboundRoamingResults = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allTestsSuccessful, setAllTestsSuccessful] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.post('http://localhost:3000/api/inbound-roaming')
      .then(res => {
        const results = Array.isArray(res.data) ? res.data : [];
        setData(results);
        setAllTestsSuccessful(results.every(entry => entry.test_final === 'réussite'));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setLoading(false);
      });
  }, []);

  const getCellClass = (value) => {
    if (value === 'erreur') return 'bg-red-200 text-red-700 font-semibold';
    if (value === 'réussite') return 'bg-green-200 text-green-700 font-semibold';
    return '';
  };

  const handleGenerateReport = () => {
    alert('📄 Rapport généré (fonction à implémenter si besoin)');
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

        {/* Bloc "Générer un rapport" */}
        <div className="text-right">
          <p className={`font-semibold mb-1 ${allTestsSuccessful ? 'text-green-600' : 'text-red-600'}`}>
            {allTestsSuccessful
              ? '✅ Le test inbound est une réussite'
              : '❌ Le test inbound a des échecs'}
          </p>
          <br></br>
            <button
              onClick={handleGenerateReport}
              className="bg-green-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
            >
              Générer un rapport
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test  Final</th>
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