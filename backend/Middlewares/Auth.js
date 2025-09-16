const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User');

// Basic authentication middleware
const ensureAuthenticated = async (req, res, next) => {
    try {
        const auth = req.headers['authorization'];
        if (!auth) {
            return res.status(401).json({ 
                message: 'Unauthorized, JWT token is required',
                success: false 
            });
        }

        const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch user details to ensure they're still active
        const user = await UserModel.findById(decoded._id).select('-password');
        if (!user || !user.isActive) {
            return res.status(401).json({ 
                message: 'User not found or inactive',
                success: false 
            });
        }

        req.user = {
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            department: user.department
        };
        
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                message: 'Token expired, please login again',
                success: false 
            });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                message: 'Invalid token',
                success: false 
            });
        }
        
        return res.status(500).json({ 
            message: 'Authentication error',
            success: false 
        });
    }
};

// Role-based access control middleware
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                message: 'Authentication required',
                success: false 
            });
        }

        const userRole = req.user.role;
        const allowedRoles = Array.isArray(roles) ? roles : [roles];

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({ 
                message: 'Insufficient permissions',
                success: false 
            });
        }

        next();
    };
};

// Admin only middleware
const requireAdmin = requireRole('admin');

// Department access middleware - users can only access their own department's data
const requireDepartmentAccess = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ 
            message: 'Authentication required',
            success: false 
        });
    }

    // Admins can access all departments
    if (req.user.role === 'admin') {
        return next();
    }

    // Department users can only access their own department
    const requestedDepartment = req.params.department || req.body.department || req.query.department;
    
    if (requestedDepartment && requestedDepartment !== req.user.department) {
        return res.status(403).json({ 
            message: 'Access denied: You can only access your department\'s data',
            success: false 
        });
    }

    next();
};

// Optional authentication - doesn't fail if no token provided
const optionalAuth = async (req, res, next) => {
    try {
        const auth = req.headers['authorization'];
        if (!auth) {
            return next();
        }

        const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await UserModel.findById(decoded._id).select('-password');
        if (user && user.isActive) {
            req.user = {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
                department: user.department
            };
        }
        
        next();
    } catch (err) {
        // Continue without authentication for optional auth
        next();
    }
};

module.exports = {
    ensureAuthenticated,
    requireRole,
    requireAdmin,
    requireDepartmentAccess,
    optionalAuth
};