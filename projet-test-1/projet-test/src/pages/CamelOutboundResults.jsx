import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCheckCircle, FaDownload, FaPrint } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CamelOutboundResults = () => {
  const navigate = useNavigate();

  const results = {
    headers: [
      "Opérateur",
      "Comparaison des données (np, tt, na) avec IR.21 et E.214",
      "Vérification des listes VPLMN GT sur HPLMN HLR/HSS",
      "Commentaires"
    ],
    data: [
      {
        operateur: "Mobilis",
        comparaisonDonnees: "✅ Réussi",
        verificationListes: "✅ Réussi",
        commentaires: "Les données np, tt, na du fichier audit CS.rar sont conformes aux informations dans IR.21 et E.214. Les listes VPLMN GT sont bien configurées dans HLR/HSS."
      },
      {
        operateur: "Orange",
        comparaisonDonnees: "✅ Réussi",
        verificationListes: "✅ Réussi",
        commentaires: "Aucune différence observée entre les données dans le fichier d'audit et celles dans IR.21 et E.214. Configuration VPLMN GT correcte dans HLR/HSS."
      },
      {
        operateur: "Djezzy",
        comparaisonDonnees: "✅ Réussi",
        verificationListes: "✅ Réussi",
        commentaires: "Les données sont validées, et aucune anomalie n'a été détectée lors de la comparaison avec IR.21 et E.214. Les listes VPLMN GT sont présentes et bien configurées."
      },
      {
        operateur: "Ooredoo",
        comparaisonDonnees: "✅ Réussi",
        verificationListes: "✅ Réussi",
        commentaires: "Les comparaisons avec le fichier audit CS.rar, IR.21, et E.214 ont été validées. Listes VPLMN GT bien intégrées dans HLR/HSS pour un routage fiable."
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

        <h1 className="text-3xl font-bold text-gray-800 mb-2">Résultats des Tests CAMEL Phase Service Outbound Roaming</h1>
        <p className="text-gray-600">Analyse de la comparaison des données avec IR.21, E.214 et vérification des listes VPLMN GT</p>
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
              op.comparaisonDonnees.includes("Réussi") &&
              op.verificationListes.includes("Réussi")
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.comparaisonDonnees}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.verificationListes}</td>
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
          Les tests CAMEL Phase Service pour l'Outbound Roaming ont été réalisés avec succès pour tous les opérateurs testés.
          Toutes les données sont conformes aux standards IR.21 et E.214, et les listes VPLMN GT sont correctement configurées dans HLR/HSS.
          Aucune anomalie n'a été détectée, permettant un service roaming fiable pour les utilisateurs voyageant à l'étranger.
        </p>
      </div>
    </motion.div>
  );
};

export default CamelOutboundResults;
