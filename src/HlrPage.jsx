import React, { useState, useEffect, useRef } from 'react';
import { BsTable, BsSearch, BsFilter, BsUpload, BsTrash } from 'react-icons/bs';
import axios from 'axios';

const HlrPage = () => {
  const [hlrData, setHlrData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState('');
  const [uploadStatus, setUploadStatus] = useState({ message: '', type: '' });
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState('');
  const [deleteNodeModalOpen, setDeleteNodeModalOpen] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [nodeToDelete, setNodeToDelete] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5178/api/hlr');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHlrData(Array.isArray(data) ? data : []);
    
    } catch (err) {
      setError(err.message || 'Failed to fetch HLR data');
    } finally {
      setLoading(false);
    }
  };

  const fetchNodes = async () => {
    try {
      const response = await axios.get('http://localhost:5178/api/hlr/nodes');
      if (response.data.success) {
        setNodes(response.data.nodes.sort());
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des nœuds:', err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchNodes();
  }, []);

  // Filtrage des données
  const filteredData = hlrData.filter(item => {
    if (selectedNode && item.node_name !== selectedNode) {
      return false;
    }
    return Object.values(item).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Import HLR
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedExtensions = ['.log'];
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(ext)) {
      setUploadStatus({ message: 'Veuillez sélectionner un fichier LOG', type: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadStatus({ message: 'Import en cours...', type: 'info' });
      const response = await axios.post('http://localhost:5178/api/upload-hlr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setUploadStatus({ message: 'Fichier ajouté avec succès', type: 'success' });
        // Rafraîchir les données et la liste des nœuds après un délai
        setTimeout(() => {
          fetchData();
          fetchNodes();
        }, 2000);
      } else {
        throw new Error(response.data.error || 'Erreur lors de l\'import');
      }
    } catch (error) {
      setUploadStatus({ 
        message: error.response?.data?.error || error.message || 'Erreur lors de l\'import du fichier', 
        type: 'error' 
      });
    }
  };

  const handleDeleteNode = async () => {
    if (!nodeToDelete) return;

    try {
      setStatus('Suppression en cours...');
      const response = await axios.delete(`http://localhost:5178/api/hlr/node/${encodeURIComponent(nodeToDelete)}`);

      if (response.data.success) {
        setStatus('Nœud supprimé avec succès !');
        setDeleteNodeModalOpen(false);
        setNodeToDelete('');
        setTimeout(() => {
          fetchData();
          fetchNodes();
          setStatus('');
        }, 2000);
      } else {
        setStatus(response.data.message || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setStatus('Erreur lors de la suppression: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BsTable className="inline-block mr-2" /> HLR 
        </h1>
        <p className="text-gray-600">Affichage et recherche des données HLR</p>
      </div>

      {/* Boutons Importer et Supprimer */}
      <div className="mb-6 flex space-x-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".log"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <BsUpload className="mr-2" />
          <span>Importer HLR</span>
        </button>
        <button
          onClick={() => setDeleteNodeModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <BsTrash className="mr-2" />
          <span>Supprimer un nœud</span>
        </button>
      </div>

      {/* Feedback utilisateur */}
      {(uploadStatus.message || status) && (
        <div className={`mb-4 p-3 rounded ${
          (uploadStatus.type === 'error' || status.includes('Erreur')) ? 'bg-red-100 text-red-700' :
          (uploadStatus.type === 'success' || status.includes('succès')) ? 'bg-green-100 text-green-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {uploadStatus.message || status}
        </div>
      )}

      {/* Barre de recherche et filtre par nœud */}
      <div className="mb-4 flex items-center space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Recherche"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
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
            {nodes.map(node => (
              <option key={node} value={node}>{node}</option>
            ))}
          </select>
          <BsFilter className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Tableau des données */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">
          <p>Error: {error}</p>
        </div>
      ) : filteredData.length === 0 ? (
        <p className="text-gray-500 text-center p-4">Aucune donnée trouvée</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 border-b">Node Name</th>
                <th className="px-6 py-3 border-b">TT</th>
                <th className="px-6 py-3 border-b">NP</th>
                <th className="px-6 py-3 border-b">NA</th>
                <th className="px-6 py-3 border-b">NS</th>
                <th className="px-6 py-3 border-b">GTRC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{row.node_name || '-'}</td>
                  <td className="px-6 py-4 border-b">{row.tt || '-'}</td>
                  <td className="px-6 py-4 border-b">{row.np || '-'}</td>
                  <td className="px-6 py-4 border-b">{row.na || '-'}</td>
                  <td className="px-6 py-4 border-b">{row.ns || '-'}</td>
                  <td className="px-6 py-4 border-b">{row.gtrc || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de suppression */}
      {deleteNodeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Supprimer un nœud HLR</h2>
            <select
              value={nodeToDelete}
              onChange={(e) => setNodeToDelete(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="">Sélectionner un nœud</option>
              {nodes.map((node) => (
                <option key={node} value={node}>
                  {node}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setDeleteNodeModalOpen(false);
                  setNodeToDelete('');
                  setStatus('');
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteNode}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                disabled={!nodeToDelete}
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

export default HlrPage; 