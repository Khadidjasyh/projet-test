import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaDownload, FaPrint } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const DataInboundResults = () => {
  const navigate = useNavigate();

  const results = {
    headers: [
      "Opérateur",
      "Vérification IR.21 sur SGSN/MME",
      "Vérification des plages IP",
      "Commentaires"
    ],
    data: [
      {
        operateur: "Mobilis",
        verificationIr21: "✅ Réussi",
        verificationPlagesIp: "✅ Réussi",
        commentaires: "Les configurations IR.21 sont bien intégrées dans le SGSN/MME. Les plages IP pour roamers sont actives et fonctionnelles."
      },
      {
        operateur: "Orange",
        verificationIr21: "✅ Réussi",
        verificationPlagesIp: "✅ Réussi",
        commentaires: "Informations partenaires IR.21 bien présentes. Attribution d'IP conforme pour les abonnés en itinérance."
      },
      {
        operateur: "Djezzy",
        verificationIr21: "✅ Réussi",
        verificationPlagesIp: "✅ Réussi",
        commentaires: "Aucune erreur de configuration détectée. L'attribution dynamique d'IP fonctionne sans anomalie."
      },
      {
        operateur: "Ooredoo",
        verificationIr21: "✅ Réussi",
        verificationPlagesIp: "✅ Réussi",
        commentaires: "Le routage des données est opérationnel. Les plages IP sont bien isolées pour les roamers entrants."
      }
    ]
  };

  const handleBack = () => {
    navigate('/roaming-tests');
  };

  const handleDownload = () => {
    // Logique pour télécharger le rapport
    console.log('Téléchargement du rapport...');
  };

  const handlePrint = () => {
    window.print();
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
              onClick={handleDownload}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200"
            >
              <FaDownload />
              <span>Télécharger</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
            >
              <FaPrint />
              <span>Imprimer</span>
            </button>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Résultats des Tests Data Inbound Roaming</h1>
        <p className="text-gray-600">Analyse de la vérification IR.21 sur SGSN/MME et des plages IP pour les visiteurs étrangers</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total des opérateurs</div>
          <div className="text-2xl font-bold text-gray-800">{results.data.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Tests réussis</div>
          <div className="text-2xl font-bold text-green-600">
            {results.data.filter(op => 
              op.verificationIr21.includes("Réussi") &&
              op.verificationPlagesIp.includes("Réussi")
            ).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Taux de réussite</div>
          <div className="text-2xl font-bold text-blue-600">100%</div>
        </div>
      </div>

      {/* Tableau de résultats */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {results.headers.map((header, idx) => (
                <th 
                  key={idx} 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {results.data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.operateur}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.verificationIr21}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.verificationPlagesIp}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{row.commentaires}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Conclusion */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200 mb-8">
        <h2 className="text-xl font-bold text-blue-800 mb-2">Conclusion</h2>
        <p className="text-blue-700">
          Les tests Data Inbound Roaming ont été réalisés avec succès pour tous les opérateurs testés.
          Les configurations IR.21 sont correctement intégrées dans les systèmes SGSN/MME, et les plages IP
          sont bien configurées pour les visiteurs étrangers.
          Ces résultats confirment que les utilisateurs étrangers pourront accéder aux services data en itinérance
          sans problèmes techniques.
        </p>
      </div>
    </motion.div>
  );
};

export default DataInboundResults;
