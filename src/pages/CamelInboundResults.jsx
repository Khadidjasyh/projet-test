import React, { useState, useEffect } from 'react';
import { FaChartBar, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CamelInboundResults = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const filteredData = data.filter(
    row =>
      (row.operateur && row.operateur.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.pays && row.pays.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.tadig && row.tadig.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.Valeur_CAMEL_IR && row.Valeur_CAMEL_IR.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.ValeurObservee && row.ValeurObservee.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.Resultat && row.Resultat.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.Commentaire && row.Commentaire.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Statistiques
  const total = filteredData.length;
  const totalReussi = filteredData.filter(row => row.Resultat && row.Resultat.toLowerCase().includes("réussi")).length;
  const totalEchoue = filteredData.filter(row => row.Resultat && (row.Resultat.toLowerCase().includes("échoué") || row.Resultat.toLowerCase().includes("echec") || row.Resultat.toLowerCase().includes("non conforme"))).length;
  const tauxReussite = total > 0 ? Math.round((totalReussi * 100) / total) : 0;

  // Helper to display text instead of emoji
  function getResultText(result) {
    if (!result) return "aucun";
    const val = result.toLowerCase();
    if (val.includes("réussi")) return "réussit";
    if (val.includes("échoué") || val.includes("echec") || val.includes("non conforme")) return "erreur";
    return "aucun";
  }

  const handleExportTXT = () => {
    if (filteredData.length === 0) return;

    let txtContent = 'Rapport Analyse CAMEL Inbound – Tests Inbound Roaming ATM Mobilis\n\n';

    filteredData.forEach(row => {
      txtContent += `Opérateur : ${row.operateur}\n`;
      txtContent += `Pays      : ${row.pays}\n`;
      txtContent += `TADIG     : ${row.tadig}\n`;
      txtContent += `Valeur CAMEL Inbound (IR.21/IR.85) : ${row.Valeur_CAMEL_IR}\n`;
      txtContent += `Valeur observée ANRES : ${row.ValeurObservee}\n`;
      txtContent += `Résultat du test CAMEL Inbound : ${getResultText(row.Resultat)}\n`;
      txtContent += `Commentaire : ${row.Commentaire}\n`;
      txtContent += '\n----------------------------------------\n\n';
    });

    txtContent +=
      "Légende :\n" +
      "réussit = Test réussi, aucune action requise\n" +
      "erreur = Test échoué, action requise\n" +
      "aucun = Données manquantes ou non testées\n\n" +
      "Ce rapport a été généré automatiquement pour faciliter le suivi de la qualité du roaming inbound sur le réseau ATM Mobilis.\n" +
      "Pour toute anomalie, contacter l’équipe Roaming ou IT Mobilis.\n";

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'rapport_camel_inbound_analyse.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Buttons row */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => window.history.back()}
          className="flex items-center bg-gray-900 hover:bg-gray-800 text-white font-medium px-4 py-2 rounded shadow transition text-sm"
        >
          <FaArrowLeft className="mr-2" size={16} />
          <span>Retour aux tests</span>
        </button>
        <button
          onClick={handleExportTXT}
          className="flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow transition text-sm"
        >
          <FaChartBar className="mr-2" size={16} />
          <span>Générer un rapport</span>
        </button>
      </div>

      {/* Title and description */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Analyse CAMEL Inbound</h1>
        <p className="text-gray-600">
          Comparaison des valeurs IR.21/IR.85 et observées (anres_value) pour le roaming entrant
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500">Total des opérateurs</div>
          <div className="text-3xl font-bold text-gray-800">{total}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500">Tests réussis</div>
          <div className="text-3xl font-bold text-green-600">{totalReussi}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500">Tests échoués</div>
          <div className="text-3xl font-bold text-gray-800">{totalEchoue}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500">Taux de réussite</div>
          <div className="text-3xl font-bold text-green-600">{tauxReussite}%</div>
        </div>
      </div>

      {/* Search input */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
        <input
          type="text"
          placeholder="Rechercher par opérateur, pays, TADIG "
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-700 bg-white"
        />
      </div>

      {/* Table */}
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

      {!loading && !error && filteredData.length === 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded">
          <p>Aucun résultat trouvé</p>
        </div>
      )}

      {!loading && filteredData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10 bg-gray-100">
              <tr>
                <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">Opérateur</th>
                <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">Pays</th>
                <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">TADIG</th>
                <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Valeur CAMEL Inbound (IR.21/IR.85)</th>
                <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Valeur observée ANRES</th>
                <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Résultat du test</th>
                <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr key={row.operateur + row.pays + row.tadig + idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 border-b font-medium">{row.operateur}</td>
                  <td className="px-3 py-2 border-b">{row.pays}</td>
                  <td className="px-3 py-2 border-b text-center">{row.tadig}</td>
                  <td className="px-3 py-2 border-b text-center">{row.Valeur_CAMEL_IR}</td>
                  <td className="px-3 py-2 border-b text-center">{row.ValeurObservee}</td>
                  <td className="px-3 py-2 border-b text-center">
                    {getResultText(row.Resultat)}
                  </td>
                  <td className="px-3 py-2 border-b">{row.Commentaire}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4 px-4">
            <span className="text-sm text-gray-700">Total: {filteredData.length} résultat(s)</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CamelInboundResults;