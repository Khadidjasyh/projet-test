import React, { useState, useEffect, useRef } from 'react';
import { BsTable, BsSearch, BsFilter, BsUpload, BsTrash } from 'react-icons/bs';
import axios from 'axios';

const MssEricsson = () => {
  const [imsiData, setImsiData] = useState([]);
  const [bnumberData, setBnumberData] = useState([]);
  const [gtData, setGtData] = useState([]);
  const [activeTab, setActiveTab] = useState('imsi');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState('');
  const [uniqueNodes, setUniqueNodes] = useState([]);
  const [uploadStatus, setUploadStatus] = useState({ message: '', type: '' });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState('');
  const fileInputRef = useRef(null);

  // Fetch all unique nodes once when component mounts
  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const response = await fetch('http://localhost:5178/mss/nodes');
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Expected JSON, got: ${text}`);
        }
        const nodes = await response.json();
        setUniqueNodes(nodes);
      } catch (err) {
        console.error('Error fetching nodes:', err);
        setError(err.message || 'Failed to fetch nodes');
      }
    };

    fetchNodes();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        let endpoint = '';
        if (activeTab === 'gt') {
          endpoint = 'gt-series';
        } else {
          endpoint = `${activeTab}-analysis`;
        }

        const queryParams = new URLSearchParams({
          page: currentPage,
          limit: itemsPerPage,
          ...(selectedNode && { node: selectedNode })
        });

        const response = await fetch(`http://localhost:5178/mss/${endpoint}?${queryParams}`);
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

        // Process the data to remove the id field
        const processedData = result.data.map(item => {
          const { id, ...rest } = item;
          return rest;
        });

        switch (activeTab) {
          case 'imsi':
            setImsiData(processedData);
            break;
          case 'bnumber':
            setBnumberData(processedData);
            break;
          case 'gt':
            setGtData(processedData);
            break;
          default:
            break;
        }
      } catch (err) {
        console.error(`Error fetching ${activeTab} data:`, err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, currentPage, itemsPerPage, selectedNode]);

  const filterData = (data) => {
    let filteredData = [...data];

    // Filter by node name if selected
    if (selectedNode) {
      filteredData = filteredData.filter(item => item.node_name === selectedNode);
    }

    // Filter by search term if present
    if (searchTerm) {
      filteredData = filteredData.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        switch (activeTab) {
          case 'imsi':
            return item.imsi_series?.toLowerCase().includes(searchLower);
          case 'bnumber':
            return item.b_number?.toLowerCase().includes(searchLower);
          case 'gt':
            return item.tt?.toLowerCase().includes(searchLower);
          default:
            return true;
        }
      });
    }

    return filteredData;
  };

  const renderTable = (data, columns) => {
    if (loading) {
      return <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>;
    }

    if (error) {
      return <div className="text-red-500 text-center p-4">
        <p>Error: {error}</p>
        <p className="text-sm mt-2">Please make sure the backend server is running on port 5177 and returns valid JSON.</p>
      </div>;
    }

    if (!data || data.length === 0) {
      return <p className="text-gray-500 text-center p-4">No data available</p>;
    }

    const filteredData = filterData(data);

    return (
      <div>
        <div className="mb-4 flex items-center space-x-4">
          <div className="flex-1 flex items-center space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={`Search ${activeTab === 'imsi' ? 'IMSI Series' : activeTab === 'bnumber' ? 'B Number' : 'TT'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <BsSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <div className="relative">
              <select
                value={selectedNode}
                onChange={(e) => setSelectedNode(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white min-w-[200px]"
              >
                <option value="">All Nodes</option>
                {uniqueNodes.map(node => (
                  <option key={node} value={node}>{node}</option>
                ))}
              </select>
              <BsFilter className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col, index) => (
                  <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row[col.toLowerCase().replace(/ /g, '_')]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4 px-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-gray-600">Page {currentPage}</span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  const columns = {
    imsi: ['Node Name', 'IMSI Series', 'M Value', 'NA Value', 'ANRES Value', 'Created At'],
    bnumber: ['Node Name', 'B Number', 'MISCELL', 'F/N', 'ROUTE', 'CHARGE', 'L', 'A Value', 'Created At'],
    gt: ['Node Name', 'TT', 'NP', 'NA', 'NS', 'GTRC', 'Created At']
  };

  // Import MSS Ericsson
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const allowedExtensions = ['.xml', '.log', '.txt'];
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(ext)) {
      setUploadStatus({ message: 'Veuillez sélectionner un fichier XML, LOG ou TXT', type: 'error' });
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      setUploadStatus({ message: 'Import en cours...', type: 'info' });
      const response = await axios.post('http://localhost:5178/api/upload-mss-ericsson', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setUploadStatus({ message: response.data.message, type: 'success' });
        setTimeout(() => window.location.reload(), 2000);
      } else {
        throw new Error(response.data.error || 'Erreur lors de l\'import');
      }
    } catch (error) {
      setUploadStatus({ message: error.response?.data?.error || error.message || 'Erreur lors de l\'import du fichier', type: 'error' });
    }
  };

  // Suppression d'un node MSS
  const handleDeleteNode = async () => {
    if (!nodeToDelete) return;
    try {
      setUploadStatus({ message: 'Suppression en cours...', type: 'info' });
      const response = await axios.delete(`http://localhost:5178/api/mss/node/${encodeURIComponent(nodeToDelete)}`);
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
        <h1 className="text-2xl font-bold text-gray-800">MSS Ericsson Data Analysis</h1>
        <p className="text-gray-600">View and analyze MSS Ericsson log data</p>
      </div>

      {/* Boutons Importer & Supprimer un nœud */}
      <div className="mb-6 flex items-center space-x-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".xml,.log,.txt"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <BsUpload className="mr-2" />
          <span>Importer MSS Ericsson</span>
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
            <h2 className="text-xl font-bold mb-4">Supprimer un nœud MSS</h2>
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

      <div className="mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setActiveTab('imsi');
              setCurrentPage(1);
              setSearchTerm('');
            }}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'imsi' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            IMSI Analysis
          </button>
          <button
            onClick={() => {
              setActiveTab('bnumber');
              setCurrentPage(1);
              setSearchTerm('');
            }}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'bnumber' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            B-Number Analysis
          </button>
          <button
            onClick={() => {
              setActiveTab('gt');
              setCurrentPage(1);
              setSearchTerm('');
            }}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'gt' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            GT Series
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'imsi' && renderTable(imsiData, columns.imsi)}
        {activeTab === 'bnumber' && renderTable(bnumberData, columns.bnumber)}
        {activeTab === 'gt' && renderTable(gtData, columns.gt)}
      </div>
    </div>
  );
};

export default MssEricsson;
