import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RoamingPartners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [partnersPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5177/roaming-partners');
      console.log('Données reçues:', response.data);
      setPartners(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      setError('Erreur lors du chargement des données');
      setLoading(false);
    }
  };

  // Fonction de tri
  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Fonction de filtrage
  const filteredPartners = partners.filter((partner) => {
    return (
      partner.id.toString().includes(searchTerm.toLowerCase()) ||
      partner.imsi_prefix.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Appliquer le tri
  const sortedPartners = [...filteredPartners].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  // Get current partners
  const indexOfLastPartner = currentPage * partnersPerPage;
  const indexOfFirstPartner = indexOfLastPartner - partnersPerPage;
  const currentPartners = sortedPartners.slice(indexOfFirstPartner, indexOfLastPartner);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Réinitialiser la page lors de la recherche
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchPartners}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (partners.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Aucun partenaire trouvé</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Partenaires de Roaming</h1>
      
      {/* Barre de recherche */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th 
                className="px-6 py-3 border-b text-left cursor-pointer hover:bg-gray-200"
                onClick={() => sortData('id')}
              >
                ID {sortConfig.key === 'id' && (
                  <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 border-b text-left cursor-pointer hover:bg-gray-200"
                onClick={() => sortData('imsi_prefix')}
              >
                IMSI Prefix {sortConfig.key === 'imsi_prefix' && (
                  <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 border-b text-left cursor-pointer hover:bg-gray-200"
                onClick={() => sortData('gt')}
              >
                GT {sortConfig.key === 'gt' && (
                  <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 border-b text-left cursor-pointer hover:bg-gray-200"
                onClick={() => sortData('operateur')}
              >
                Opérateur {sortConfig.key === 'operateur' && (
                  <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentPartners.map((partner) => (
              <tr key={partner.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b">{partner.id}</td>
                <td className="px-6 py-4 border-b">{partner.imsi_prefix}</td>
                <td className="px-6 py-4 border-b">{partner.gt}</td>
                <td className="px-6 py-4 border-b">{partner.operateur}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-gray-600">
          Affichage de {indexOfFirstPartner + 1} à {Math.min(indexOfLastPartner, sortedPartners.length)} sur {sortedPartners.length} entrées
        </div>
        <div className="flex">
          {Array.from({ length: Math.ceil(sortedPartners.length / partnersPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoamingPartners; 