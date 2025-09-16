const {
    getComplianceTasks,
    getComplianceTaskById,
    updateComplianceStatus,
    createComplianceTask,
    getOverdueCompliance,
    getDueSoonCompliance,
    getComplianceStats,
    updateComplianceTask,
    deleteComplianceTask
} = require('../Controllers/ComplianceController');
const { ensureAuthenticated, requireDepartmentAccess } = require('../Middlewares/Auth');
const { complianceValidation, complianceStatusValidation, paginationValidation } = require('../Middlewares/AuthValidation');

const router = require('express').Router();

// Get compliance tasks with filtering
router.get('/', ensureAuthenticated, paginationValidation, getComplianceTasks);

// Get single compliance task by ID
router.get('/:id', ensureAuthenticated, getComplianceTaskById);

// Create new compliance task
router.post('/', ensureAuthenticated, complianceValidation, createComplianceTask);

// Update compliance task status
router.patch('/:id/status', ensureAuthenticated, complianceStatusValidation, updateComplianceStatus);

// Update compliance task
router.put('/:id', ensureAuthenticated, updateComplianceTask);

// Delete compliance task
router.delete('/:id', ensureAuthenticated, deleteComplianceTask);

// Get overdue compliance tasks
router.get('/overdue/list', ensureAuthenticated, getOverdueCompliance);

// Get due soon compliance tasks
router.get('/due-soon/list', ensureAuthenticated, getDueSoonCompliance);

// Get compliance statistics
router.get('/stats/overview', ensureAuthenticated, getComplianceStats);

module.exports = router;
