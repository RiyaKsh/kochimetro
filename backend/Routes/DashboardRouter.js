const { getDashboardStats, getDepartmentStats } = require('../Controllers/DashboardController');
const { ensureAuthenticated, requireDepartmentAccess } = require('../Middlewares/Auth');
const { paginationValidation } = require('../Middlewares/AuthValidation');

const router = require('express').Router();

// Get dashboard statistics
router.get('/', ensureAuthenticated, paginationValidation, getDashboardStats);

// Get department-specific statistics
router.get('/department/:department', ensureAuthenticated, requireDepartmentAccess, getDepartmentStats);

module.exports = router;
