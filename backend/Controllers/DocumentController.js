
const ComplianceModel = require('../Models/Compliance');
const UserModel = require('../Models/User');
const Document = require('../Models/Document');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/documents';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    // Allow common document formats
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only documents, images, and text files are allowed.'), false);
    }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: process.env.MAX_FILE_SIZE || 10485760 // 10MB
  },
  fileFilter: fileFilter
}).single('file');

// Wrap upload in promise
const uploadAsync = (req, res) => {
  return new Promise((resolve, reject) => {
    upload(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// Upload new document
const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Make sure allowedDepartments is always an array
        let allowedDepartments = req.body.allowedDepartments || [];
const { title, description, category, language, priority, access } = req.body;

// Handle allowedDepartments based on access type
if (access === 'self') {
    allowedDepartments = []; // only uploader can access
} else if (access === 'department') {
    allowedDepartments = [req.user.department]; // all employees in uploader's dept
} else if (access === 'cross-department') {
    if (!allowedDepartments.length) {
        // Give access to all other departments
        const allDepartments = ['engineering', 'procurement', 'hr', 'finance', 'safety', 'legal','marketting']; // replace with your list
        allowedDepartments = allDepartments.filter(d => d !== req.user.department);
    }
}

const newDocument = new Document({
    title,
    description,
    category,
    language,
    priority,
    uploadedBy: req.user._id,
    department: req.user.department,
    access,
    allowedDepartments,
    versions: [
        {
            fileUrl: req.file.path,
            uploadedBy: req.user._id,
            versionNumber: 1
        }
    ],
    currentVersion: 1
});

await newDocument.save();

        res.status(201).json({
            message: 'Document uploaded successfully',
            success: true,
            data: newDocument
        });
    } catch (error) {
        console.error('Upload Document Error:', error);
        res.status(500).json({ message: 'Error uploading document', error: error.message });
    }
};


// Get documents with filtering and pagination
const getDocuments = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            search,
            status
        } = req.query;

        const user = req.user;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Base filter
        let filter = { $or: [] };

        // 1️⃣ Self (uploader can see)
        filter.$or.push({
            access: 'self',
            uploadedBy: user._id
        });

        // 2️⃣ Self + Allowed Users
        filter.$or.push({
            access: 'self',
            allowedUsers: user._id
        });

        // 3️⃣ Department access → anyone in same dept
        filter.$or.push({
            access: 'department',
            department: user.department
        });

        // 4️⃣ Cross-department → only admins in allowed depts
        if (user.role === 'admin') {
            filter.$or.push({
                access: 'cross-department',
                allowedDepartments: user.department
            });
        }

        // 🔎 Search filter
        if (search) {
            filter.$and = [
                { $or: filter.$or }, // keep access control rules
                {
                    $or: [
                        { title: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } },
                        { tags: { $in: [new RegExp(search, 'i')] } }
                    ]
                }
            ];
            delete filter.$or; // move to $and
        }

        // ✅ Status filter
        if (status) {
            if (!filter.$and) filter.$and = [{ $or: filter.$or }];
            filter.$and.push({ status });
        }

        // Sort
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute query
        const [documents, totalCount] = await Promise.all([
            Document.find(filter)
                .populate('uploadedBy', 'name email department')
                .populate('reviewedBy', 'name email')
                .populate('allowedUsers', 'name email department')
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit)),
            Document.countDocuments(filter)
        ]);

        // 🔹 Add latest file URL for each document
        const documentsWithFileUrl = documents.map(doc => {
            const latestVersion = doc.versions && doc.versions.length
                ? doc.versions[doc.versions.length - 1]
                : null;
            return {
                ...doc.toObject(),
                fileUrl: latestVersion ? latestVersion.fileUrl : null
            };
        });

        // Status counts
        const statusCounts = await Document.aggregate([
            { $match: filter },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            message: 'Documents retrieved successfully',
            success: true,
            data: {
                documents: documentsWithFileUrl,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalCount / parseInt(limit)),
                    totalCount,
                    hasNext: skip + parseInt(limit) < totalCount,
                    hasPrev: parseInt(page) > 1
                },
                statusCounts
            }
        });

    } catch (error) {
        console.error('Get documents error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};




// Get single document by ID
const getDocumentById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const document = await Document.findById(id)
            .populate('uploadedBy', 'name email department')
            .populate('reviewedBy', 'name email department');

        if (!document) {
            return res.status(404).json({
                message: 'Document not found',
                success: false
            });
        }

        // Check department access
        if (user.role === 'department_user' && document.department !== user.department) {
            return res.status(403).json({
                message: 'Access denied: You can only view documents from your department',
                success: false
            });
        }

        res.status(200).json({
            message: 'Document retrieved successfully',
            success: true,
            data: { document }
        });

    } catch (error) {
        console.error('Get document by ID error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update document status (Admin only)
const updateDocumentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reviewComments } = req.body;
        const reviewedBy = req.user._id;

        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({
                message: 'Document not found',
                success: false
            });
        }

        // Update document status
        await document.updateStatus(status, reviewedBy, reviewComments);

        // If document is approved, update related compliance tasks
        if (status === 'Approved') {
            await ComplianceModel.updateMany(
                { documentId: id, isActive: true },
                { 
                    status: 'Resolved',
                    resolvedAt: new Date(),
                    resolvedBy: reviewedBy,
                    resolutionNotes: 'Document approved'
                }
            );
        }

        // Populate the updated document
        const updatedDocument = await Document.findById(id)
            .populate('uploadedBy', 'name email')
            .populate('reviewedBy', 'name email');

        res.status(200).json({
            message: 'Document status updated successfully',
            success: true,
            data: { document: updatedDocument }
        });

    } catch (error) {
        console.error('Update document status error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get document versions
const getDocumentVersions = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const document = await Document.findById(id)
            .populate('versions.uploadedBy', 'name email');

        if (!document) {
            return res.status(404).json({
                message: 'Document not found',
                success: false
            });
        }

        // Check department access
        if (user.role === 'department_user' && document.department !== user.department) {
            return res.status(403).json({
                message: 'Access denied: You can only view documents from your department',
                success: false
            });
        }

        res.status(200).json({
            message: 'Document versions retrieved successfully',
            success: true,
            data: {
                documentId: document._id,
                title: document.title,
                versions: document.versions
            }
        });

    } catch (error) {
        console.error('Get document versions error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Add new version to document
const addDocumentVersion = async (req, res) => {
    try {
        const { id } = req.params;
        const { changeDescription = '' } = req.body;
        const uploadedBy = req.user._id;

        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({
                message: 'Document not found',
                success: false
            });
        }

        // Check department access
        if (req.user.role === 'department_user' && document.department !== req.user.department) {
            return res.status(403).json({
                message: 'Access denied: You can only modify documents from your department',
                success: false
            });
        }

        // Handle file upload
        upload.single('file')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    message: err.message,
                    success: false
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    message: 'No file uploaded',
                    success: false
                });
            }

            try {
                const fileUrl = `/uploads/documents/${req.file.filename}`;
                await document.addVersion(fileUrl, uploadedBy, changeDescription);

                // Reset status to Pending Review for new version
                document.status = 'Pending Review';
                document.reviewedBy = null;
                document.reviewedAt = null;
                document.reviewComments = '';
                await document.save();

                res.status(200).json({
                    message: 'New version added successfully',
                    success: true,
                    data: {
                        documentId: document._id,
                        currentVersion: document.currentVersion,
                        totalVersions: document.versions.length
                    }
                });

            } catch (error) {
                // Clean up uploaded file if version addition fails
                if (req.file && fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
                throw error;
            }
        });

    } catch (error) {
        console.error('Add document version error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete document (Admin only)
const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;

        const document = await Document.findById(id);
        if (!document) {
            return res.status(404).json({
                message: 'Document not found',
                success: false
            });
        }

        // Soft delete - mark as archived
        document.isArchived = true;
        document.archiveReason = 'Deleted by admin';
        await document.save();

        // Deactivate related compliance tasks
        await ComplianceModel.updateMany(
            { documentId: id },
            { isActive: false }
        );

        res.status(200).json({
            message: 'Document deleted successfully',
            success: true
        });

    } catch (error) {
        console.error('Delete document error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Helper function to generate compliance task
const generateComplianceTask = async (documentId, department, assignedTo) => {
    try {
        // Set due date to 30 days from now
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);

        const complianceTask = new ComplianceModel({
            documentId,
            dueDate,
            complianceType: 'Document Review',
            description: 'Review and approve uploaded document',
            assignedTo,
            priority: 'Medium',
            reminders: true
        });

        await complianceTask.save();
        return complianceTask;
    } catch (error) {
        console.error('Error generating compliance task:', error);
        // Don't throw error as this shouldn't fail the document upload
    }
};
const getSharedDocuments = async (req, res) => {
  try {
    const admin = req.user; // make sure middleware sets this
    console.log('Admin:', admin);
    if (!admin) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (admin.role !== 'admin') {
      return res.status(403).json({ message: 'Admins only' });
    }

    // Fetch documents where admin's department is in allowedDepartments
    const docs = await Document.find({
      allowedDepartments: { $in: [admin.department] }
    }).lean(); // lean() makes it a plain JS object

    res.status(200).json({
      success: true,
      data: docs
    });
  } catch (error) {
    console.error('Error fetching shared documents:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};




module.exports = {
    uploadDocument,
    getDocuments,
    getDocumentById,
    updateDocumentStatus,
    getDocumentVersions,
    addDocumentVersion,
    deleteDocument,
    getSharedDocuments,
    upload // Export multer upload for use in routes
};
