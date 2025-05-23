import React, { useState, useEffect, useRef } from 'react';
import { BsSearch, BsUpload, BsTrash } from 'react-icons/bs';
import axios from 'axios';

const MssHuawei = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ message: '', type: '' });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const fileInputRef = useRef(null);

  // Récupération des données MSS Huawei
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5178/api/huawei-networks');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(`Erreur lors du chargement des données : ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetching on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Import MSS Huawei
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
      setUploadStatus({ message: 'Envoi en cours...', type: 'info' });
      const response = await axios.post('http://localhost:5178/api/upload-huawei-networks', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setUploadStatus({ message: 'Fichier traité avec succès', type: 'success' });
        await fetchData();
      } else {
        throw new Error(response.data.error || 'Échec de l\'envoi');
      }
    } catch (error) {
      setUploadStatus({
        message: error.response?.data?.error || error.message || 'Erreur lors de l\'envoi',
        type: 'error'
      });
    } finally {
      fileInputRef.current.value = '';
    }
  };

  // Filtrage simple sur tous les champs principaux
  const filteredData = data.filter(row => {
    const search = searchTerm.toLowerCase();
    return (
      (row.imsi_prefix && row.imsi_prefix.toLowerCase().includes(search)) ||
      (row.msisdn_prefix && row.msisdn_prefix.toLowerCase().includes(search)) ||
      (row.network_name && row.network_name.toLowerCase().includes(search)) ||
      (row.managed_object_group && row.managed_object_group.toLowerCase().includes(search))
    );
  });

  // Suppression MSS Huawei
  const handleDelete = async (id) => {
    let isMounted = true;
    try {
      const response = await axios.delete(`http://localhost:5178/api/huawei-networks/${id}`);
      if (isMounted && response.data.success) {
        setUploadStatus({ message: 'Entrée supprimée', type: 'success' });
        await fetchData();
      }
    } catch (error) {
      if (isMounted) {
        setUploadStatus({
          message: error.response?.data?.error || 'Erreur lors de la suppression',
          type: 'error'
        });
      }
    }
    if (isMounted) {
      setDeleteModalOpen(false);
      setEntryToDelete(null);
    }
    return () => { isMounted = false; };
  };


  const openDeleteModal = (entry) => {
    setEntryToDelete(entry);
    setDeleteModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Analyse des données MSS Huawei</h1>
        <p className="text-gray-600">Visualisez et analysez les informations MSS Huawei</p>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Rechercher par groupe, IMSI, MSISDN, réseau..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              <BsSearch />
            </span>
          </div>
          <input
            type="file"
            accept=".txt"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <BsUpload className="mr-2" />
            <span>Importer MSS Huawei</span>
          </button>
        </div>
        {uploadStatus.message && (
          <div className={`mt-2 text-sm rounded px-3 py-2 ${uploadStatus.type === 'success' ? 'bg-green-100 text-green-800' : uploadStatus.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
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
          <p>Aucune entrée MSS Huawei trouvée</p>
        </div>
      )}

      {!loading && filteredData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10 bg-gray-100">
                <tr>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">IMSI Prefix</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">MSISDN Prefix</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Network Name</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Managed Object Group</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, idx) => (
                  <tr key={row.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-blue-50'}>
                    <td className="px-3 py-2 border-b text-center truncate max-w-[120px]" title={row.imsi_prefix || ''}>{row.imsi_prefix || '-'}</td>
                    <td className="px-3 py-2 border-b text-center truncate max-w-[120px]" title={row.msisdn_prefix || ''}>{row.msisdn_prefix || '-'}</td>
                    <td className="px-3 py-2 border-b text-center truncate max-w-[120px]" title={row.network_name || ''}>{row.network_name || '-'}</td>
                    <td className="px-3 py-2 border-b text-center truncate max-w-[120px]" title={row.managed_object_group || ''}>{row.managed_object_group || '-'}</td>
                    <td className="px-3 py-2 border-b text-center">
                      <button
                        onClick={() => openDeleteModal(row)}
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
            <div className="flex justify-between items-center mt-4 px-4">
              <span className="text-sm text-gray-700">Total: {filteredData.length} entrée(s)</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal de suppression */}
      {deleteModalOpen && entryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-4">
              Êtes-vous sûr de vouloir supprimer cette entrée ?
              <br />
              <span className="font-semibold">IMSI Prefix:</span> {entryToDelete.imsi_prefix || '-'}
              <br />
              <span className="font-semibold">MSISDN Prefix:</span> {entryToDelete.msisdn_prefix || '-'}
              <br />
              <span className="font-semibold">Network Name:</span> {entryToDelete.network_name || '-'}
              <br />
              <span className="font-semibold">Managed Object Group:</span> {entryToDelete.managed_object_group || '-'}
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
    </div>
  );
};

export default MssHuawei;