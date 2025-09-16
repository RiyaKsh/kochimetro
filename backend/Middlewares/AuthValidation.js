const Joi = require('joi');

// Common validation schemas
const commonSchemas = {
    name: Joi.string().min(2).max(100).trim().required(),
    email: Joi.string().email().lowercase().trim().required(),
    password: Joi.string().min(6).max(100).required(),
    department: Joi.string().min(2).max(100).trim().when('role', {
        is: 'department_user',
        then: Joi.required(),
        otherwise: Joi.optional()
    }),
    role: Joi.string().valid('admin', 'department_user').default('department_user')
};

// Auth validation
const signupValidation = async (req, res, next) => {
    const schema = Joi.object({
        name: commonSchemas.name,
        email: commonSchemas.email,
        password: commonSchemas.password,
        department: Joi.string().min(2).max(100).trim().when('role', {
            is: 'department_user',
            then: Joi.required(),
            otherwise: Joi.optional()
        }),
        role: commonSchemas.role
    });

    try {
        // convert: true allows transformations like .lowercase() and .trim()
    await schema.validateAsync(req.body, { abortEarly: false, convert: true, stripUnknown: true });
        next();
    } catch (error) {
        console.error('Signup validation failed:', error && error.details ? error.details.map(d => d.message) : error.message, 'body:', req.body);
        return res.status(400).json({
            message: 'Validation error',
            error: error && error.details ? error.details.map(d => d.message).join('; ') : error.message,
            success: false
        });
    }
};

const loginValidation = async (req, res, next) => {
    const schema = Joi.object({
        email: commonSchemas.email,
        password: commonSchemas.password
    });

    try {
    await schema.validateAsync(req.body, { abortEarly: false, convert: true, stripUnknown: true });
        next();
    } catch (error) {
        console.error('Login validation failed:', error && error.details ? error.details.map(d => d.message) : error.message, 'body:', req.body);
        return res.status(400).json({
            message: 'Validation error',
            error: error && error.details ? error.details.map(d => d.message).join('; ') : error.message,
            success: false
        });
    }
};
// Middleware to convert CSV strings to arrays
const parseArrays = (req, res, next) => {
  if (req.body.allowedDepartments && typeof req.body.allowedDepartments === 'string') {
    // split by comma and trim spaces
    req.body.allowedDepartments = req.body.allowedDepartments.split(',').map(s => s.trim());
  }

  if (req.body.allowedUsers && typeof req.body.allowedUsers === 'string') {
    req.body.allowedUsers = req.body.allowedUsers.split(',').map(s => s.trim());
  }

  next();
};

// Document validation
const documentValidation = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(200).trim().required(),
        description: Joi.string().min(10).max(1000).trim().required(),
        department: commonSchemas.department,
        tags: Joi.array().items(Joi.string().max(50).trim()).max(10).optional(),
        status: Joi.string().valid('Draft', 'Pending Review', 'Under Review', 'Approved', 'Rejected').optional(),
        category: Joi.string().max(100).trim().optional(),
        language: Joi.string().max(50).trim().optional(),
        priority: Joi.string().optional(),
        access: Joi.string().valid('self','department','cross-department').required(),
        allowedDepartments: Joi.array().items(Joi.string().max(50).trim()).optional(),
        allowedUsers: Joi.array().items(Joi.string()).optional()
    });
    
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ 
            message: "Validation error", 
            error: error.details[0].message,
            success: false 
        });
    }
    next();
};

const documentStatusValidation = (req, res, next) => {
    const schema = Joi.object({
        status: Joi.string().valid('Draft', 'Pending Review', 'Under Review', 'Approved', 'Rejected').required(),
        reviewComments: Joi.string().max(1000).trim().optional()
    });
    
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ 
            message: "Validation error", 
            error: error.details[0].message,
            success: false 
        });
    }
    next();
};

// Compliance validation
const complianceValidation = (req, res, next) => {
    const schema = Joi.object({
        documentId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
        dueDate: Joi.date().greater('now').required(),
        priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').default('Medium'),
        complianceType: Joi.string().min(3).max(100).trim().required(),
        description: Joi.string().min(10).max(1000).trim().required(),
        assignedTo: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
        reminders: Joi.boolean().default(true)
    });
    
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ 
            message: "Validation error", 
            error: error.details[0].message,
            success: false 
        });
    }
    next();
};

const complianceStatusValidation = (req, res, next) => {
    const schema = Joi.object({
        status: Joi.string().valid('Pending', 'On Track', 'Overdue', 'Resolved').required(),
        resolutionNotes: Joi.string().max(1000).trim().optional()
    });
    
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ 
            message: "Validation error", 
            error: error.details[0].message,
            success: false 
        });
    }
    next();
};

// Knowledge base validation
const knowledgeBaseValidation = (req, res, next) => {
    const schema = Joi.object({
        documentId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
        title: Joi.string().min(3).max(200).trim().required(),
        content: Joi.string().min(10).required(),
        summary: Joi.string().max(500).trim().optional(),
        category: Joi.string().min(3).max(100).trim().required(),
        department: commonSchemas.department,
        tags: Joi.array().items(Joi.string().max(50).trim()).max(10).optional(),
        keywords: Joi.array().items(Joi.string().max(50).trim()).max(20).optional(),
        language: Joi.string().max(10).default('en')
    });
    
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ 
            message: "Validation error", 
            error: error.details[0].message,
            success: false 
        });
    }
    next();
};

// Search validation
const searchValidation = (req, res, next) => {
    const schema = Joi.object({
        q: Joi.string().min(2).max(200).trim().required(),
        department: Joi.string().max(100).trim().optional(),
        category: Joi.string().max(100).trim().optional(),
        tags: Joi.array().items(Joi.string().max(50).trim()).max(10).optional(),
        limit: Joi.number().integer().min(1).max(100).default(20),
        skip: Joi.number().integer().min(0).default(0)
    });
    
    const { error } = schema.validate(req.query);
    if (error) {
        return res.status(400).json({ 
            message: "Validation error", 
            error: error.details[0].message,
            success: false 
        });
    }
    next();
};

// Pagination validation
const paginationValidation = (req, res, next) => {
    const schema = Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(20),
        sortBy: Joi.string().max(50).optional(),
        sortOrder: Joi.string().valid('asc', 'desc').default('desc'),
        search: Joi.string().max(200).trim().optional()
    });
    
    const { error } = schema.validate(req.query);
    if (error) {
        return res.status(400).json({ 
            message: "Validation error", 
            error: error.details[0].message,
            success: false 
        });
    }
    next();
};

module.exports = {
    signupValidation,
    loginValidation,
    documentValidation,
    documentStatusValidation,
    complianceValidation,
    complianceStatusValidation,
    knowledgeBaseValidation,
    searchValidation,
    paginationValidation,
    parseArrays
};