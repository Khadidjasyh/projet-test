import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const IR21DocumentView = () => {
    const { documentId } = useParams();
    const navigate = useNavigate();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                console.log('Fetching document:', documentId);
                const response = await fetch(`http://localhost:3000/api/documents/ir21/${documentId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Document data:', data);
                
                // Ensure we're setting the correct data structure
                if (data.success && data.data) {
                    setDocument(data.data);
                } else {
                    throw new Error('Invalid data structure received from server');
                }
            } catch (err) {
                console.error('Error fetching document:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [documentId]);

    const handleDownload = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/documents/ir21/${documentId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = document?.file_name || 'document.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('Error downloading file:', err);
            alert('Failed to download file. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h2 className="text-red-800 font-semibold">Error</h2>
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={() => navigate('/ir21')}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Back to Documents
                    </button>
                </div>
            </div>
        );
    }

    if (!document) {
        return (
            <div className="p-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h2 className="text-yellow-800 font-semibold">Document Not Found</h2>
                    <p className="text-yellow-600">The requested document could not be found.</p>
                    <button
                        onClick={() => navigate('/ir21')}
                        className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                    >
                        Back to Documents
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Document Details</h1>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => navigate('/ir21')}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleDownload}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                            <span>Download</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Document ID</h3>
                            <p className="mt-1 text-lg text-gray-900">{document.document_id}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Partner</h3>
                            <p className="mt-1 text-lg text-gray-900">{document.partner_name || 'N/A'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Country</h3>
                            <p className="mt-1 text-lg text-gray-900">{document.country || 'N/A'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Status</h3>
                            <p className="mt-1 text-lg text-gray-900">{document.status || 'N/A'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                            <p className="mt-1 text-lg text-gray-900">
                                {document.created_at ? new Date(document.created_at).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">File Name</h3>
                            <p className="mt-1 text-lg text-gray-900">{document.file_name || 'N/A'}</p>
                        </div>
                    </div>

                    {/* Add document preview or content here if needed */}
                </div>
            </div>
        </div>
    );
};

export default IR21DocumentView; 