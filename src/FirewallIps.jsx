import React, { useState, useEffect, useRef } from 'react';
import { BsSearch, BsUpload, BsTrash } from 'react-icons/bs';
import axios from 'axios';

const FirewallIPs = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ message: '', type: '' });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);
  const fileInputRef = useRef(null);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5178/firewall-ips');
      
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(`Error fetching firewall IPs: ${err.message}`);
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

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploadStatus({ message: 'Uploading file...', type: 'info' });
      const response = await axios.post('http://localhost:5178/api/upload-firewall', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setUploadStatus({ message: response.data.message, type: 'success' });
        fetchData();
      } else {
        setUploadStatus({ message: response.data.message || 'Upload failed', type: 'error' });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus({ 
        message: error.response?.data?.message || 'Error uploading file', 
        type: 'error' 
      });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5178/api/firewall/entry/${id}`);
      
      if (response.data.success) {
        setUploadStatus({ message: response.data.message, type: 'success' });
        fetchData();
      } else {
        setUploadStatus({ message: response.data.message || 'Delete failed', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      setUploadStatus({ 
        message: error.response?.data?.message || 'Error deleting entry', 
        type: 'error' 
      });
    }
    setDeleteModalOpen(false);
    setEntryToDelete(null);
  };

  const openDeleteModal = (entry) => {
    setEntryToDelete(entry);
    setDeleteModalOpen(true);
  };

  const filteredData = data.filter(entry =>
    (entry.nom ? entry.nom.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
    (entry.cidr_complet ? entry.cidr_complet.toLowerCase().includes(searchTerm.toLowerCase()) : false)
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Firewall IPs</h1>
        <p className="text-gray-600">Manage and view firewall IP entries</p>
      </div>

      <div className="mb-4 flex items-center space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by name or IP range"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
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
          <span>Import Firewall</span>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">CIDR</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">{item.nom || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{item.cidr_complet || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <button
                      onClick={() => openDeleteModal(item)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete entry"
                    >
                      <BsTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end items-center mt-4">
          <span className="text-gray-600">Total: {filteredData.length} entries</span>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && entryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete the entry:
              <br />
              <strong>Name:</strong> {entryToDelete.nom}
              <br />
              <strong>CIDR:</strong> {entryToDelete.cidr_complet}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setEntryToDelete(null);
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(entryToDelete.identifiant)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirewallIPs;