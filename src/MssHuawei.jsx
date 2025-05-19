import React, { useState, useEffect, useRef } from 'react';
import { BsTable, BsSearch, BsFilter, BsUpload, BsTrash } from 'react-icons/bs';
import axios from 'axios';

const MssHuawei = () => {
  const [networkData, setNetworkData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [uniqueGroups, setUniqueGroups] = useState([]);
  const [uploadStatus, setUploadStatus] = useState({ message: '', type: '' });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState('');
  const [availableNodes, setAvailableNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState('all');
  const fileInputRef = useRef(null);

  // Fetch all mobile networks data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5178/api/huawei-networks');
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      
      const result = await response.json();
      
      if (!Array.isArray(result)) {
        throw new Error('La réponse du serveur n\'est pas un tableau valide');
      }
      
      console.log('Données reçues du serveur:', result);
      
      const validatedData = result.map(item => ({
        id: item.id || '',
        imsi_prefix: item.imsi_prefix || '',
        msisdn_prefix: item.msisdn_prefix || '',
        network_name: item.network_name || 'Nom inconnu',
        managed_object_group: item.managed_object_group || 'Groupe inconnu',
        node_name: item.node_name || 'Nœud inconnu',
        ...item
      }));
      
      setNetworkData(validatedData);
      setFilteredData(validatedData);
      
      const groups = [...new Set(validatedData.map(item => item.managed_object_group).filter(Boolean))];
      setUniqueGroups(groups);
      
    } catch (err) {
      console.error('Erreur lors de la récupération des données réseau:', err);
      setError(`Erreur: ${err.message || 'Impossible de charger les données'}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchNodes = async () => {
    try {
      const response = await axios.get('http://localhost:5178/api/huawei-networks/nodes');
      // Ensure response data is an array of node names
      if (response.data && Array.isArray(response.data.nodes)) {
          setAvailableNodes(response.data.nodes);
      } else {
          console.error('Server response for nodes is not an array:', response.data);
          setAvailableNodes([]); // Set to empty array on unexpected response
      }
    } catch (err) {
      console.error('Erreur lors de la récupération des nœuds:', err);
      setAvailableNodes([]); // Set to empty array on error
    }
  };

  // Initial data and node fetching on component mount
  useEffect(() => {
    fetchData();
    fetchNodes();
  }, []); // Empty dependency array means this effect runs only once on mount

  // Apply filters whenever search term, selected group, or network data changes
  useEffect(() => {
    if (!networkData.length) {
      setFilteredData([]);
      return;
    }
    
    let filtered = [...networkData];
    
    if (selectedGroup) {
      filtered = filtered.filter(item => item.managed_object_group === selectedGroup);
    }
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(item => 
        (item.imsi_prefix && item.imsi_prefix.toLowerCase().includes(search)) ||
        (item.msisdn_prefix && item.msisdn_prefix.toLowerCase().includes(search)) ||
        (item.network_name && item.network_name.toLowerCase().includes(search)) ||
        (item.node_name && item.node_name.toLowerCase().includes(search))
      );
    }
    
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedGroup, networkData]);

  // Apply node filter whenever selected node or filtered data changes
  const filteredDataByNode = selectedNode === 'all' 
    ? filteredData 
    : filteredData.filter(item => item.node_name === selectedNode);

  // Import MSS Huawei
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const allowedExtensions = ['.xml', '.log', '.txt'];
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(ext)) {
      setUploadStatus({ message: 'Veuillez sélectionner un fichier XML, LOG ou TXT', type: 'error' });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      setUploadStatus({ message: 'Import en cours...', type: 'info' });
      const response = await axios.post('http://localhost:5178/api/upload-huawei-networks', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setUploadStatus({ message: response.data.message, type: 'success' });
        // Refresh data and nodes after successful upload
        await fetchData(); 
        await fetchNodes(); 
        // Delay the page reload slightly to allow state updates to settle
        setTimeout(() => { window.location.reload(); }, 500); 
      } else {
        throw new Error(response.data.error || 'Erreur lors de l\'import');
      }
    } catch (error) {
      setUploadStatus({ message: error.response?.data?.error || error.message || 'Erreur lors de l\'import du fichier', type: 'error' });
    } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
    }
  };

  // Suppression d'un node MSS
  const handleDeleteNode = async () => {
    if (!nodeToDelete) return;
    try {
      setUploadStatus({ message: 'Suppression en cours...', type: 'info' });
      const response = await axios.delete(`http://localhost:5178/api/huawei-networks/node/${encodeURIComponent(nodeToDelete)}`);
      if (response.data.success) {
        setUploadStatus({ message: 'Suppression réussie', type: 'success' });
        setDeleteModalOpen(false);
        // Refresh data and nodes after successful deletion
        await fetchData(); 
        await fetchNodes();
        // Delay the page reload slightly
        setTimeout(() => { window.location.reload(); }, 500);
      } else {
        setUploadStatus({ message: response.data.error || 'Erreur lors de la suppression', type: 'error' });
      }
    } catch (error) {
      setUploadStatus({ message: error.response?.data?.error || error.message || 'Erreur lors de la suppression', type: 'error' });
    }
  };

  const getPaginatedData = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // Use filteredDataByNode for pagination
    return filteredDataByNode.slice(indexOfFirstItem, indexOfLastItem);
  };

  const renderTable = () => {
    if (loading) return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
    
    if (error) return (
      <div className="text-red-500 text-center p-4">
        <p>Error: {error}</p>
        <p className="text-sm mt-2">Check backend server on port 5178</p>
      </div>
    );
    
    // Use filteredDataByNode.length for the empty state check
    if (!filteredDataByNode || filteredDataByNode.length === 0) return (
      <p className="text-gray-500 text-center p-4">No data available for the selected filters.</p>
    );

    // Use filteredDataByNode.length for total pages calculation
    const totalPages = Math.ceil(filteredDataByNode.length / itemsPerPage);

    const paginatedData = getPaginatedData();

    return (
      <div>
        <div className="mb-4 flex items-center space-x-4">
          <div className="flex-1 flex items-center space-x-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by IMSI, MSISDN or Network Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
              <BsSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <div className="relative">
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 appearance-none bg-white min-w-[200px]"
              >
                <option value="">All Groups</option>
                {uniqueGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
              <BsFilter className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Use filteredDataByNode.length for the no matching records check */}
        {filteredDataByNode.length === 0 ? (
          <p className="text-gray-500 text-center p-4">No matching records found for the selected filters.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">IMSI Prefix</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">MSISDN Prefix</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Network Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Managed Object Group</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Node Name</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.imsi_prefix || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.msisdn_prefix || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.network_name || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.managed_object_group || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.node_name || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4 px-4">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                disabled={currentPage === 1} 
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-gray-600">Page {currentPage} of {totalPages || 1}</span>
              <button 
                onClick={() => setCurrentPage(prev => prev + 1)} 
                disabled={currentPage >= totalPages}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">MSS Huawei Data Analysis</h1>
        <p className="text-gray-600">View and analyze MSS Huawei information</p>
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
          <span>Importer MSS Huawei</span>
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
              {availableNodes.map(node => (
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

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Filtrer par nœud:</h2>
          <div className="flex gap-4">
            <select
              value={selectedNode}
              onChange={(e) => setSelectedNode(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="all">Tous les nœuds</option>
              {availableNodes.map((node) => (
                <option key={node} value={node}>
                  {node}
                </option>
              ))}
            </select>
          </div>
        </div>
        {renderTable()}
      </div>
    </div>
  );
};

export default MssHuawei;