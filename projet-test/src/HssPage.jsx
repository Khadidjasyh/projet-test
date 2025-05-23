import React, { useState, useEffect } from 'react';
import { BsTable, BsSearch, BsTrash } from 'react-icons/bs';

const HssPage = () => {
  const [hssData, setHssData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadStatus, setUploadStatus] = useState({ message: '', type: '' });

  const handleImportHss = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    setUploadStatus({ message: 'Importation en cours...', type: 'info' });

    try {
      const response = await fetch('http://localhost:5178/api/import-hss', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setUploadStatus({ message: result.message || 'Importation réussie', type: 'success' });
        setTimeout(() => window.location.reload(), 1500);
      } else {
        throw new Error(result.error || 'Erreur lors de l\'import');
      }
    } catch (error) {
      setUploadStatus({ message: error.message || 'Erreur lors de l\'import', type: 'error' });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5178/hss');
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
        setHssData(result.data || result);
      } catch (err) {
        setError(err.message || 'Failed to fetch HSS Somalia data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = hssData.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const currentData = filteredData;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <BsTable className="inline-block mr-2" /> HSS 
        </h1>
        <p className="text-gray-600">Affichage et recherche des données HSS extraites</p>
      </div>
      {/* Bouton Importer HSS aligné à droite */}
      <div className="mb-6 flex justify-end">
        <input
          type="file"
          id="hss-upload-input"
          accept=".txt,.csv,.log"
          style={{ display: 'none' }}
          onChange={e => {
            const file = e.target.files[0];
            if (!file) return;
            handleImportHss(file);
            e.target.value = '';
          }}
        />
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
          onClick={() => document.getElementById('hss-upload-input').click()}
        >
          <span className="mr-2"><svg width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" className="inline-block"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.6A1.5 1.5 0 0 0 2.5 14.5h11a1.5 1.5 0 0 0 1.5-1.5v-2.6a.5.5 0 0 1 1 0v2.6A2.5 2.5 0 0 1 13.5 15.5h-11A2.5 2.5 0 0 1 0 12.5v-2.6a.5.5 0 0 1 .5-.5z"></path><path d="M7.646 10.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 1 0-.708-.708L8.5 9.293V1.5a.5.5 0 0 0-1 0v7.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z"></path></svg></span>
          <span>Importer HSS</span>
        </button>
        {uploadStatus.message && (
          <div className={`mb-4 p-3 rounded ${
            uploadStatus.type === 'error'
              ? 'bg-red-100 text-red-700'
              : uploadStatus.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {uploadStatus.message}
          </div>
        )}
      </div>

      <div className="mb-4 flex items-center space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Recherche"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
          <BsSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">
          <p>Error: {error}</p>
          <p className="text-sm mt-2">Vérifie que le backend HSS fonctionne et retourne du JSON.</p>
        </div>
      ) : currentData.length === 0 ? (
        <p className="text-gray-500 text-center p-4">Aucune donnée trouvée</p>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">
              {currentData.length} entr{currentData.length > 1 ? 'ées' : 'ée'} affich{currentData.length > 1 ? 'ées' : 'ée'}
            </span>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="sticky top-0 z-10 bg-gray-100">
                <tr>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">EPC</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">IMSI</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">3G</th>
                  <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">HSS_ESM</th>
<th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((row, idx) => (
  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-blue-50'}>
    <td className="px-3 py-2 border-b text-center truncate max-w-[90px]" title={row.epc}>{row.epc}</td>
    <td className="px-3 py-2 border-b text-center truncate max-w-[120px] font-mono text-blue-800" title={row.imsi_prefix || '—'}>{row.imsi_prefix || '—'}</td>
    <td className="px-3 py-2 border-b text-center truncate max-w-[60px]" title={row['3g']}>{row['3g']}</td>
    <td className="px-3 py-2 border-b text-center truncate max-w-[120px]" title={row.hss_esm}>{row.hss_esm}</td>
    <td className="px-3 py-2 border-b text-center">
      <button
        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
        title="Supprimer"
        onClick={async () => {
          if (!window.confirm('Supprimer cette entrée HSS ?')) return;
          try {
            const response = await fetch(`http://localhost:5178/api/hss/${row.id}`, {
              method: 'DELETE',
            });
            if (response.ok) {
              setHssData(prev => prev.filter(r => r.id !== row.id));
            } else {
              const result = await response.json();
              alert(result.error || 'Erreur lors de la suppression');
            }
          } catch (error) {
            alert('Erreur lors de la suppression');
          }
        }}
      >
        <BsTrash />
      </button>
    </td>
  </tr>
))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default HssPage;