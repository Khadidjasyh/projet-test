import React, { useState, useEffect } from 'react';
import { BsTable, BsSearch, BsUpload, BsCalendarDate, BsTrash } from 'react-icons/bs';

const HlrPage = () => {
    const [hlrData, setHlrData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [importing, setImporting] = useState(false);
    const [importMessage, setImportMessage] = useState(null);
    const [searchColumn, setSearchColumn] = useState('ns'); // Par défaut on filtre sur NS

    // Suppression d'une ligne HLR
    const handleDelete = async (id) => {
        if (!window.confirm('Voulez-vous vraiment supprimer cette ligne ?')) return;
        try {
            const response = await fetch(`http://localhost:5178/hlrr/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Erreur lors de la suppression');
            }
            // Rafraîchir les données après suppression
            const dataResponse = await fetch('http://localhost:5178/hlrr');
            const data = await dataResponse.json();
            setHlrData(data.data || data);
        } catch (err) {
            setError(err.message || 'Erreur lors de la suppression');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('http://localhost:5178/hlrr');
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
                setHlrData(result.data || result);
            } catch (err) {
                setError(err.message || 'Failed to fetch HLR data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.log') && !file.name.endsWith('.txt')) {
            setError('Le fichier doit être au format LOG ou TXT');
            return;
        }

        setImporting(true);
        setImportMessage(null);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:5178/import-hlr', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erreur lors de l\'import');
            }

            setImportMessage(`Import réussi : ${result.importedCount} entrées importées (${new Date().toLocaleString()})`);
            
            // Rafraîchir les données
            const dataResponse = await fetch('http://localhost:5178/hlrr');
            const data = await dataResponse.json();
            setHlrData(data.data || data);
        } catch (err) {
            setError(err.message || 'Erreur lors de l\'import du fichier');
        } finally {
            setImporting(false);
        }
    };

    // Filtrage spécifique sur la colonne NS
    const filteredData = hlrData.filter(item =>
        String(item.ns).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="mb-4">
                <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <BsTable className="inline-block mr-2" /> HLR Data
                </h1>
                <p className="text-sm text-gray-600">Gestion des données HLR - Filtre sur NS</p>
            </div>

            <div className="mb-4 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Rechercher dans NS..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-8 pr-3 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <BsSearch className="absolute left-2 top-2 text-gray-400" />
                    <div className="absolute right-2 top-1.5 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                        NS
                    </div>
                </div>
                <div className="relative">
                    <input
                        type="file"
                        id="hlr-file-upload"
                        accept=".log,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={importing}
                    />
                    <label
                        htmlFor="hlr-file-upload"
                        className={`bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded flex items-center cursor-pointer transition-colors ${
                            importing ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                    >
                        <BsUpload className="mr-1" />
                        <span>{importing ? 'Import...' : 'Importer'}</span>
                    </label>
                </div>
            </div>

            {importMessage && (
                <div className="mb-3 p-2 bg-green-100 text-green-700 text-sm rounded border border-green-200">
                    {importMessage}
                </div>
            )}

            {error && (
                <div className="mb-3 p-2 bg-red-100 text-red-700 text-sm rounded border border-red-200">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : filteredData.length === 0 ? (
                <div className="text-center p-4 bg-gray-50 rounded border border-gray-200 text-sm">
                    {searchTerm ? "Aucun résultat pour votre recherche dans NS" : "Aucune donnée disponible"}
                </div>
            ) : (
                <>
                    <div className="flex flex-wrap items-center justify-between mb-2">
                        <span className="text-gray-600 text-sm">
                            {filteredData.length} entr{filteredData.length > 1 ? 'ées' : 'ée'} affich{filteredData.length > 1 ? 'ées' : 'ée'}
                        </span>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                        <table className="min-w-full text-sm">
                            <thead className="sticky top-0 z-10 bg-gray-100">
                                <tr>
                                    <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">TT</th>
                                    <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">NP</th>
                                    <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">NA</th>
                                    <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">NS</th>
                                    <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">GTRC</th>
                                    <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center"><BsCalendarDate className="inline mr-1" />Date</th>
                                    <th className="px-3 py-2 border-b font-semibold text-gray-700 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((row, idx) => (
                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-blue-50'}>
                                        <td className="px-3 py-2 border-b text-center truncate max-w-[60px]" title={row.tt}>{row.tt}</td>
                                        <td className="px-3 py-2 border-b text-center truncate max-w-[60px]" title={row.np}>{row.np}</td>
                                        <td className="px-3 py-2 border-b text-center truncate max-w-[60px]" title={row.na}>{row.na}</td>
                                        <td className="px-3 py-2 border-b text-center font-mono font-semibold truncate max-w-[90px] text-blue-800" title={row.ns}>{row.ns}</td>
                                        <td className="px-3 py-2 border-b text-center truncate max-w-[90px]" title={row.gtrc}>{row.gtrc}</td>
                                        <td className="px-3 py-2 border-b text-center text-gray-500 truncate max-w-[110px]" title={row.created_at}>{row.created_at}</td>
                                        <td className="px-3 py-2 border-b text-center">
                                            <button
                                                className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                                                title="Supprimer"
                                                onClick={() => handleDelete(row.id)}
                                            >
                                                <BsTrash size={18} />
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

export default HlrPage;