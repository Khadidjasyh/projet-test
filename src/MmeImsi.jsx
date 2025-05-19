import React, { useState, useEffect, useRef } from 'react';
import { BsSearch, BsUpload, BsTrash } from 'react-icons/bs';
import axios from 'axios';

const MmeImsi = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(10);
  const [uploadStatus, setUploadStatus] = useState({ message: '', type: '' });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const fileInputRef = useRef(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5178/mme-imsi?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(searchTerm)}`
      );
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      const result = await response.json();
      setData(result.data || []);
      setTotalPages(Math.ceil((result.total || 0) / itemsPerPage) || 1);
    } catch (err) {
      setError(`Error fetching MME IMSI data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, itemsPerPage]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.txt')) {
      setUploadStatus({ message: 'Veuillez sélectionner un fichier .txt', type: 'error' });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
        setUploadStatus({ 
          message: `Importation réussie : ${response.data.details.successCount} entrées traitées`, 
          type: 'success' 
        });
        fetchData(); // Rafraîchir les données après l'import
      } else {
        throw new Error(response.data.error || 'Échec de l\'importation');
      }
    } catch (error) {
      setUploadStatus({ 
        message: error.response?.data?.error || error.message || 'Erreur lors de l\'importation', 
        type: 'error' 
      });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5178/api/mme-imsi/${id}`);
      if (response.data.success) {
        setUploadStatus({ message: 'Entrée supprimée avec succès', type: 'success' });
        fetchData(); // Rafraîchir les données
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

      <div className="mb-4 flex items-center space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Rechercher par IMSI ou Opérateur"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
          <BsSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".txt"
          className="hidden"
          id="mme-file-upload"
        />
        <label
          htmlFor="mme-file-upload"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center"
        >
          <BsUpload className="mr-2" />
          <span>Import MME</span>
        </label>
      </div>

      {uploadStatus.message && (
        <div className={`mb-4 p-3 rounded ${
          uploadStatus.type === 'error' ? 'bg-red-100 text-red-700' :
          uploadStatus.type === 'success' ? 'bg-green-100 text-green-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {uploadStatus.message}
        </div>
      )}

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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.id}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.imsi}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.default_apn_operator_id || 'N/A'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.digits_to_add || 'N/A'}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">{item.misc_info1 || 'N/A'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.hss_realm_name || 'N/A'}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      <button
                        onClick={() => openDeleteModal(item)}
                        className="text-red-600 hover:text-red-800"
                        title="Supprimer l'entrée"
                      >
                        <BsTrash />
                      </button>
                    </td>
                  </tr>
                ))}
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

      {/* Modal de confirmation de suppression */}
      {deleteModalOpen && entryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirmer la suppression</h3>
            <p className="mb-4">
              Êtes-vous sûr de vouloir supprimer l'entrée :
              <br />
              <strong>IMSI:</strong> {entryToDelete.imsi}
              <br />
              <strong>APN Opérateur:</strong> {entryToDelete.default_apn_operator_id}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setEntryToDelete(null);
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(entryToDelete.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
