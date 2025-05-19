import React, { useState, useEffect, useRef } from 'react';
import { BsTable, BsSearch, BsUpload, BsTrash } from 'react-icons/bs';
import axios from 'axios';

const IR85Page = () => {
  const [ir85Data, setIr85Data] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadStatus, setUploadStatus] = useState({ message: '', type: '' });
  const fileInputRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5178/ir85');
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
      setIr85Data(result.data || result);
    } catch (err) {
      setError(err.message || 'Failed to fetch IR85 data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrage par recherche
  const filteredData = ir85Data.filter(item =>
    (item.tadig && item.tadig.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.pays && item.pays.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.ipaddress && item.ipaddress.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Tri alphabétique par TADIG
  const sortedData = [...filteredData].sort((a, b) => {
    if (!a.tadig) return 1;
    if (!b.tadig) return -1;
    return a.tadig.localeCompare(b.tadig);
  });
  const currentData = sortedData;

  // Import IR85
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.xml')) {
      setUploadStatus({ message: 'Veuillez sélectionner un fichier XML', type: 'error' });
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      setUploadStatus({ message: 'Import en cours...', type: 'info' });
      const response = await axios.post('http://localhost:5178/api/upload-ir85', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        setUploadStatus({ message: response.data.message, type: 'success' });
        setTimeout(fetchData, 2000);
      } else {
        throw new Error(response.data.error || 'Erreur lors de l\'import');
      }
    } catch (error) {
      setUploadStatus({ message: error.response?.data?.error || error.message || 'Erreur lors de l\'import du fichier', type: 'error' });
    }
  };

  // Suppression IR85
  const handleDelete = async (id) => {
    if (!window.confirm('Confirmer la suppression de cet opérateur IR85 ?')) return;
    try {
      const response = await axios.delete(`http://localhost:5178/api/ir85/${id}`);
      if (response.data.success) {
        setIr85Data(prev => prev.filter(row => row.id !== id));
        setUploadStatus({ message: 'Suppression réussie', type: 'success' });
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
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BsTable className="inline-block mr-2" /> IR85
        </h1>
        <p className="text-gray-600">Affichage et recherche des données IR85 extraites</p>
      </div>

      <div className="mb-4 flex items-center space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher par TADIG, pays ou IP..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
          <BsSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".xml"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <BsUpload className="mr-2" />
          <span>Importer IR85</span>
        </button>
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">
          <p>Error: {error}</p>
          <p className="text-sm mt-2">Vérifie que le backend IR85 fonctionne et retourne du JSON.</p>
        </div>
      ) : currentData.length === 0 ? (
        <p className="text-gray-500 text-center p-4">Aucune donnée trouvée</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 border-b">N°</th>
                <th className="px-6 py-3 border-b">TADIG</th>
                <th className="px-6 py-3 border-b">Pays</th>
                <th className="px-6 py-3 border-b">E212</th>
                <th className="px-6 py-3 border-b">E214</th>
                <th className="px-6 py-3 border-b">APN</th>
                <th className="px-6 py-3 border-b">IP Address</th>
                <th className="px-6 py-3 border-b">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{idx + 1}</td>
                  <td className="px-6 py-4 border-b">{row.tadig}</td>
                  <td className="px-6 py-4 border-b">{row.pays}</td>
                  <td className="px-6 py-4 border-b">{row.e212 || '-'}</td>
                  <td className="px-6 py-4 border-b">{row.e214 || '-'}</td>
                  <td className="px-6 py-4 border-b">{row.apn || '-'}</td>
                  <td className="px-6 py-4 border-b">
                    <div className="max-w-xs overflow-auto whitespace-normal">
                      {row.ipaddress}
                    </div>
                  </td>
                  <td className="px-6 py-4 border-b text-center">
                    <button
                      className="text-red-600 hover:text-red-800"
                      title="Supprimer"
                      onClick={() => handleDelete(row.id)}
                    >
                      <BsTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IR85Page;