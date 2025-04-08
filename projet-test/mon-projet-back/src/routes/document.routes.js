const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/auth');
const documentController = require('../controllers/documentController');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = process.env.UPLOAD_DIR || 'uploads';
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Keep the original filename
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept XML and PDF files
    if (file.mimetype === 'application/xml' || 
        file.mimetype === 'text/xml' ||
        file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only XML and PDF files are allowed.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB
    }
});

// Routes
router.post('/ir21/upload', 
    authMiddleware.verifyToken,
    upload.single('file'),
    documentController.uploadIR21
);

router.get('/ir21/partner/:partnerId',
    authMiddleware.verifyToken,
    documentController.getDocumentsByPartner
);

router.get('/ir21/:documentId',
    authMiddleware.verifyToken,
    documentController.getDocumentById
);

router.delete('/ir21/:documentId',
    authMiddleware.verifyToken,
    documentController.deleteDocument
);

module.exports = router; 