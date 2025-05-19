import React, { useState, useEffect, useRef } from 'react';
import { BsSearch, BsUpload } from 'react-icons/bs';
import axios from 'axios';

const FirewallIPs = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ message: '', type: '' });
  const fileInputRef = useRef(null);

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedExtensions = ['.txt'];
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(ext)) {
      setUploadStatus({ message: 'Veuillez sélectionner un fichier .txt.', type: 'error' });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadStatus({ message: 'Importation en cours...', type: 'info' });
      const response = await axios.post('http://localhost:5178/api/upload-firewall', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setUploadStatus({ message: response.data.message, type: 'success' });
        fetchData();
      } else {
        throw new Error(response.data.error || 'Erreur lors de l\'importation');
      }
    } catch (error) {
      setUploadStatus({ message: error.response?.data?.error || error.message || 'Erreur lors de l\'importation du fichier', type: 'error' });
    } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
    }
  };

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

      <div className="mb-4 flex items-center space-x-4">
        <div className="relative flex-grow">
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
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".txt"
          className="hidden"
          id="firewall-file-upload"
        />
        <label
          htmlFor="firewall-file-upload"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center"
        >
          <BsUpload className="mr-2" />
          <span>Importer Firewall</span>
        </label>
      </div>

      {uploadStatus.message && (
        <div className={`mb-4 p-3 rounded ${
          uploadStatus.type === 'error' ? 'bg-red-100 text-red-700' :
          uploadStatus.type === 'success' ? 'bg-green-100 text-green-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {uploadStatus.message}
        </div>
      )}

      {loading && <p>Loading firewall IPs...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {data.length === 0 && !loading && !error && (
        <p>No firewall IP entries found.</p>
      )}

      <div className="bg-white rounded-lg shadow p-4">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">IP Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">{item.nom || item.identifiant || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{item.cidr_complet || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end items-center mt-4">
          <span className="text-gray-600">Total: {filteredData.length} entrées</span>
        </div>
      </div>
    </div>
  );
};

export default FirewallIPs;