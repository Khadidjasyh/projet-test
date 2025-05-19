import React, { useState, useEffect } from 'react';
import { BsUpload, BsTrash } from 'react-icons/bs';
import axios from 'axios';

const HlrPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const [deleteNodeModalOpen, setDeleteNodeModalOpen] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [nodeToDelete, setNodeToDelete] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/hlrr');
      setData(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des données HLR');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchNodes = async () => {
    try {
      const response = await axios.get('/api/hlr/nodes');
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

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setStatus('Import HLR en cours...');
      const response = await axios.post('/api/upload-hlr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setStatus(`Import réussi ! ${response.data.message || 'HLR data added'}`);
        setTimeout(() => {
          fetchData();
          fetchNodes();
          setStatus('');
        }, 2000);
      } else {
        setStatus(response.data.message || response.data.error || 'Erreur lors de l\'import HLR');
      }
    } catch (err) {
      console.error('Erreur lors de l\'upload HLR:', err);
      setStatus('Erreur lors de l\'import HLR: ' + (err.response?.data?.error || err.message || 'Une erreur inconnue est survenue'));
    }
  };

  const handleDeleteNode = async () => {
    if (!nodeToDelete) return;

    try {
      setStatus('Suppression en cours...');
      const response = await axios.delete(`/api/hlr/node/${encodeURIComponent(nodeToDelete)}`);

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

  const sortedData = [...data].sort((a, b) => {
    const nameA = a.node_name || '';
    const nameB = b.node_name || '';
    return nameA.localeCompare(nameB);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Données HLR</h1>

      {/* Boutons d'action */}
      <div className="flex gap-4 mb-6">
        <label className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
          <BsUpload />
          <span>Importer HLR</span>
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".txt,.log,.xml"
          />
        </label>

        <button
          onClick={() => {
            fetchNodes();
            setDeleteNodeModalOpen(true);
          }}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          <BsTrash />
          <span>Supprimer un nœud</span>
        </button>
      </div>

      {/* Message de statut */}
      {status && (
        <div className={`p-4 mb-4 rounded ${
          status.includes('Erreur') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {status}
        </div>
      )}

      {/* Tableau des données */}
      {loading ? (
        <div>Chargement...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">N°</th>
                <th className="px-4 py-2 border">Nœud</th>
                <th className="px-4 py-2 border">TT</th>
                <th className="px-4 py-2 border">NP</th>
                <th className="px-4 py-2 border">NA</th>
                <th className="px-4 py-2 border">NS</th>
                <th className="px-4 py-2 border">GTRC</th>
                <th className="px-4 py-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, index) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{index + 1}</td>
                  <td className="px-4 py-2 border">{row.node_name}</td>
                  <td className="px-4 py-2 border">{row.tt}</td>
                  <td className="px-4 py-2 border">{row.np}</td>
                  <td className="px-4 py-2 border">{row.na}</td>
                  <td className="px-4 py-2 border">{row.ns}</td>
                  <td className="px-4 py-2 border">{row.gtrc}</td>
                  <td className="px-4 py-2 border">{row.created_at ? new Date(row.created_at).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de suppression */}
      {deleteNodeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
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
                onClick={() => setDeleteNodeModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteNode}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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