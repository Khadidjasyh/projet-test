import React, { useState, useEffect, useRef } from "react";
import { BsSearch, BsUpload, BsTrash } from "react-icons/bs";
import axios from "axios";

const NetworkNodes = () => {
  const [nodes, setNodes] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5178/network-nodes');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      setNodes(result);
      setError(null);
    } catch (err) {
      setError(`Erreur lors du chargement des nœuds: ${err.message}`);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5178/api/network-nodes/${id}`);
      if (response.data.success) {
        setUploadStatus({ message: 'Nœud supprimé', type: 'success' });
        await fetchData();
      }
    } catch (error) {
      setUploadStatus({
        message: error.response?.data?.error || 'Erreur lors de la suppression',
        type: 'error'
      });
    }
    setDeleteModalOpen(false);
    setNodeToDelete(null);
  };
// SUPPRIMÉ la version doublon plus bas dans le fichier

  const openDeleteModal = (node) => {
    setNodeToDelete(node);
    setDeleteModalOpen(true);
  };

  const filteredNodes = nodes.filter(node =>
    (node.node_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (node.node_type?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
    (node.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  // SUPPRIMÉ car doublon et non utilisé dans la nouvelle version
// const filteredNodes = nodes.filter(node => {
//   const matchesSearch = 
//     node.node_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     node.location?.toLowerCase().includes(searchTerm.toLowerCase());
//   
//   const matchesFilters = 
//     (!filters.node_type || node.node_type === filters.node_type) &&
//     (!filters.vendor || node.vendor === filters.vendor);
//
//   return matchesSearch && matchesFilters;
// });

// La version simplifiée de filteredNodes est déjà définie plus haut

  const sortedNodes = React.useMemo(() => {
    let sortableNodes = [...filteredNodes];
    if (sortConfig.key) {
      sortableNodes.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableNodes;
  }, [filteredNodes, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort className="ml-1" />;
    }
    return sortConfig.direction === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />;
  };

  // Statistiques
  const stats = {
    totalNodes: nodes.length,
    activeNodes: nodes.filter(node => node.active).length,
    nodeTypes: nodes.reduce((acc, node) => {
      acc[node.node_type] = (acc[node.node_type] || 0) + 1;
      return acc;
    }, {}),
    vendors: nodes.reduce((acc, node) => {
      acc[node.vendor] = (acc[node.vendor] || 0) + 1;
      return acc;
    }, {})
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Nom', 'Type', 'Constructeur', 'IMSI', 'MCC', 'MNC', 'Statut'];
    const csvContent = [
      headers.join(','),
      ...sortedNodes.map(node => [
        node.id,
        node.node_name,
        node.node_type,
        node.vendor,
        node.imsi || '',
        node.mcc || '',
        node.mnc || '',
        node.active ? 'Actif' : 'Inactif'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'network_nodes.csv';
    link.click();
  };

  const getNodeTypeColor = (type) => {
    const colors = {
      'MSC': 'bg-blue-100 text-blue-800',
      'MSS': 'bg-purple-100 text-purple-800',
      'HLR': 'bg-green-100 text-green-800',
      'SGSN': 'bg-yellow-100 text-yellow-800',
      'MME': 'bg-pink-100 text-pink-800',
      'Firewall': 'bg-red-100 text-red-800',
      'GGSN': 'bg-indigo-100 text-indigo-800',
      'STP': 'bg-gray-100 text-gray-800',
      'DRA': 'bg-orange-100 text-orange-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getVendorColor = (vendor) => {
    const colors = {
      'Ericsson': 'bg-blue-100 text-blue-800',
      'Huawei': 'bg-red-100 text-red-800',
      'Cisco': 'bg-blue-100 text-blue-800',
      'Nokia': 'bg-gray-100 text-gray-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return colors[vendor] || 'bg-gray-100 text-gray-800';
  };

  const handleDownload = (node) => {
    // Logique pour télécharger les informations du nœud
    console.log('Téléchargement des informations pour:', node.node_name);
    alert(`Téléchargement des informations pour ${node.node_name}`);
  };

  const handleExport = (node) => {
    // Logique pour exporter les informations du nœud
    const data = [
      ['ID', 'Nom', 'Type', 'Constructeur', 'Statut'],
      [
        node.id,
        node.node_name,
        node.node_type,
        node.vendor,
        node.active ? 'Actif' : 'Inactif'
      ]
    ].join('\n');

    const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `node_${node.node_name}.csv`;
    link.click();
  };

  // SUPPRIMÉ : doublon inutile. La version asynchrone correcte est déjà utilisée plus haut.

  const handlePrint = (node) => {
    // Logique pour imprimer les informations du nœud
    console.log('Impression des informations pour:', node.node_name);
    alert(`Impression des informations pour ${node.node_name}`);
  };

  const handleImport = (node) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".log"; // Accepter uniquement les fichiers .log

    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          console.log(`Contenu du fichier importé pour ${node.node_name}:`, content);
          alert(`Fichier importé avec succès pour ${node.node_name}: ${file.name}`);
        };
        reader.onerror = (err) => {
          alert(`Erreur lors de la lecture du fichier : ${err.message}`);
        };
        reader.readAsText(file);
      }
    };

    input.click();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

    return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Nœuds Réseau</h1>
        <p className="text-gray-600">Visualisation et gestion des équipements réseau</p>
      </div>

      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Rechercher par nom, type ou constructeur"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 pr-10 text-gray-700 bg-white"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">
              <BsSearch />
            </span>
          </div>
          
        </div>
        
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

      {!loading && !error && nodes.length === 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded">
          <p>Aucun nœud réseau trouvé</p>
        </div>
      )}

      {!loading && filteredNodes.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10 bg-gray-100">
                <tr>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Nom</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Type</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Constructeur</th>
                  
                </tr>
              </thead>
              <tbody>
                {filteredNodes.map((item, idx) => (
                  <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-blue-50'}>
                    <td className="px-3 py-2 border-b text-center truncate max-w-[160px]" title={item.node_name || ''}>
                      {item.node_name || 'N/A'}
                    </td>
                    <td className="px-3 py-2 border-b text-center truncate max-w-[160px]" title={item.node_type || ''}>
                      {item.node_type || 'N/A'}
                    </td>
                    <td className="px-3 py-2 border-b text-center truncate max-w-[160px]" title={item.vendor || ''}>
                      {item.vendor || 'N/A'}
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4 px-4">
              <span className="text-sm text-gray-700">Total: {filteredNodes.length} nœud(s)</span>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default NetworkNodes;  