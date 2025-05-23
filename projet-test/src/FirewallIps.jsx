import React, { useState, useEffect, useRef } from 'react';
import { BsSearch, BsUpload, BsTrash } from 'react-icons/bs';
import axios from 'axios';

const FirewallIPs = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ message: '', type: '' });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const fileInputRef = useRef(null);

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === 'N/A') return 'Non spécifiée';
    
    try {
      const [date, time] = dateStr.split(' ');
      const [year, month, day] = date.split('-');
      return `${day}/${month}/${year} ${time}`;
    } catch (e) {
      console.error('Error formatting date:', e);
      return dateStr;
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5178/firewall-ips');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(`Erreur lors du chargement des IPs: ${err.message}`);
      console.error('Fetch error:', err);
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
      setUploadStatus({ message: 'Envoi en cours...', type: 'info' });
      const response = await axios.post('http://localhost:5178/api/upload-firewall', formData, {
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

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5178/api/firewall-ips/${id}`);
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

  const filteredData = data.filter(entry =>
    (entry.nom?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (entry.cidr_complet?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des IPs Firewall</h1>
        <p className="text-gray-600">Visualisation et gestion des plages d'IP</p>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Rechercher par nom ou plage IP"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 pr-10 text-gray-700 bg-white"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">
              <BsSearch />
            </span>
          </div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="file"
              accept=".txt"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <span className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 flex items-center space-x-2">
              <BsUpload />
              <span>Importer .txt</span>
            </span>
          </label>
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
          <p>Aucune entrée IP firewall trouvée</p>
        </div>
      )}

      {!loading && filteredData.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10 bg-gray-100">
                <tr>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Nom</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Plage CIDR</th>
                  
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, idx) => (
                  <tr key={item.identifiant} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-blue-50'}>
                    <td className="px-3 py-2 border-b text-center truncate max-w-[160px]" title={item.nom || ''}>
                      {item.nom || 'N/A'}
                    </td>
                    <td className="px-3 py-2 border-b text-center truncate max-w-[160px]" title={item.cidr_complet || ''}>
                      {item.cidr_complet || 'N/A'}
                    </td>
                    
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
            <div className="flex justify-between items-center mt-4 px-4">
              <span className="text-sm text-gray-700">Total: {filteredData.length} entrée(s)</span>
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && entryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-4">
              Êtes-vous sûr de vouloir supprimer cette entrée ?
              <br />
              <span className="font-semibold">Nom:</span> {entryToDelete.nom || 'N/A'}
              <br />
              <span className="font-semibold">CIDR:</span> {entryToDelete.cidr_complet || 'N/A'}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(entryToDelete.identifiant)}
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

export default FirewallIPs;