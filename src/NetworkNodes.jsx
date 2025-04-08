import React, { useState, useEffect } from "react";
import { FaServer, FaFilter, FaSearch, FaNetworkWired, FaSort, FaSortUp, FaSortDown, FaFileExport, FaChartPie } from "react-icons/fa";

const NetworkNodes = () => {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    node_type: "",
    vendor: ""
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const response = await fetch('http://localhost:5177/network-nodes');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        const data = await response.json();
        setNodes(data);
        setError(null);
      } catch (err) {
        console.error("Erreur:", err);
        setError("Erreur lors du chargement des nœuds réseau");
      } finally {
        setLoading(false);
      }
    };

    fetchNodes();
  }, []);

  const filteredNodes = nodes.filter(node => {
    const matchesSearch = 
      node.node_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilters = 
      (!filters.node_type || node.node_type === filters.node_type) &&
      (!filters.vendor || node.vendor === filters.vendor);

    return matchesSearch && matchesFilters;
  });

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
    const headers = ['ID', 'Nom', 'Type', 'Constructeur', 'IP', 'GT', 'Localisation', 'Statut'];
    const csvContent = [
      headers.join(','),
      ...sortedNodes.map(node => [
        node.id,
        node.node_name,
        node.node_type,
        node.vendor,
        node.ip_address || '',
        node.gt || '',
        node.location || '',
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <FaNetworkWired className="text-3xl text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Nœuds Réseau</h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FaChartPie className="mr-2" />
              Statistiques
            </button>
            <button
              onClick={exportToCSV}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <FaFileExport className="mr-2" />
              Exporter CSV
            </button>
          </div>
        </div>

        {showStats && (
          <div className="mb-6 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Statistiques des Nœuds</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800">Total Nœuds</h3>
                <p className="text-3xl font-bold text-blue-600">{stats.totalNodes}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-800">Nœuds Actifs</h3>
                <p className="text-3xl font-bold text-green-600">{stats.activeNodes}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-purple-800">Types de Nœuds</h3>
                <div className="mt-2">
                  {Object.entries(stats.nodeTypes).map(([type, count]) => (
                    <div key={type} className="flex justify-between">
                      <span className="text-purple-600">{type}:</span>
                      <span className="font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-yellow-800">Constructeurs</h3>
                <div className="mt-2">
                  {Object.entries(stats.vendors).map(([vendor, count]) => (
                    <div key={vendor} className="flex justify-between">
                      <span className="text-yellow-600">{vendor}:</span>
                      <span className="font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Barre de recherche et filtres */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher par nom ou localisation..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.node_type}
                onChange={(e) => setFilters({ ...filters, node_type: e.target.value })}
              >
                <option value="">Type de nœud</option>
                <option value="MSC">MSC</option>
                <option value="MSS">MSS</option>
                <option value="HLR">HLR</option>
                <option value="SGSN">SGSN</option>
                <option value="MME">MME</option>
                <option value="Firewall">Firewall</option>
                <option value="GGSN">GGSN</option>
                <option value="STP">STP</option>
                <option value="DRA">DRA</option>
              </select>
              <select
                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.vendor}
                onChange={(e) => setFilters({ ...filters, vendor: e.target.value })}
              >
                <option value="">Constructeur</option>
                <option value="Ericsson">Ericsson</option>
                <option value="Huawei">Huawei</option>
                <option value="Cisco">Cisco</option>
                <option value="Nokia">Nokia</option>
                <option value="Other">Autre</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tableau des nœuds */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('node_name')}
                >
                  Nom {getSortIcon('node_name')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('node_type')}
                >
                  Type {getSortIcon('node_type')}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('vendor')}
                >
                  Constructeur {getSortIcon('vendor')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localisation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedNodes.map((node) => (
                <tr key={node.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{node.node_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNodeTypeColor(node.node_type)}`}>
                      {node.node_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVendorColor(node.vendor)}`}>
                      {node.vendor}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{node.ip_address || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{node.gt || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{node.location || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${node.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {node.active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NetworkNodes; 