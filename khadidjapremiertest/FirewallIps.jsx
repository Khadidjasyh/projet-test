import React, { useState, useEffect } from 'react';
import { BsSearch } from 'react-icons/bs';

const FirewallIPs = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching firewall IPs from backend...');
        const response = await fetch('http://localhost:5178/firewall-ips');
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response not OK:', errorText);
          throw new Error(`Network response was not ok: ${response.status} ${errorText}`);
        }
        
        const result = await response.json();
        console.log('Firewall IPs data received:', result);
        
        if (!Array.isArray(result)) {
          console.error('Expected array but got:', typeof result);
          setError('Invalid data format received from server');
          setData([]);
          return;
        }
        
        setData(result);
      } catch (err) {
        setError(`Error fetching firewall IPs: ${err.message}`);
        console.error('Error details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter(entry =>
    (entry.nom ? entry.nom.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
    (entry.cidr_complet ? entry.cidr_complet.toLowerCase().includes(searchTerm.toLowerCase()) : false)
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Firewall IPs</h1>
        <p className="text-gray-600">Explore the list of imported firewall IP entries</p>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search by name or IP range"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            aria-label="Search firewall IPs"
          />
          <BsSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && <p>Loading firewall IPs...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* No Data Found */}
      {data.length === 0 && !loading && !error && (
        <p>No firewall IP entries found.</p>
      )}

      {/* Résumé du nombre d'entrées */}
      <div className="flex flex-wrap items-center justify-between mb-2">
        <span className="text-gray-600 text-sm">
          {filteredData.length} entr{filteredData.length > 1 ? 'ées' : 'ée'} affich{filteredData.length > 1 ? 'ées' : 'ée'}
        </span>
      </div>
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 bg-gray-100">
            <tr>
              <th className="px-3 py-2 border-b font-semibold text-gray-700">Nom</th>
              <th className="px-3 py-2 border-b font-semibold text-gray-700">IP Range</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-blue-50'}>
                <td className="px-3 py-2 border-b truncate max-w-[200px]" title={item.nom || item.identifiant || 'N/A'}>{item.nom || item.identifiant || 'N/A'}</td>
                <td className="px-3 py-2 border-b font-mono text-blue-800 truncate max-w-[180px]" title={item.cidr_complet || 'N/A'}>{item.cidr_complet || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FirewallIPs;