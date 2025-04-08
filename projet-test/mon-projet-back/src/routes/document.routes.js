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
        const uploadDir = 'src/uploads'; // Set a specific path
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
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
    upload.single('file'),
    documentController.uploadIR21
);

router.get('/ir21/partner/:partnerId',
    documentController.getDocumentsByPartner
);

router.get('/ir21/:documentId',
    documentController.getDocumentById
);

router.delete('/ir21/:documentId',
    documentController.deleteDocument
);

module.exports = router; 