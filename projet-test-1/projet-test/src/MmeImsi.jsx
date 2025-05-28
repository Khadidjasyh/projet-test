import React, { useState, useEffect } from 'react';
import { BsSearch } from 'react-icons/bs';

const MmeImsi = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:5178/mme-imsi?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(searchTerm)}`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result.data || []);
        setTotalPages(Math.ceil((result.total || 0) / itemsPerPage) || 1);
      } catch (err) {
        setError('Erreur lors de la récupération des données MME IMSI');
        console.error('Erreur MME IMSI:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, searchTerm, itemsPerPage]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Analyse MME IMSI</h1>
        <p className="text-gray-600">Gestion des entrées IMSI et des détails des opérateurs</p>
      </div>

      {/* Barre de recherche */}
      <div className="mb-4 flex items-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Rechercher par IMSI ou Opérateur"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Rechercher MME IMSI"
          />
          <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IMSI</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APN Opérateur</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chiffres à ajouter</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Info supplémentaire</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domaine HSS</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de création</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data && data.length > 0 ? (
                  data.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.id || 'N/A'}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.imsi || 'N/A'}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.default_apn_operator_id || 'N/A'}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.digits_to_add || 'N/A'}</td>
                      <td className="px-4 py-4 text-sm text-gray-500">{item.misc_info1 || 'N/A'}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.hss_realm_name || 'N/A'}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(item.created_at)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      Aucune donnée disponible
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 border rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Précédent
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} sur {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 border rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MmeImsi;
