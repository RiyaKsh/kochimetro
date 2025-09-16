const ComplianceModel = require('../Models/Compliance');
const DocumentModel = require('../Models/Document');
const UserModel = require('../Models/User');
const moment = require('moment');

const getComplianceTasks = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            sortBy = 'dueDate',
            sortOrder = 'asc',
            status,
            priority,
            department,
            assignedTo,
            dueSoon = false,
            overdue = false
        } = req.query;

        const user = req.user;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Build filter object
        let filter = { isActive: true };

        // Department filter based on user role
        if (user.role === 'department_user') {
            filter.department = user.department;
        } else if (department) {
            filter.department = department;
        }

        // Additional filters
        if (status) {
            filter.status = status;
        }

        if (priority) {
            filter.priority = priority;
        }

        if (assignedTo) {
            filter.assignedTo = assignedTo;
        }

        // Due soon filter (next 7 days)
        if (dueSoon === 'true') {
            const today = new Date();
            const sevenDaysFromNow = moment().add(7, 'days').toDate();
            filter.dueDate = { $gte: today, $lte: sevenDaysFromNow };
            filter.status = { $nin: ['Resolved'] };
        }

        // Overdue filter
        if (overdue === 'true') {
            const today = new Date();
            filter.dueDate = { $lt: today };
            filter.status = { $nin: ['Resolved'] };
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute query
        const [complianceTasks, totalCount] = await Promise.all([
            ComplianceModel.find(filter)
                .populate('documentId', 'title description department status')
                .populate('assignedTo', 'name email department')
                .populate('resolvedBy', 'name email')
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit)),
            ComplianceModel.countDocuments(filter)
        ]);

        // Get status counts for filtering
        const statusCounts = await ComplianceModel.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get priority counts
        const priorityCounts = await ComplianceModel.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            message: 'Compliance tasks retrieved successfully',
            success: true,
            data: {
                complianceTasks,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalCount / parseInt(limit)),
                    totalCount,
                    hasNext: skip + parseInt(limit) < totalCount,
                    hasPrev: parseInt(page) > 1
                },
                statusCounts,
                priorityCounts
            }
        });

    } catch (error) {
        console.error('Get compliance tasks error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get single compliance task by ID
const getComplianceTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const complianceTask = await ComplianceModel.findById(id)
            .populate('documentId', 'title description department status versions')
            .populate('assignedTo', 'name email department')
            .populate('resolvedBy', 'name email department');

        if (!complianceTask) {
            return res.status(404).json({
                message: 'Compliance task not found',
                success: false
            });
        }

        // Check department access
        if (user.role === 'department_user' && complianceTask.department !== user.department) {
            return res.status(403).json({
                message: 'Access denied: You can only view compliance tasks from your department',
                success: false
            });
        }

        res.status(200).json({
            message: 'Compliance task retrieved successfully',
            success: true,
            data: { complianceTask }
        });

    } catch (error) {
        console.error('Get compliance task by ID error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update compliance task status
const updateComplianceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, resolutionNotes } = req.body;
        const resolvedBy = req.user._id;

        const complianceTask = await ComplianceModel.findById(id);
        if (!complianceTask) {
            return res.status(404).json({
                message: 'Compliance task not found',
                success: false
            });
        }

        // Check department access
        if (req.user.role === 'department_user' && complianceTask.department !== req.user.department) {
            return res.status(403).json({
                message: 'Access denied: You can only modify compliance tasks from your department',
                success: false
            });
        }

        // Update compliance status
        await complianceTask.updateStatus(status, resolvedBy, resolutionNotes);

        // If resolved, update related document status
        if (status === 'Resolved') {
            await DocumentModel.findByIdAndUpdate(
                complianceTask.documentId,
                { status: 'Approved' }
            );
        }

        // Populate the updated compliance task
        const updatedComplianceTask = await ComplianceModel.findById(id)
            .populate('documentId', 'title description department status')
            .populate('assignedTo', 'name email department')
            .populate('resolvedBy', 'name email department');

        res.status(200).json({
            message: 'Compliance task status updated successfully',
            success: true,
            data: { complianceTask: updatedComplianceTask }
        });

    } catch (error) {
        console.error('Update compliance status error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Create new compliance task
const createComplianceTask = async (req, res) => {
    try {
        const {
            documentId,
            dueDate,
            priority = 'Medium',
            complianceType,
            description,
            assignedTo,
            reminders = true
        } = req.body;

        const user = req.user;

        // Verify document exists and get department
        const document = await DocumentModel.findById(documentId);
        if (!document) {
            return res.status(404).json({
                message: 'Document not found',
                success: false
            });
        }

        // Check department access
        if (user.role === 'department_user' && document.department !== user.department) {
            return res.status(403).json({
                message: 'Access denied: You can only create compliance tasks for documents in your department',
                success: false
            });
        }

        // Verify assigned user exists
        const assignedUser = await UserModel.findById(assignedTo);
        if (!assignedUser) {
            return res.status(404).json({
                message: 'Assigned user not found',
                success: false
            });
        }

        // Create compliance task
        const complianceTask = new ComplianceModel({
            documentId,
            dueDate: new Date(dueDate),
            priority,
            complianceType,
            description,
            assignedTo,
            reminders,
            department: document.department
        });

        await complianceTask.save();

        // Populate the created compliance task
        const populatedComplianceTask = await ComplianceModel.findById(complianceTask._id)
            .populate('documentId', 'title description department status')
            .populate('assignedTo', 'name email department');

        res.status(201).json({
            message: 'Compliance task created successfully',
            success: true,
            data: { complianceTask: populatedComplianceTask }
        });

    } catch (error) {
        console.error('Create compliance task error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get overdue compliance tasks
const getOverdueCompliance = async (req, res) => {
    try {
        const user = req.user;
        let filter = {};

        // Department filter based on user role
        if (user.role === 'department_user') {
            filter.department = user.department;
        }

        const overdueTasks = await ComplianceModel.findOverdue()
            .populate('documentId', 'title description department status')
            .populate('assignedTo', 'name email department')
            .populate('resolvedBy', 'name email department');

        // Filter by department if needed
        const filteredTasks = user.role === 'department_user' 
            ? overdueTasks.filter(task => task.department === user.department)
            : overdueTasks;

        res.status(200).json({
            message: 'Overdue compliance tasks retrieved successfully',
            success: true,
            data: { overdueTasks: filteredTasks }
        });

    } catch (error) {
        console.error('Get overdue compliance error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get due soon compliance tasks
const getDueSoonCompliance = async (req, res) => {
    try {
        const user = req.user;

        const dueSoonTasks = await ComplianceModel.findDueSoon()
            .populate('documentId', 'title description department status')
            .populate('assignedTo', 'name email department')
            .populate('resolvedBy', 'name email department');

        // Filter by department if needed
        const filteredTasks = user.role === 'department_user' 
            ? dueSoonTasks.filter(task => task.department === user.department)
            : dueSoonTasks;

        res.status(200).json({
            message: 'Due soon compliance tasks retrieved successfully',
            success: true,
            data: { dueSoonTasks: filteredTasks }
        });

    } catch (error) {
        console.error('Get due soon compliance error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get compliance statistics
const getComplianceStats = async (req, res) => {
    try {
        const user = req.user;
        const { department } = req.query;

        let filter = { isActive: true };

        // Department filter based on user role
        if (user.role === 'department_user') {
            filter.department = user.department;
        } else if (department) {
            filter.department = department;
        }

        const [
            totalTasks,
            pendingTasks,
            onTrackTasks,
            overdueTasks,
            resolvedTasks,
            tasksByPriority,
            tasksByDepartment,
            completionRate
        ] = await Promise.all([
            // Total tasks
            ComplianceModel.countDocuments(filter),

            // Tasks by status
            ComplianceModel.countDocuments({ ...filter, status: 'Pending' }),
            ComplianceModel.countDocuments({ ...filter, status: 'On Track' }),
            ComplianceModel.countDocuments({ ...filter, status: 'Overdue' }),
            ComplianceModel.countDocuments({ ...filter, status: 'Resolved' }),

            // Tasks by priority
            ComplianceModel.aggregate([
                { $match: filter },
                {
                    $group: {
                        _id: '$priority',
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Tasks by department (admin only)
            user.role === 'admin' ? ComplianceModel.aggregate([
                { $match: { isActive: true } },
                {
                    $group: {
                        _id: '$department',
                        count: { $sum: 1 }
                    }
                }
            ]) : [],

            // Completion rate
            ComplianceModel.aggregate([
                { $match: filter },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        resolved: {
                            $sum: {
                                $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0]
                            }
                        }
                    }
                }
            ])
        ]);

        const completionRateData = completionRate[0] || { total: 0, resolved: 0 };
        const completionRateValue = completionRateData.total > 0 
            ? Math.round((completionRateData.resolved / completionRateData.total) * 100) 
            : 0;

        res.status(200).json({
            message: 'Compliance statistics retrieved successfully',
            success: true,
            data: {
                overview: {
                    totalTasks,
                    pendingTasks,
                    onTrackTasks,
                    overdueTasks,
                    resolvedTasks,
                    completionRate: completionRateValue
                },
                tasksByPriority,
                tasksByDepartment: user.role === 'admin' ? tasksByDepartment : undefined
            }
        });

    } catch (error) {
        console.error('Get compliance stats error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update compliance task
const updateComplianceTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const user = req.user;

        const complianceTask = await ComplianceModel.findById(id);
        if (!complianceTask) {
            return res.status(404).json({
                message: 'Compliance task not found',
                success: false
            });
        }

        // Check department access
        if (user.role === 'department_user' && complianceTask.department !== user.department) {
            return res.status(403).json({
                message: 'Access denied: You can only modify compliance tasks from your department',
                success: false
            });
        }

        // Update compliance task
        const updatedComplianceTask = await ComplianceModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )
            .populate('documentId', 'title description department status')
            .populate('assignedTo', 'name email department')
            .populate('resolvedBy', 'name email department');

        res.status(200).json({
            message: 'Compliance task updated successfully',
            success: true,
            data: { complianceTask: updatedComplianceTask }
        });

    } catch (error) {
        console.error('Update compliance task error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete compliance task
const deleteComplianceTask = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const complianceTask = await ComplianceModel.findById(id);
        if (!complianceTask) {
            return res.status(404).json({
                message: 'Compliance task not found',
                success: false
            });
        }

        // Check department access
        if (user.role === 'department_user' && complianceTask.department !== user.department) {
            return res.status(403).json({
                message: 'Access denied: You can only delete compliance tasks from your department',
                success: false
            });
        }

        // Soft delete
        complianceTask.isActive = false;
        await complianceTask.save();

        res.status(200).json({
            message: 'Compliance task deleted successfully',
            success: true
        });

    } catch (error) {
        console.error('Delete compliance task error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    getComplianceTasks,
    getComplianceTaskById,
    updateComplianceStatus,
    createComplianceTask,
    getOverdueCompliance,
    getDueSoonCompliance,
    getComplianceStats,
    updateComplianceTask,
    deleteComplianceTask
};
