import React, { useState, useEffect } from 'react';
import { BsTable, BsSearch, BsFilter } from 'react-icons/bs';

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

  // Fetch all mobile networks data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5178/mobile-networks');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        
        setNetworkData(result);
        setFilteredData(result);
        
        // Extract unique managed object groups for the filter dropdown
        const groups = [...new Set(result.map(item => item.managed_object_group).filter(Boolean))];
        setUniqueGroups(groups);
      } catch (err) {
        console.error('Error fetching network data:', err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Apply filters whenever search term or selected group changes
  useEffect(() => {
    if (!networkData.length) return;
    
    let filtered = [...networkData];
    
    // Filter by managed object group if selected
    if (selectedGroup) {
      filtered = filtered.filter(item => item.managed_object_group === selectedGroup);
    }
    
    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(item => 
        (item.imsi_prefix && item.imsi_prefix.toLowerCase().includes(search)) ||
        (item.msisdn_prefix && item.msisdn_prefix.toLowerCase().includes(search)) ||
        (item.network_name && item.network_name.toLowerCase().includes(search))
      );
    }
    
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedGroup, networkData]);

  const getPaginatedData = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredData.slice(indexOfFirstItem, indexOfLastItem);
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
        <p className="text-sm mt-2">Check backend server on port 5177</p>
      </div>
    );
    
    if (!networkData || networkData.length === 0) return (
      <p className="text-gray-500 text-center p-4">No data available</p>
    );

    const paginatedData = getPaginatedData();
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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

        {filteredData.length === 0 ? (
          <p className="text-gray-500 text-center p-4">No matching records found</p>
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.imsi_prefix || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.msisdn_prefix || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.network_name || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.managed_object_group || '-'}</td>
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

      <div className="bg-white rounded-lg shadow p-6">
        {renderTable()}
      </div>
    </div>
  );
};

export default MssHuawei;