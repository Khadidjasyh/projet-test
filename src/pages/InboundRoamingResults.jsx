import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaChartBar } from 'react-icons/fa';
import axios from 'axios';

const InboundRoamingResults = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5178/inbound-roaming');
        setData(response.data);
        setError(null);
      } catch (error) {
        setError('Erreur lors de la récupération des données.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helpers pour badges colorés
  function getBadge(val) {
    if (!val) return (
      <span className="inline-block px-2 py-0.5 rounded-full text-[13px] font-semibold bg-gray-100 text-gray-700 whitespace-nowrap">
        Aucun
      </span>
    );
    if (val.toLowerCase().includes('réussite') || val.toLowerCase().includes('ok')) {
      return (
        <span className="inline-block px-2 py-0.5 rounded-full text-[13px] font-semibold bg-green-100 text-green-700 whitespace-nowrap">
          Réussit
        </span>
      );
    }
    if (val.toLowerCase().includes('échec') || val.toLowerCase().includes('nok')) {
      return (
        <span className="inline-block px-2 py-0.5 rounded-full text-[13px] font-semibold bg-red-100 text-red-700 whitespace-nowrap">
          Erreur
        </span>
      );
    }
    if (val.toLowerCase().includes('non exécutée')) {
      return (
        <span className="inline-block px-2 py-0.5 rounded-full text-[13px] font-semibold bg-gray-200 text-gray-700 whitespace-nowrap">
          non exécutée
        </span>
      );
    }
    return (
      <span className="inline-block px-2 py-0.5 rounded-full text-[13px] font-semibold bg-gray-100 text-gray-700 whitespace-nowrap">
        {val}
      </span>
    );
  }

  // Helpers pour problèmes et solutions
  function getProblemAndSolution(phase, value, row) {
    const val = (value || '').toLowerCase();
    if (val.includes('réussite') || val.includes('ok')) {
      return {
        problem: `La vérification ${phase} est réussie.`,
        solution: `Aucune action requise pour la phase ${phase}.`
      };
    }
    if (val.includes('échec') || val.includes('nok')) {
      if (phase === "E.212 (IMSI Prefix)") {
        return {
          problem: "Les IMSI Prefix (E.212) ne correspondent pas ou sont absents.",
          solution: "Vérifier la configuration des IMSI Prefix côté partenaire et la base Mobilis. Corriger les écarts détectés."
        };
      }
      if (phase === "E.214 (MGT)") {
        return {
          problem: "Les MGT (E.214) sont incorrects ou manquants.",
          solution: "Vérifier la configuration des MGT dans les fichiers partenaires et la base Mobilis. Mettre à jour les données si besoin."
        };
      }
      if (phase === "Test Final") {
        return {
          problem: "Le test final a échoué.",
          solution: "Analyser les logs, vérifier la configuration des phases précédentes et contacter le partenaire si nécessaire."
        };
      }
    }
    if (val.includes('non exécutée')) {
      return {
        problem: `La phase ${phase} n'a pas été exécutée.`,
        solution: `Vérifier pourquoi la phase ${phase} n'a pas été réalisée et compléter le test si nécessaire.`
      };
    }
    return {
      problem: `Aucune donnée ou statut inconnu pour la phase ${phase}.`,
      solution: `Compléter ou corriger les informations pour la phase ${phase}.`
    };
  }

  const filteredData = data.filter(
    row =>
      (row.operateur && row.operateur.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.country && row.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.phase_1 && row.phase_1.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.phase_2 && row.phase_2.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.test_final && row.test_final.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.commentaire && row.commentaire.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Statistiques
  const total = filteredData.length;
  const totalReussi = filteredData.filter(row => row.test_final && row.test_final.toLowerCase().includes("réussite")).length;
  const totalEchoue = filteredData.filter(row => row.test_final && row.test_final.toLowerCase().includes("échec")).length;
  const tauxReussite = total > 0 ? Math.round((totalReussi * 100) / total) : 0;

  // Génération du rapport TXT avec problèmes et solutions
  const handleExportTXT = () => {
    if (filteredData.length === 0) return;
    let txtContent = 'Rapport Inbound Roaming – Résultats détaillés\n\n';
    filteredData.forEach(row => {
      txtContent += `Opérateur : ${row.operateur}\n`;
      txtContent += `Pays      : ${row.country}\n`;

      // Phase 1
      const phase1 = getProblemAndSolution("E.212 (IMSI Prefix)", row.phase_1, row);
      txtContent += `Phase 1 - Vérification des E.212 (IMSI Prefix) : ${row.phase_1 || "N/A"}\n`;
      txtContent += `  Problème : ${phase1.problem}\n  Solution : ${phase1.solution}\n`;

      // Phase 2
      const phase2 = getProblemAndSolution("E.214 (MGT)", row.phase_2, row);
      txtContent += `Phase 2 - Vérification des E.214 (MGT) : ${row.phase_2 || "N/A"}\n`;
      txtContent += `  Problème : ${phase2.problem}\n  Solution : ${phase2.solution}\n`;

      // Test final
      const final = getProblemAndSolution("Test Final", row.test_final, row);
      txtContent += `Test final : ${row.test_final || "N/A"}\n`;
      txtContent += `  Problème : ${final.problem}\n  Solution : ${final.solution}\n`;

      txtContent += `Commentaire: ${row.commentaire || "Aucun"}\n`;
      txtContent += '\n----------------------------------------\n\n';
    });
    txtContent +=
      "Légende :\n" +
      "réussit = Test réussi, aucune action requise\n" +
      "erreur = Test échoué, action requise\n" +
      "aucun = Données manquantes ou non testées\n\n" +
      "Ce rapport a été généré automatiquement pour faciliter le suivi de la qualité du roaming inbound.\n";
    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'rapport_inbound_roaming.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Buttons row */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => window.history.back()}
          className="flex items-center bg-gray-900 hover:bg-gray-800 text-white font-medium px-4 py-2 rounded shadow transition text-base"
        >
          <FaArrowLeft className="mr-2" size={18} />
          <span>Retour aux tests</span>
        </button>
        <button
          onClick={handleExportTXT}
          className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow transition text-base"
        >
          <FaChartBar className="mr-2" size={18} />
          <span>Générer un rapport</span>
        </button>
      </div>

      {/* Title and description */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Résultats Inbound Roaming</h1>
        <p className="text-lg text-gray-600">
          Visualisation des résultats des tests inbound roaming avec statut par phase
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-base text-gray-500">Total des opérateurs</div>
          <div className="text-4xl font-bold text-gray-800">{total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-base text-gray-500">Tests réussis</div>
          <div className="text-4xl font-bold text-green-600">{totalReussi}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-base text-gray-500">Tests échoués</div>
          <div className="text-4xl font-bold text-gray-800">{totalEchoue}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-base text-gray-500">Taux de réussite</div>
          <div className="text-4xl font-bold text-green-600">{tauxReussite}%</div>
        </div>
      </div>

      {/* Search input */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center gap-3">
        <input
          type="text"
          placeholder="Rechercher par opérateur, pays, statut ou commentaire"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-base text-gray-700 bg-white"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 mb-4 rounded">
          <p>{error}</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded">
          <p>Aucun résultat trouvé</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="min-w-full text-[13px] md:text-[15px]">
            <thead className="sticky top-0 z-10 bg-gray-100">
              <tr>
                <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">Opérateur</th>
                <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">Pays</th>
                <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Vérification des E.212 (IMSI Prefix)</th>
                <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Vérification des E.214 (MGT)</th>
                <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Test Final</th>
                <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left w-[320px] max-w-[350px]">Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((entry, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 border-b font-medium">{entry.operateur}</td>
                  <td className="px-3 py-2 border-b">{entry.country}</td>
                  <td className="px-3 py-2 border-b text-center">{getBadge(entry.phase_1)}</td>
                  <td className="px-3 py-2 border-b text-center">{getBadge(entry.phase_2)}</td>
                  <td className="px-3 py-2 border-b text-center">{getBadge(entry.test_final)}</td>
                  <td className="px-3 py-2 border-b break-words whitespace-pre-line w-[320px] max-w-[350px]">{entry.commentaire}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-2 px-3">
            <span className="text-base text-gray-700">Total: {filteredData.length} résultat(s)</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InboundRoamingResults;