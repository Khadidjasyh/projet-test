import React, { useState, useEffect } from 'react';

const CamelOutboundResults = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5178/camel-outbound-analyse');
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
      (row["Valeur IR (IR.21/IR.85)"] && row["Valeur IR (IR.21/IR.85)"].toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row["Valeur observée (anres_value)"] && row["Valeur observée (anres_value)"].toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row["Résultat du test CAMEL Outbound"] && row["Résultat du test CAMEL Outbound"].toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.Commentaire && row.Commentaire.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Génération du rapport TXT
  const handleExportTXT = () => {
    if (filteredData.length === 0) return;

    let txtContent = 'Rapport Analyse CAMEL Outbound\n\n';

    filteredData.forEach(row => {
      txtContent += `Opérateur : ${row.operateur}\n`;
      txtContent += `Pays      : ${row.pays}\n`;
      txtContent += `Valeur CAMEL Outbound (IR.21/IR.85) : ${row["Valeur IR (IR.21/IR.85)"]}\n`;
      txtContent += `Valeur observée ANRES : ${row["Valeur observée (anres_value)"]}\n`;
      txtContent += `Résultat du test CAMEL Outbound : ${row["Résultat du test CAMEL Outbound"] === "Réussi" ? "✅" : "❌"}\n`;
      txtContent += `Commentaire : ${row.Commentaire}\n`;
      txtContent += '\n----------------------------------------\n\n';
    });

    const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'rapport_camel_outbound_analyse.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analyse CAMEL Outbound</h1>
          <p className="text-gray-600">Comparaison des valeurs IR.21/IR.85 et observées (anres_value)</p>
        </div>
        <button
          onClick={handleExportTXT}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition"
        >
          Générer rapport
        </button>
      </div>

      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
        <input
          type="text"
          placeholder="Rechercher par opérateur, pays, valeur IR, observée ou commentaire"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-gray-700 bg-white"
        />
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
                <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Valeur CAMEL Outbound (IR.21/IR.85)</th>
                <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Valeur observée ANRES</th>
                <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Résultat du test</th>
                <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr key={row.operateur + row.pays + idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-3 py-2 border-b font-medium">{row.operateur}</td>
                  <td className="px-3 py-2 border-b">{row.pays}</td>
                  <td className="px-3 py-2 border-b text-center">{row["Valeur IR (IR.21/IR.85)"]}</td>
                  <td className="px-3 py-2 border-b text-center">{row["Valeur observée (anres_value)"]}</td>
                  <td className="px-3 py-2 border-b text-center">
                    {row["Résultat du test CAMEL Outbound"] === "Réussi" ? "✅" : "❌"}
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

export default CamelOutboundResults;