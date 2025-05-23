import React, { useState, useEffect, useRef } from 'react';
import { BsTable, BsSearch, BsFilter, BsUpload, BsTrash } from 'react-icons/bs';

const MssEricsson = () => {
  const fileInputRef = useRef(null);
  const [uploadStatus, setUploadStatus] = useState({ message: '', type: '' });
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
            // Recherche sur GTRC, insensible à la casse et aux espaces
            return (
              item.gtrc &&
              item.gtrc.toString().replace(/\s+/g, '').toLowerCase().includes(searchLower.replace(/\s+/g, ''))
            );
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


        <>
          <div className="mb-4 flex items-center space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={
                  activeTab === 'gt'
                    ? 'Rechercher GTRC'
                    : activeTab === 'imsi'
                    ? 'Rechercher IMSI Series'
                    : activeTab === 'bnumber'
                    ? 'Rechercher B Number'
                    : ''
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <BsSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">
              {filteredData.length} entr{filteredData.length > 1 ? 'ées' : 'ée'} affich{filteredData.length > 1 ? 'ées' : 'ée'}
            </span>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10 bg-gray-100">
                <tr>
                  {columns.map((col, index) => (
                    <th key={index} className="px-3 py-2 border-b font-semibold text-gray-700 text-center">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-blue-50'}>
                    {columns.map((col, colIndex) => (
                      col === 'Actions' ? (
                        <td key={colIndex} className="px-3 py-2 border-b text-center">
                          <button
                            className="text-red-600 hover:text-red-800 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                            title="Supprimer"
                            onClick={() => handleDelete(row, activeTab)}
                          >
                            <BsTrash />
                          </button>
                        </td>
                      ) : (
                        <td key={colIndex} className="px-3 py-2 border-b text-center truncate max-w-[160px]" title={row[col.toLowerCase().replace(/ /g, '_')] || ''}>
                          {row[col.toLowerCase().replace(/ /g, '_')]}
                        </td>
                      )
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4 px-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 border rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                Précédent
              </button>
              <span className="text-sm text-gray-700">Page {currentPage}</span>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-4 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-50"
              >
                Suivant
              </button>
            </div>
          </div>
        </>
      </div>
    );
  };

  const columns = {
    imsi: ['Node Name', 'IMSI Series', 'M Value', 'NA Value', 'ANRES Value', 'Created At', 'Actions'],
    bnumber: ['Node Name', 'B Number', 'MISCELL', 'F/N', 'ROUTE', 'CHARGE', 'L', 'A Value', 'Created At', 'Actions'],
    gt: ['Node Name', 'TT', 'NP', 'NA', 'NS', 'GTRC', 'Created At', 'Actions']
  };

  // Suppression MSS Ericsson
  const handleDelete = async (row, tab) => {
    if (!window.confirm('Confirmer la suppression de cette ligne ?')) return;
    let endpoint = '';
    let key = '';
    switch (tab) {
      case 'imsi':
        endpoint = 'mss/imsi-analysis';
        key = 'imsi_series';
        break;
      case 'bnumber':
        endpoint = 'mss/bnumber-analysis';
        key = 'b_number';
        break;
      case 'gt':
        endpoint = 'mss/gt-series';
        key = 'tt';
        break;
      default:
        return;
    }
    try {
      const url = `http://localhost:5178/${endpoint}`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ node_name: row.node_name, [key]: row[key] })
      });
      const data = await res.json();
      if (data.success) {
        setUploadStatus({ message: 'Suppression réussie', type: 'success' });
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setUploadStatus({ message: data.error || 'Erreur lors de la suppression', type: 'error' });
      }
    } catch (err) {
      setUploadStatus({ message: err.message || 'Erreur lors de la suppression', type: 'error' });
    }
  };


  // Upload MSS Ericsson
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const allowedExtensions = ['.xml', '.log', '.txt'];
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(ext)) {
      setUploadStatus({ message: 'Veuillez sélectionner un fichier XML, LOG ou TXT', type: 'error' });
      fileInputRef.current.value = '';
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      setUploadStatus({ message: 'Import en cours...', type: 'info' });
      const response = await fetch('http://localhost:5178/api/upload-mss-ericsson', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setUploadStatus({ message: data.message || 'Fichier importé avec succès', type: 'success' });
        setTimeout(() => window.location.reload(), 2000);
      } else {
        throw new Error(data.error || 'Erreur lors de l\'import');
      }
    } catch (error) {
      setUploadStatus({ message: error.message || 'Erreur lors de l\'import du fichier', type: 'error' });
    } finally {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">MSS Ericsson Data Analysis</h1>
        <p className="text-gray-600">View and analyze MSS Ericsson log data</p>
      </div>

      {/* BARRE DE RECHERCHE, FILTRE NODE ET BOUTON IMPORT */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1 flex items-center gap-4">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder={
                activeTab === 'gt'
                  ? 'Rechercher GTRC'
                  : activeTab === 'imsi'
                  ? 'Rechercher IMSI Series'
                  : activeTab === 'bnumber'
                  ? 'Rechercher B Number'
                  : ''
              }
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <BsSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
          <div className="relative w-full max-w-xs">
            <select
              value={selectedNode}
              onChange={e => setSelectedNode(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white"
            >
              <option value="">Tous les nodes</option>
              {uniqueNodes.map(node => (
                <option key={node} value={node}>{node}</option>
              ))}
            </select>
            <BsFilter className="absolute left-3 top-3 text-gray-400" />
          </div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="file"
              accept=".xml,.log,.txt"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <span className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 flex items-center space-x-2">
              <BsUpload />
              <span>Importer</span>
            </span>
          </label>
        </div>
        {uploadStatus.message && (
          <div className={`text-sm rounded px-3 py-2 ${
            uploadStatus.type === 'success' ? 'bg-green-100 text-green-800' :
            uploadStatus.type === 'error' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {uploadStatus.message}
          </div>
        )}
      </div>


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