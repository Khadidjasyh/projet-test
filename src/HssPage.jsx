import React, { useState, useEffect, useRef } from 'react';
import { BsTable, BsSearch, BsFilter, BsUpload, BsTrash } from 'react-icons/bs';
import axios from 'axios';

const HssPage = () => {
  const [hssData, setHssData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uniqueNodes, setUniqueNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState('');
  const [uploadStatus, setUploadStatus] = useState({ message: '', type: '' });
  const fileInputRef = useRef(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState('');
  const [nodes, setNodes] = useState([]);

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
      // Extraire les node_name uniques
      const nodes = Array.from(new Set((result.data || result).map(row => row.node_name).filter(Boolean)));
      setUniqueNodes(nodes);
    } catch (err) {
      setError(err.message || 'Failed to fetch HSS Somalia data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrage par node_name et recherche
  const filteredData = hssData.filter(item =>
    (!selectedNode || item.node_name === selectedNode) &&
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const currentData = filteredData;

  // Import HSS
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const allowedExtensions = ['.log', '.txt'];
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(ext)) {
      setUploadStatus({ message: 'Veuillez sélectionner un fichier LOG ou TXT', type: 'error' });
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      setUploadStatus({ message: 'Import en cours...', type: 'info' });
      const response = await axios.post('http://localhost:5178/api/upload-hss', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setUploadStatus({ message: response.data.message, type: 'success' });
        // Rafraîchir les données après un délai
        setTimeout(fetchData, 2000);
      } else {
        throw new Error(response.data.error || 'Erreur lors de l\'import');
      }
    } catch (error) {
      setUploadStatus({ message: error.response?.data?.error || error.message || 'Erreur lors de l\'import du fichier', type: 'error' });
    }
  };

  const fetchNodes = async () => {
    try {
      const response = await axios.get('/api/hss/nodes');
      setNodes(response.data);
    } catch (error) {
      console.error('Error fetching nodes:', error);
    }
  };

  const handleDeleteNode = async () => {
    if (!nodeToDelete) return;
    try {
      setUploadStatus({ message: 'Suppression en cours...', type: 'info' });
      const response = await axios.delete(`http://localhost:5178/api/hss/node/${encodeURIComponent(nodeToDelete)}`);
      if (response.data.success) {
        setUploadStatus({ message: 'Suppression réussie', type: 'success' });
        setDeleteModalOpen(false);
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setUploadStatus({ message: response.data.error || 'Erreur lors de la suppression', type: 'error' });
      }
    } catch (error) {
      setUploadStatus({ message: error.response?.data?.error || error.message || 'Erreur lors de la suppression', type: 'error' });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BsTable className="inline-block mr-2" /> HSS 
        </h1>
        <p className="text-gray-600">Affichage et recherche des données HSS extraites</p>
      </div>

      {/* Boutons Importer & Supprimer un nœud */}
      <div className="mb-6 flex items-center space-x-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".log,.txt"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <BsUpload className="mr-2" />
          <span>Importer HSS</span>
        </button>
        <button
          onClick={() => setDeleteModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <BsTrash className="mr-2" />
          <span>Supprimer un nœud</span>
        </button>
      </div>

      {/* Feedback utilisateur */}
      {uploadStatus.message && (
        <div className={`mb-4 p-3 rounded ${
          uploadStatus.type === 'error' ? 'bg-red-100 text-red-700' :
          uploadStatus.type === 'success' ? 'bg-green-100 text-green-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {uploadStatus.message}
        </div>
      )}

      {/* Modale de suppression de nœud */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Supprimer un nœud HSS</h2>
            <select
              value={nodeToDelete}
              onChange={e => setNodeToDelete(e.target.value)}
              className="w-full mb-4 p-2 border rounded"
            >
              <option value="">Sélectionner un nœud...</option>
              {uniqueNodes.map(node => (
                <option key={node} value={node}>{node}</option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >Annuler</button>
              <button
                onClick={handleDeleteNode}
                disabled={!nodeToDelete}
                className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
              >Supprimer</button>
            </div>
          </div>
        </div>
      )}

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
        <div className="relative">
          <select
            value={selectedNode}
            onChange={e => setSelectedNode(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white min-w-[200px]"
          >
            <option value="">Tous les nœuds</option>
            {uniqueNodes.map(node => (
              <option key={node} value={node}>{node}</option>
            ))}
          </select>
          <BsFilter className="absolute left-3 top-3 text-gray-400" />
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
                <th className="px-6 py-3 border-b">Node Name</th>
                <th className="px-6 py-3 border-b">EPC</th>
                <th className="px-6 py-3 border-b">3G</th>
                <th className="px-6 py-3 border-b">HSS_ESM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{row.node_name || '-'}</td>
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
