import React, { useState, useEffect, useRef } from 'react';
import { BsSearch, BsUpload, BsTrash } from 'react-icons/bs';
import axios from 'axios';

const MmeImsi = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ message: '', type: '' });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const fileInputRef = useRef(null);

  // Format date comme dans FirewallIps.jsx
  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === 'N/A') return 'Non spécifiée';
    try {
      const date = new Date(dateStr);
      return date.toLocaleString();
    } catch (e) {
      return dateStr;
    }
  };

  // fetchData adapté à MmeImsi
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5178/mme-imsi?limit=0');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      setData(result.data || []);
      setError(null);
    } catch (err) {
      setError(`Erreur lors du chargement des IMSI: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.txt')) {
      setUploadStatus({ message: 'Veuillez sélectionner un fichier .txt', type: 'error' });
      fileInputRef.current.value = '';
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      setUploadStatus({ message: 'Importation en cours...', type: 'info' });
      const response = await axios.post('http://localhost:5178/api/upload-mme', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setUploadStatus({ message: `Importation réussie : ${response.data.details.successCount} entrées traitées`, type: 'success' });
        await fetchData();
      } else {
        throw new Error(response.data.error || 'Échec de l\'importation');
      }
    } catch (error) {
      setUploadStatus({
        message: error.response?.data?.error || error.message || 'Erreur lors de l\'importation',
        type: 'error'
      });
    } finally {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5178/api/mme-imsi/${id}`);
      if (response.data.success) {
        setUploadStatus({ message: 'Entrée supprimée', type: 'success' });
        await fetchData();
      }
    } catch (error) {
      setUploadStatus({
        message: error.response?.data?.error || 'Erreur lors de la suppression',
        type: 'error'
      });
    }
    setDeleteModalOpen(false);
    setEntryToDelete(null);
  };

  const openDeleteModal = (entry) => {
    setEntryToDelete(entry);
    setDeleteModalOpen(true);
  };

  // Pagination locale (client-side)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  
  // Filtrage côté client comme FirewallIps.jsx
  const filteredData = data.filter(entry =>
    (entry.imsi?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (entry.default_apn_operator_id?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );
  
  // Pagination calculée dynamiquement
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const pagedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Handlers pagination
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePageChange = (e) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val) || val < 1) val = 1;
    if (val > totalPages) val = totalPages;
    setCurrentPage(val);
  };
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Hooks déclarés plus haut dans le style FirewallIps.jsx

  // Anciennes définitions des fonctions supprimées (elles sont remplacées plus haut par la version style FirewallIps.jsx)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Analyse MME IMSI</h1>
        <p className="text-gray-600">Gestion des entrées IMSI et des détails des opérateurs</p>
      </div>

      {/* Zone de recherche et import, structure identique à FirewallIps.jsx */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Rechercher par IMSI ou Opérateur"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <BsSearch />
            </span>
          </div>
          <div>
            <label htmlFor="mme-upload" className="flex items-center cursor-pointer px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              <BsUpload className="mr-2" /> Importer
              <input
                id="mme-upload"
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
              />
            </label>
          </div>
        </div>
        {uploadStatus.message && (
          <div className={`mt-4 px-4 py-2 rounded text-sm font-medium ${uploadStatus.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' : uploadStatus.type === 'error' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' : 'bg-blue-100 text-blue-800 border-l-4 border-blue-500'}`}>
            {uploadStatus.message}
          </div>
        )}
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

      {!loading && !error && data.length === 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded">
          <p>Aucune entrée IMSI trouvée</p>
        </div>
      )}

      {!loading && filteredData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10 bg-gray-100">
                <tr>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">ID</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">IMSI</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">APN Opérateur</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Digits à ajouter</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Info suppl.</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">HSS Realm</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Créé le</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedData.map((item, idx) => (
                  <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-blue-50'}>
                    <td className="px-3 py-2 border-b text-center truncate max-w-[100px]" title={item.id}>{item.id}</td>
                    <td className="px-3 py-2 border-b text-center truncate max-w-[160px] font-medium" title={item.imsi}>{item.imsi}</td>
                    <td className="px-3 py-2 border-b text-center truncate max-w-[160px]" title={item.default_apn_operator_id || ''}>{item.default_apn_operator_id || 'N/A'}</td>
                    <td className="px-3 py-2 border-b text-center truncate max-w-[120px]" title={item.digits_to_add || ''}>{item.digits_to_add || 'N/A'}</td>
                    <td className="px-3 py-2 border-b text-center truncate max-w-[120px]" title={item.misc_info1 || ''}>{item.misc_info1 || 'N/A'}</td>
                    <td className="px-3 py-2 border-b text-center truncate max-w-[160px]" title={item.hss_realm_name || ''}>{item.hss_realm_name || 'N/A'}</td>
                    <td className="px-3 py-2 border-b text-center truncate max-w-[160px]">{formatDate(item.created_at)}</td>
                    <td className="px-3 py-2 border-b text-center">
                      <button
                        onClick={() => openDeleteModal(item)}
                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                        title="Supprimer"
                      >
                        <BsTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination moderne sous le tableau */}
            <div className="flex flex-col md:flex-row justify-between items-center mt-4 px-4 gap-2">
              <span className="text-sm text-gray-700">Page {currentPage} sur {totalPages} | Total: {filteredData.length} entrées</span>
              <div className="flex items-center space-x-2">
                <button onClick={handlePrevPage} disabled={currentPage === 1} className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Précédent</button>
                <input type="number" min={1} max={totalPages} value={currentPage} onChange={handlePageChange} className="w-12 text-center border rounded" />
                <button onClick={handleNextPage} disabled={currentPage === totalPages} className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Suivant</button>
                <select value={itemsPerPage} onChange={handleItemsPerPageChange} className="ml-2 border rounded px-1 py-1">
                  {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}/page</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de suppression identique FirewallIps.jsx */}
      {deleteModalOpen && entryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-4">
              Êtes-vous sûr de vouloir supprimer cette entrée ?
              <br />
              <span className="font-semibold">IMSI:</span> {entryToDelete.imsi}
              <br />
              <span className="font-semibold">APN Opérateur:</span> {entryToDelete.default_apn_operator_id}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(entryToDelete.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message si aucune donnée */}
      {!loading && !error && data.length === 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded">
          <p>Aucune entrée IMSI trouvée</p>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {deleteModalOpen && entryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-4">
              Êtes-vous sûr de vouloir supprimer cette entrée ?
              <br />
              <span className="font-semibold">IMSI:</span> {entryToDelete.imsi}
              <br />
              <span className="font-semibold">APN Opérateur:</span> {entryToDelete.default_apn_operator_id}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setEntryToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(entryToDelete.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MmeImsi;