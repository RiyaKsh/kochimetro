const { 
    register, 
    login, 
    getProfile, 
    updateProfile, 
    changePassword, 
    logout 
} = require('../Controllers/AuthController');
const { 
    signupValidation, 
    loginValidation 
} = require('../Middlewares/AuthValidation');
const { ensureAuthenticated } = require('../Middlewares/Auth');

const router = require('express').Router();

// Public routes
router.post('/register', signupValidation, register);
router.post('/login', loginValidation, login);

// Protected routes
router.get('/profile', ensureAuthenticated, getProfile);
router.put('/profile', ensureAuthenticated, updateProfile);
router.put('/change-password', ensureAuthenticated, changePassword);
router.post('/logout', ensureAuthenticated, logout);

module.exports = router;