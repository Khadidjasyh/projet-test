import React, { useState, useEffect } from 'react';
import { BsTable, BsSearch } from 'react-icons/bs';

const HssPage = () => {
  const [hssData, setHssData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5178/hss');
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Expected JSON, got: ${text}`);
        }
        const result = await response.json();
        setHssData(result.data || result);
      } catch (err) {
        setError(err.message || 'Failed to fetch HSS Somalia data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtrage par recherche
  const filteredData = hssData.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // No pagination - using filtered data directly
  const currentData = filteredData;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BsTable className="inline-block mr-2" /> HSS 
        </h1>
        <p className="text-gray-600">Affichage et recherche des données HSS extraites</p>
      </div>

      <div className="mb-4 flex items-center space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Recherche"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
          <BsSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">
          <p>Error: {error}</p>
          <p className="text-sm mt-2">Vérifie que le backend HSS Somalie fonctionne et retourne du JSON.</p>
        </div>
      ) : currentData.length === 0 ? (
        <p className="text-gray-500 text-center p-4">Aucune donnée trouvée</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 border-b">EPC</th>
                <th className="px-6 py-3 border-b">3G</th>
                <th className="px-6 py-3 border-b">HSS_ESM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{row.epc}</td>
                  <td className="px-6 py-4 border-b">{row['3g']}</td>
                  <td className="px-6 py-4 border-b">{row.hss_esm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HssPage;
