const express = require('express');
const { inviteEmployee } = require('../Controllers/userController.js');
const { ensureAuthenticated, requireAdmin } = require('../Middlewares/Auth');
const { getDepartmentEmployees } = require('../Controllers/userController.js');
const { assignUsersToDocument } = require('../Controllers/userController.js');
const router = express.Router();

// POST /api/users/invite
router.post('/invite', ensureAuthenticated, requireAdmin, inviteEmployee);
router.get('/department-employees', ensureAuthenticated, requireAdmin, getDepartmentEmployees);
router.post('/assign-document/:id', ensureAuthenticated, requireAdmin, assignUsersToDocument);

module.exports = router;
