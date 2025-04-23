import React, { useState } from 'react';
import axios from 'axios';

const LogFileUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setMessage('');
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file');
            setMessageType('error');
            return;
        }

        setUploading(true);
        setMessage('Uploading file...');
        setMessageType('info');
        
        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('http://localhost:5177/api/upload-log', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 30000 // 30 second timeout
            });
            setMessage('File uploaded successfully');
            setMessageType('success');
            setFile(null);
            // Reset the file input
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = '';
        } catch (error) {
            console.error('Upload error:', error);
            setMessage('Error uploading file: ' + (error.response?.data?.error || error.message));
            setMessageType('error');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Upload Log Files</h2>
            <div className="space-y-4">
                <div className="flex items-center space-x-4">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-blue-50 file:text-blue-700
                            hover:file:bg-blue-100"
                        accept=".txt,.log"
                    />
                    <button
                        onClick={handleUpload}
                        disabled={uploading || !file}
                        className={`px-4 py-2 rounded-md text-white font-semibold
                            ${uploading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                </div>
                {message && (
                    <p className={`text-sm ${messageType === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {message}
                    </p>
                )}
                <div className="text-sm text-gray-500">
                    <p>Supported file types: .txt, .log</p>
                </div>
            </div>
        </div>
    );
};

export default LogFileUpload; 