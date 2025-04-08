const IR21ImportService = require('../services/ir21ImportService');
const db = require('../config/db.config');
const path = require('path');
const fs = require('fs').promises;

class DocumentController {
    constructor() {
        this.ir21ImportService = new IR21ImportService();
        // Bind all methods to this instance
        this.uploadIR21 = this.uploadIR21.bind(this);
        this.getDocumentsByPartner = this.getDocumentsByPartner.bind(this);
        this.getDocumentById = this.getDocumentById.bind(this);
        this.deleteDocument = this.deleteDocument.bind(this);
        this.getAllDocuments = this.getAllDocuments.bind(this);
    }

    async uploadIR21(req, res) {
        try {
            console.log('Starting upload process...');
            if (!req.file) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'No file uploaded' 
                });
            }

            console.log('File received:', req.file);
            console.log('IR21ImportService instance:', this.ir21ImportService);

            const uploadedBy = 1; // Default user ID for testing
            
            const result = await this.ir21ImportService.importIR21Document(
                req.file.path,
                uploadedBy
            );

            res.status(200).json({
                success: true,
                message: 'IR.21 document processed successfully',
                data: result
            });
        } catch (error) {
            console.error('Error in uploadIR21:', error);
            res.status(500).json({
                success: false,
                message: 'Error processing IR.21 document',
                error: error.message
            });
        }
    }

    getDocumentsByPartner = async (req, res) => {
        try {
            const partnerId = req.params.partnerId;
            const [documents] = await db.execute(
                'SELECT * FROM ir21_documents WHERE partner_id = ?',
                [partnerId]
            );

            res.status(200).json({
                success: true,
                data: documents
            });
        } catch (error) {
            console.error('Error fetching documents:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching documents',
                error: error.message
            });
        }
    }

    getDocumentById = async (req, res) => {
        try {
            const documentId = req.params.documentId;
            const [documents] = await db.execute(`
                SELECT d.*, p.name as partner_name, p.country 
                FROM ir21_documents d
                LEFT JOIN partners p ON d.partner_id = p.partner_id
                WHERE d.document_id = ?
            `, [documentId]);

            if (documents.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Document not found'
                });
            }

            res.status(200).json({
                success: true,
                data: documents[0]
            });
        } catch (error) {
            console.error('Error fetching document:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching document',
                error: error.message
            });
        }
    }

    deleteDocument = async (req, res) => {
        try {
            const documentId = req.params.documentId;
            const [document] = await db.execute(
                'SELECT file_path FROM ir21_documents WHERE document_id = ?',
                [documentId]
            );

            if (document.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Document not found'
                });
            }

            // Delete the file from storage
            try {
                await fs.unlink(document[0].file_path);
            } catch (error) {
                console.warn('File not found in storage:', error);
            }

            // Delete from database
            await db.execute(
                'DELETE FROM ir21_documents WHERE document_id = ?',
                [documentId]
            );

            res.status(200).json({
                success: true,
                message: 'Document deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting document:', error);
            res.status(500).json({
                success: false,
                message: 'Error deleting document',
                error: error.message
            });
        }
    }

    getAllDocuments = async (req, res) => {
        try {
            console.log('Fetching all IR21 documents...');
            const [documents] = await db.execute(
                'SELECT * FROM ir21_documents ORDER BY created_at DESC'
            );

            console.log(`Found ${documents.length} documents`);
            res.status(200).json({
                success: true,
                data: documents
            });
        } catch (error) {
            console.error('Error fetching all documents:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching documents',
                error: error.message
            });
        }
    }
}

// Create and export a single instance
const documentController = new DocumentController();
module.exports = documentController; 