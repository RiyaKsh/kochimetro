const DocumentModel = require('../Models/Document');
const ComplianceModel = require('../Models/Compliance');
const KnowledgeBaseModel = require('../Models/KnowledgeBase');
const UserModel = require('../Models/User');
const moment = require('moment');

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        const user = req.user;
        const { department } = req.query;
        
        // Determine department filter based on user role
        let departmentFilter = {};
        if (user.role === 'department_user') {
            departmentFilter = { department: user.department };
        } else if (department) {
            departmentFilter = { department };
        }

        // Get current date and date ranges
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startOfWeek = moment().startOf('week').toDate();
        const startOfMonth = moment().startOf('month').toDate();
        const sevenDaysAgo = moment().subtract(7, 'days').toDate();
        const thirtyDaysAgo = moment().subtract(30, 'days').toDate();

        // Parallel queries for better performance
        const [
            documentsUploadedToday,
            totalDocuments,
            pendingCompliance,
            overdueCompliance,
            activeDepartments,
            knowledgeBaseItems,
            weeklyUploads,
            monthlyUploads,
            complianceTrends,
            recentDocuments,
            upcomingCompliance
        ] = await Promise.all([
            // Documents uploaded today
            DocumentModel.countDocuments({
                ...departmentFilter,
                createdAt: { $gte: startOfToday }
            }),

            // Total documents
            DocumentModel.countDocuments(departmentFilter),

            // Pending compliance count
            ComplianceModel.countDocuments({
                ...departmentFilter,
                status: { $in: ['Pending', 'On Track'] },
                isActive: true
            }),

            // Overdue compliance count
            ComplianceModel.countDocuments({
                ...departmentFilter,
                dueDate: { $lt: today },
                status: { $nin: ['Resolved'] },
                isActive: true
            }),

            // Active departments count
            UserModel.distinct('department', { isActive: true }),

            // Knowledge base items count
            KnowledgeBaseModel.countDocuments({
                ...departmentFilter,
                isActive: true
            }),

            // Weekly uploads (last 7 days)
            DocumentModel.aggregate([
                {
                    $match: {
                        ...departmentFilter,
                        createdAt: { $gte: sevenDaysAgo }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]),

            // Monthly uploads (last 30 days)
            DocumentModel.aggregate([
                {
                    $match: {
                        ...departmentFilter,
                        createdAt: { $gte: thirtyDaysAgo }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]),

            // Compliance trends (last 30 days)
            ComplianceModel.aggregate([
                {
                    $match: {
                        ...departmentFilter,
                        createdAt: { $gte: thirtyDaysAgo },
                        isActive: true
                    }
                },
                {
                    $group: {
                        _id: {
                            status: "$status",
                            date: {
                                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                            }
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { "_id.date": 1 }
                }
            ]),

            // Recent documents (last 10)
            DocumentModel.find(departmentFilter)
                .populate('uploadedBy', 'name email')
                .populate('reviewedBy', 'name email')
                .sort({ createdAt: -1 })
                .limit(10)
                .select('title status department createdAt uploadedBy reviewedBy'),

            // Upcoming compliance (due in next 7 days)
            ComplianceModel.find({
                ...departmentFilter,
                dueDate: { 
                    $gte: today, 
                    $lte: moment().add(7, 'days').toDate() 
                },
                status: { $nin: ['Resolved'] },
                isActive: true
            })
                .populate('documentId', 'title department')
                .populate('assignedTo', 'name email')
                .sort({ dueDate: 1 })
                .limit(10)
                .select('documentId dueDate status priority assignedTo complianceType')
        ]);

        // Process weekly uploads data
        const weeklyUploadsData = [];
        for (let i = 6; i >= 0; i--) {
            const date = moment().subtract(i, 'days').format('YYYY-MM-DD');
            const dayData = weeklyUploads.find(item => item._id === date);
            weeklyUploadsData.push({
                date,
                count: dayData ? dayData.count : 0
            });
        }

        // Process compliance trends
        const complianceTrendsData = {
            Pending: [],
            'On Track': [],
            Overdue: [],
            Resolved: []
        };

        complianceTrends.forEach(trend => {
            const status = trend._id.status;
            const date = trend._id.date;
            if (complianceTrendsData[status]) {
                complianceTrendsData[status].push({
                    date,
                    count: trend.count
                });
            }
        });

        // Calculate compliance completion rate
        const totalCompliance = await ComplianceModel.countDocuments({
            ...departmentFilter,
            isActive: true
        });
        const resolvedCompliance = await ComplianceModel.countDocuments({
            ...departmentFilter,
            status: 'Resolved',
            isActive: true
        });
        const complianceCompletionRate = totalCompliance > 0 
            ? Math.round((resolvedCompliance / totalCompliance) * 100) 
            : 0;

        // Calculate document approval rate
        const approvedDocuments = await DocumentModel.countDocuments({
            ...departmentFilter,
            status: 'Approved'
        });
        const documentApprovalRate = totalDocuments > 0 
            ? Math.round((approvedDocuments / totalDocuments) * 100) 
            : 0;

        // Department statistics (only for admins)
        let departmentStats = [];
        if (user.role === 'admin') {
            const departments = await UserModel.distinct('department', { isActive: true });
            departmentStats = await Promise.all(
                departments.map(async (dept) => {
                    const deptFilter = { department: dept };
                    const [
                        docCount,
                        complianceCount,
                        userCount
                    ] = await Promise.all([
                        DocumentModel.countDocuments(deptFilter),
                        ComplianceModel.countDocuments({ ...deptFilter, isActive: true }),
                        UserModel.countDocuments({ department: dept, isActive: true })
                    ]);

                    return {
                        department: dept,
                        documents: docCount,
                        compliance: complianceCount,
                        users: userCount
                    };
                })
            );
        }

        res.status(200).json({
            message: "Dashboard statistics retrieved successfully",
            success: true,
            data: {
                overview: {
                    documentsUploadedToday,
                    totalDocuments,
                    pendingCompliance,
                    overdueCompliance,
                    activeDepartments: activeDepartments.length,
                    knowledgeBaseItems,
                    complianceCompletionRate,
                    documentApprovalRate
                },
                trends: {
                    weeklyUploads: weeklyUploadsData,
                    complianceTrends: complianceTrendsData
                },
                recent: {
                    recentDocuments,
                    upcomingCompliance
                },
                departmentStats: user.role === 'admin' ? departmentStats : undefined
            }
        });

    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get department-specific statistics
const getDepartmentStats = async (req, res) => {
    try {
        const { department } = req.params;
        const user = req.user;

        // Check if user has access to this department
        if (user.role === 'department_user' && user.department !== department) {
            return res.status(403).json({
                message: 'Access denied: You can only view your department\'s statistics',
                success: false
            });
        }

        const departmentFilter = { department };

        const [
            totalDocuments,
            documentsByStatus,
            complianceByStatus,
            monthlyTrends,
            topUsers
        ] = await Promise.all([
            // Total documents
            DocumentModel.countDocuments(departmentFilter),

            // Documents by status
            DocumentModel.aggregate([
                { $match: departmentFilter },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Compliance by status
            ComplianceModel.aggregate([
                { 
                    $match: { 
                        ...departmentFilter, 
                        isActive: true 
                    } 
                },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Monthly trends (last 12 months)
            DocumentModel.aggregate([
                {
                    $match: {
                        ...departmentFilter,
                        createdAt: { $gte: moment().subtract(12, 'months').toDate() }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: '$createdAt' },
                            month: { $month: '$createdAt' }
                        },
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { '_id.year': 1, '_id.month': 1 }
                }
            ]),

            // Top users by document uploads
            DocumentModel.aggregate([
                { $match: departmentFilter },
                {
                    $group: {
                        _id: '$uploadedBy',
                        count: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                {
                    $unwind: '$user'
                },
                {
                    $project: {
                        name: '$user.name',
                        email: '$user.email',
                        documentCount: '$count'
                    }
                },
                {
                    $sort: { documentCount: -1 }
                },
                {
                    $limit: 10
                }
            ])
        ]);

        res.status(200).json({
            message: "Department statistics retrieved successfully",
            success: true,
            data: {
                department,
                totalDocuments,
                documentsByStatus,
                complianceByStatus,
                monthlyTrends,
                topUsers
            }
        });

    } catch (error) {
        console.error('Department stats error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    getDashboardStats,
    getDepartmentStats
};
