const {
    indexDocument,
    semanticSearch,
    textSearch,
    getKnowledgeBaseEntries,
    getKnowledgeBaseEntryById,
    updateKnowledgeBaseEntry,
    deleteKnowledgeBaseEntry,
    getKnowledgeBaseStats
} = require('../Controllers/KnowledgeBaseController');
const { ensureAuthenticated, requireDepartmentAccess } = require('../Middlewares/Auth');
const { knowledgeBaseValidation, searchValidation, paginationValidation } = require('../Middlewares/AuthValidation');

const router = require('express').Router();

// Index document in knowledge base
router.post('/index', ensureAuthenticated, knowledgeBaseValidation, indexDocument);

// Semantic search using embeddings
router.get('/search/semantic', ensureAuthenticated, searchValidation, semanticSearch);

// Text-based search
router.get('/search/text', ensureAuthenticated, searchValidation, textSearch);

// Get knowledge base entries
router.get('/', ensureAuthenticated, paginationValidation, getKnowledgeBaseEntries);

// Get single knowledge base entry by ID
router.get('/:id', ensureAuthenticated, getKnowledgeBaseEntryById);

// Update knowledge base entry
router.put('/:id', ensureAuthenticated, updateKnowledgeBaseEntry);

// Delete knowledge base entry
router.delete('/:id', ensureAuthenticated, deleteKnowledgeBaseEntry);

// Get knowledge base statistics
router.get('/stats/overview', ensureAuthenticated, getKnowledgeBaseStats);

module.exports = router;
