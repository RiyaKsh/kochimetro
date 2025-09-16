const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

// Import routes
const AuthRouter = require('./Routes/AuthRouter');
const DashboardRouter = require('./Routes/DashboardRouter');
const DocumentRouter = require('./Routes/DocumentRouter');
const ComplianceRouter = require('./Routes/ComplianceRouter');
const KnowledgeBaseRouter = require('./Routes/KnowledgeBaseRouter');
const Employees = require('./Routes/Employees');

require('dotenv').config();
require('./Models/db');
const PORT = process.env.PORT || 8080;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Logging middleware
app.use(morgan('combined'));

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (for uploaded documents)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Health check endpoint
app.get('/ping', (req, res) => {
    res.json({ 
        message: 'PONG', 
        timestamp: new Date().toISOString(),
        status: 'healthy'
    });
});

// API routes
app.use('/api/auth', AuthRouter);
app.use('/api/dashboard', DashboardRouter);
app.use('/api/documents', DocumentRouter);
app.use('/api/compliance', ComplianceRouter);
app.use('/api/knowledge-base', KnowledgeBaseRouter);
app.use('/api/employees', Employees);

// 404 handler - catch all for unmatched routes
app.use((req, res) => {
    res.status(404).json({
        message: 'API endpoint not found',
        success: false,
        path: req.originalUrl
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    
    // Multer error handling
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            message: 'File too large. Maximum size is 10MB.',
            success: false
        });
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
            message: 'Unexpected field in file upload.',
            success: false
        });
    }
    
    // Default error response
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
        success: false,
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Start server
try {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
} catch (error) {
  console.error('Server failed to start:', error);
  process.exit(1);
}