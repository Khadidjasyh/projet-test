import React, { useState, useEffect } from 'react';

const DataInboundResults = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDetail, setOpenDetail] = useState(null);

  // Récupération des données depuis l'API
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5178/inbound-roaming-test');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(`Erreur lors du chargement des opérateurs: ${err.message}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrage par opérateur, pays, pourcentages ou commentaires
  const filteredData = data.filter(
    row =>
      (row.operateur && row.operateur.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.pays && row.pays.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.pourcentage_conformite_ir21 !== undefined && row.pourcentage_conformite_ir21.toString().includes(searchTerm)) ||
      (row.pourcentage_conformite_ir85 !== undefined && row.pourcentage_conformite_ir85.toString().includes(searchTerm)) ||
      (row.pourcentage_conformite_imsi !== undefined && row.pourcentage_conformite_imsi.toString().includes(searchTerm)) ||
      (row.commentaire_ip && row.commentaire_ip.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (row.commentaire_imsi && row.commentaire_imsi.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Génération du rapport TXT
  const handleExportTXT = () => {
    if (filteredData.length === 0) return;

    let txtContent = 'Rapport Inbound Roaming\n\n';

    filteredData.forEach(row => {
      txtContent += `Opérateur : ${row.operateur}\n`;
      txtContent += `Pays      : ${row.pays}\n`;
      txtContent += `Conformité IR21 : ${row.pourcentage_conformite_ir21}%\n`;
      txtContent += `Conformité IR85 : ${row.pourcentage_conformite_ir85}%\n`;
      txtContent += `Conformité IMSI : ${row.pourcentage_conformite_imsi}%\n`;
      txtContent += `Commentaire IP  : ${row.commentaire_ip}\n`;
      txtContent += `Commentaire IMSI: ${row.commentaire_imsi}\n`;
      txtContent += `IPs Firewall    : ${(Array.isArray(row.adresses_ip_firewall) && row.adresses_ip_firewall.length > 0) ? row.adresses_ip_firewall.join(', ') : ''}\n`;
      txtContent += `IMSIs           : ${(Array.isArray(row.imsis_mme) && row.imsis_mme.length > 0) ? row.imsis_mme.join(', ') : ''}\n`;
      txtContent += `E212 IR21       : ${(Array.isArray(row.e212_ir21) && row.e212_ir21.length > 0) ? row.e212_ir21.join(', ') : ''}\n`;
      txtContent += '\n----------------------------------------\n\n';
    });

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
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Vérification Inbound Roaming</h1>
          <p className="text-gray-600">Visualisation des opérateurs, conformité IPs et IMSI</p>
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
          placeholder="Rechercher par opérateur, pays, conformité ou commentaire"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-gray-700 bg-white"
        />
      </div>

      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10 bg-gray-100">
                <tr>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">Opérateur</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">Pays</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Conformité IR21</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Conformité IR85</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Conformité IMSI</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">Commentaire IP</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-left">Commentaire IMSI</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Détails</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, idx) => (
                  <React.Fragment key={row.operateur + row.pays}>
                    <tr className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-3 py-2 border-b font-medium">{row.operateur}</td>
                      <td className="px-3 py-2 border-b">{row.pays}</td>
                      <td className="px-3 py-2 border-b text-center">{row.pourcentage_conformite_ir21}%</td>
                      <td className="px-3 py-2 border-b text-center">{row.pourcentage_conformite_ir85}%</td>
                      <td className="px-3 py-2 border-b text-center">{row.pourcentage_conformite_imsi}%</td>
                      <td className="px-3 py-2 border-b">{row.commentaire_ip}</td>
                      <td className="px-3 py-2 border-b">{row.commentaire_imsi}</td>
                      <td className="px-3 py-2 border-b text-center">
                        <button
                          className="text-green-600 underline"
                          onClick={() => setOpenDetail(openDetail === idx ? null : idx)}
                        >
                          {openDetail === idx ? 'Masquer' : 'Détails'}
                        </button>
                      </td>
                    </tr>
                    {openDetail === idx && (
                      <tr>
                        <td colSpan={8} className="bg-gray-50 px-3 py-2 border-b">
                          <div>
                            <strong>IPs Firewall :</strong>
                            <div className="mb-2 text-xs break-all">{Array.isArray(row.adresses_ip_firewall) ? row.adresses_ip_firewall.join(', ') : ''}</div>
                            <strong>IMSIs :</strong>
                            <div className="mb-2 text-xs break-all">{Array.isArray(row.imsis_mme) ? row.imsis_mme.join(', ') : ''}</div>
                            <strong>E212 IR21 :</strong>
                            <div className="mb-2 text-xs break-all">{Array.isArray(row.e212_ir21) ? row.e212_ir21.join(', ') : ''}</div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4 px-4">
              <span className="text-sm text-gray-700">Total: {filteredData.length} groupe(s) opérateur/pays</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataInboundResults;