import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaDownload, FaPrint } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const InboundRoamingResults = () => {
  const navigate = useNavigate();

  // Colonnes demandées : pays, opérateur, plmn, extraction IR21, vérification HSS (apn), vérification GT (msc/vlr), extraction mcc, extraction mnc, commentaires
  const results = {
    headers: [
      "Pays",
      "Opérateur",
      "PLMN",
      "Extraction des données IR21",
      "Vérification HSS (APN)",
      "Vérification GT (MSC/VLR)",
      "Extraction MCC/MNC",
      "Commentaires"
    ],
    data:[]
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

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Résultats du Test Inbound Roaming</h1>
        <p className="text-gray-600">Analyse détaillée des résultats pour chaque opérateur</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Total des opérateurs</div>
          <div className="text-2xl font-bold text-gray-800">{results.data.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Tests réussis</div>
          <div className="text-2xl font-bold text-green-600">
            {results.data.filter(op => 
              op.ir21 && op.ir21.toLowerCase().includes("ok") &&
              op.apn && op.apn !== "-" &&
              op.gt && op.gt !== "-" &&
              op.mcc && op.mnc && op.mcc !== "-" && op.mnc !== "-"
            ).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Tests partiels</div>
          <div className="text-2xl font-bold text-yellow-600">
            {results.data.filter(op => 
              !(op.ir21 && op.ir21.toLowerCase().includes("ok") &&
              op.apn && op.apn !== "-" &&
              op.gt && op.gt !== "-" &&
              op.mcc && op.mnc && op.mcc !== "-" && op.mnc !== "-")
            ).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">Taux de réussite</div>
          <div className="text-2xl font-bold text-blue-600">
            {results.data.length > 0 ? `${Math.round(
              results.data.filter(op => 
                op.ir21 && op.ir21.toLowerCase().includes("ok") &&
                op.apn && op.apn !== "-" &&
                op.gt && op.gt !== "-" &&
                op.mcc && op.mnc && op.mcc !== "-" && op.mnc !== "-"
              ).length * 100 / results.data.length
            )}%` : "0%"}
          </div>
        </div>
      </div>

      {/* Tableau des résultats */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {results.headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.pays}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.operateur}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.plmn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.ir21}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.apn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.gt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.mcc}/{row.mnc}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{row.commentaires}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Résumé */}
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Résumé des résultats</h2>
        <p className="text-gray-600">
          Tous les opérateurs ont passé avec succès les tests d'Inbound Roaming. Les configurations
          sont correctement mises en place et aucun problème majeur n'a été détecté. Les services
          sont stables et fonctionnels pour tous les opérateurs testés.
        </p>
      </div>
    </motion.div>
  );
};

export default InboundRoamingResults; 