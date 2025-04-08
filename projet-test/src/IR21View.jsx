import React, { useState, useEffect } from 'react';
import { BsDownload, BsEye, BsTrash } from 'react-icons/bs';

const IR21View = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshDocuments = () => {
        setRefreshKey(prev => prev + 1);
    };

    useEffect(() => {
        fetchDocuments();
    }, [refreshKey]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchDocuments();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const fetchDocuments = async () => {
        try {
            console.log('Attempting to fetch documents from:', 'http://localhost:3000/api/documents/ir21/partner/all');
            const response = await fetch('http://localhost:3000/api/documents/ir21/partner/all');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched documents:', data);
            
            if (data.success && Array.isArray(data.data)) {
                if (data.data.length === 0) {
                    console.log('No documents found in the response');
                    setDocuments([]);
                } else {
                    console.log(`Found ${data.data.length} documents`);
                    setDocuments(data.data);
                }
            } else {
                console.warn('Unexpected data structure:', data);
                setDocuments([]);
            }
        } catch (err) {
            console.error('Error fetching documents:', err);
            setError(err.message);
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (documentId, fileName) => {
        try {
            console.log('Attempting to download document:', documentId);
            const response = await fetch(`http://localhost:3000/api/documents/ir21/${documentId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Error downloading file:', err);
            alert('Failed to download file. Please try again.');
        }
    };

    const handleDelete = async (documentId) => {
        if (!window.confirm('Are you sure you want to delete this document?')) return;
        
        try {
            console.log('Attempting to delete document:', documentId);
            const response = await fetch(`http://localhost:3000/api/documents/ir21/${documentId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Refresh the documents list
            fetchDocuments();
        } catch (err) {
            console.error('Error deleting document:', err);
            alert('Failed to delete document. Please try again.');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">IR.21 Documents</h1>
                <div className="flex space-x-4">
                    <button 
                        onClick={refreshDocuments}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                    >
                        <span>Refresh</span>
                    </button>
                    <button 
                        onClick={() => window.location.href = '/upload-ir21'}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                        <span>Upload New IR.21</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="text-red-500 text-center p-4">
                    Error: {error}
                </div>
            ) : documents.length === 0 ? (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">No IR.21 documents found.</p>
                    <p className="text-sm text-gray-400 mt-2">Upload a new document or check back later.</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partner</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {documents.map((doc) => (
                                <tr key={doc.document_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{doc.partner_name}</div>
                                        <div className="text-sm text-gray-500">{doc.country}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {doc.file_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(doc.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                            ${doc.status === 'Processed' ? 'bg-green-100 text-green-800' : 
                                              doc.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                                              'bg-red-100 text-red-800'}`}>
                                            {doc.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-3">
                                            <button 
                                                onClick={() => handleDownload(doc.document_id, doc.file_name)}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="Download"
                                            >
                                                <BsDownload className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => window.location.href = `/ir21/${doc.document_id}`}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <BsEye className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(doc.document_id)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Delete"
                                            >
                                                <BsTrash className="w-5 h-5" />
                                            </button>
                                        </div>
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

export default IR21View; 