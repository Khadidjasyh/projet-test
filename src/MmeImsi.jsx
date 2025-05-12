import React, { useState, useEffect } from 'react';
import { BsSearch } from 'react-icons/bs';

const MmeImsi = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5177/api/mme-imsi?page=${currentPage}&search=${searchTerm}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result.data);
        setTotalPages(result.totalPages);
      } catch (err) {
        setError('Error fetching MME IMSI data');
        console.error('Error fetching MME IMSI data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">MME IMSI Analysis</h1>
        <p className="text-gray-600">Explore IMSI entries with operator details</p>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search by IMSI or Operator"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            aria-label="Search MME IMSI"
          />
          <BsSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && <p className="text-center">Loading MME IMSI data...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Table */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
              
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">imsi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">default_apn_operator_id</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">digits_to_add</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">misc_info1</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">hss_realm_name</th>
                
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  
                  <td className="px-6 py-4 text-sm text-gray-700">{item.imsi}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{item.default_apn_operator_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{item.digits_to_add}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{item.misc_info1}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{item.hss_realm_name}</td>
                
                </tr>
              ))}
            </tbody>
          </table>

          {/* No Data Found */}
          {!loading && data.length === 0 && (
            <p className="text-center text-gray-500 py-4">No MME IMSI entries found.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600">Page {currentPage} of {totalPages || 1}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage >= totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default MmeImsi;
