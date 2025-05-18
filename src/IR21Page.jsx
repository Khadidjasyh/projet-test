import React, { useState, useEffect } from 'react';
import { BsTable, BsSearch } from 'react-icons/bs';

const IR21Page = () => {
  const [ir21Data, setIr21Data] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5178/ir21');  // Changez l'URL selon votre API
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
        setIr21Data(result.data || result);
      } catch (err) {
        setError(err.message || 'Failed to fetch IR21 data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtrage par recherche
  const filteredData = ir21Data.filter(item =>
    (item.tadig && item.tadig.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.pays && item.pays.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.ipaddress && item.ipaddress.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // No pagination - using filtered data directly
  const currentData = filteredData;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BsTable className="inline-block mr-2" /> IR21
        </h1>
        <p className="text-gray-600">Affichage et recherche des données IR21 extraites</p>
      </div>

      <div className="mb-4 flex items-center space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher par TADIG, pays ou IP..."
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
          <BsSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <button
          onClick={() => {
            // Cette fonction pourrait être implémentée plus tard pour l'import des fichiers IR21
            alert('Fonctionnalité d\'import IR21 à implémenter');
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <span className="mr-2">Importer IR21</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">
          <p>Error: {error}</p>
          <p className="text-sm mt-2">Vérifie que le backend IR21 fonctionne et retourne du JSON.</p>
        </div>
      ) : currentData.length === 0 ? (
        <p className="text-gray-500 text-center p-4">Aucune donnée trouvée</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 border-b">ID</th>
                <th className="px-6 py-3 border-b">TADIG</th>
                <th className="px-6 py-3 border-b">Pays</th>
                <th className="px-6 py-3 border-b">E212</th>
                <th className="px-6 py-3 border-b">E214</th>
                <th className="px-6 py-3 border-b">APN</th>
                <th className="px-6 py-3 border-b">IP Address</th>
                <th className="px-6 py-3 border-b">Date d'ajout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{row.id}</td>
                  <td className="px-6 py-4 border-b">{row.tadig}</td>
                  <td className="px-6 py-4 border-b">{row.pays}</td>
                  <td className="px-6 py-4 border-b">{row.e212 || '-'}</td>
                  <td className="px-6 py-4 border-b">{row.e214 || '-'}</td>
                  <td className="px-6 py-4 border-b">{row.apn || '-'}</td>
                  <td className="px-6 py-4 border-b">
                    <div className="max-w-xs overflow-auto whitespace-normal">
                      {row.ipaddress}
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b">{new Date(row.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IR21Page;
