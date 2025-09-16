const express = require('express');
const router = express.Router();
const multer = require('multer');
const { ensureAuthenticated } = require('../Middlewares/Auth');
const { documentValidation ,parseArrays} = require('../Middlewares/AuthValidation');
const {
    uploadDocument,
    getDocuments,
    getDocumentById,
    updateDocumentStatus,
    deleteDocument,
    getSharedDocuments
    
} = require('../Controllers/DocumentController');

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Routes
router.post('/', ensureAuthenticated, upload.single('file'),parseArrays, documentValidation, uploadDocument);
router.get('/', ensureAuthenticated, getDocuments);
router.get('/:id', ensureAuthenticated, getDocumentById);
router.put('/:id', ensureAuthenticated, updateDocumentStatus);
router.delete('/:id', ensureAuthenticated, deleteDocument);
router.get('/shared', ensureAuthenticated, getSharedDocuments);

module.exports = router;
