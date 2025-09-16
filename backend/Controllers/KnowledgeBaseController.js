const KnowledgeBaseModel = require('../Models/KnowledgeBase');
const DocumentModel = require('../Models/Document');
const OpenAI = require('openai');

// Initialize OpenAI client only when API key is provided.
let openai = null;
if (process.env.OPENAI_API_KEY) {
    try {
        openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    } catch (err) {
        console.warn('Warning: failed to initialize OpenAI client:', err.message || err);
        openai = null;
    }
} else {
    console.warn('Warning: OPENAI_API_KEY not set. KnowledgeBase embeddings functionality will be disabled.');
}

// Generate embeddings using OpenAI
const generateEmbeddings = async (text) => {
    if (!openai) {
        const msg = 'OpenAI API key not configured. Embeddings are unavailable.';
        console.error('generateEmbeddings:', msg);
        throw new Error(msg);
    }

    try {
        const response = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: text
        });
        return response.data[0].embedding;
    } catch (error) {
        console.error('Error generating embeddings:', error);
        throw new Error('Failed to generate embeddings');
    }
};

// Index document in knowledge base
const indexDocument = async (req, res) => {
    try {
        const {
            documentId,
            title,
            content,
            summary,
            category,
            department,
            tags = [],
            keywords = [],
            language = 'en'
        } = req.body;

        const user = req.user;

        // Verify document exists
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
                message: 'Access denied: You can only index documents from your department',
                success: false
            });
        }

        // Generate embeddings for the content
        const embeddings = await generateEmbeddings(content);

        // Create knowledge base entry
        const knowledgeBaseEntry = new KnowledgeBaseModel({
            documentId,
            title,
            content,
            summary,
            embeddings,
            category,
            department: document.department,
            tags,
            keywords,
            language,
            createdBy: user._id
        });

        await knowledgeBaseEntry.save();

        res.status(201).json({
            message: 'Document indexed successfully',
            success: true,
            data: {
                knowledgeBaseId: knowledgeBaseEntry._id,
                documentId: knowledgeBaseEntry.documentId,
                title: knowledgeBaseEntry.title,
                category: knowledgeBaseEntry.category
            }
        });

    } catch (error) {
        console.error('Index document error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Semantic search using embeddings
const semanticSearch = async (req, res) => {
    try {
        const { q, department, category, tags, limit = 20, skip = 0 } = req.query;
        const user = req.user;

        if (!q || q.trim().length < 2) {
            return res.status(400).json({
                message: 'Search query is required and must be at least 2 characters',
                success: false
            });
        }

        // Generate embeddings for the search query
        const queryEmbeddings = await generateEmbeddings(q);

        // Build filter object
        let filter = { isActive: true };

        // Department filter based on user role
        if (user.role === 'department_user') {
            filter.department = user.department;
        } else if (department) {
            filter.department = department;
        }

        // Additional filters
        if (category) {
            filter.category = category;
        }

        if (tags && Array.isArray(tags)) {
            filter.tags = { $in: tags };
        }

        // Find similar documents using vector similarity
        const similarDocuments = await KnowledgeBaseModel.findSimilar(
            queryEmbeddings,
            parseInt(limit),
            0.7 // similarity threshold
        );

        // Apply additional filters
        const filteredDocuments = similarDocuments.filter(doc => {
            if (filter.department && doc.department !== filter.department) return false;
            if (filter.category && doc.category !== filter.category) return false;
            if (filter.tags && !doc.tags.some(tag => filter.tags.$in.includes(tag))) return false;
            return true;
        });

        // Apply pagination
        const paginatedDocuments = filteredDocuments.slice(parseInt(skip), parseInt(skip) + parseInt(limit));

        // Update search count for accessed documents
        await Promise.all(
            paginatedDocuments.map(doc => doc.incrementSearchCount())
        );

        // Populate document details
        const populatedDocuments = await KnowledgeBaseModel.populate(
            paginatedDocuments,
            {
                path: 'documentId',
                select: 'title description department status createdAt'
            }
        );

        res.status(200).json({
            message: 'Semantic search completed successfully',
            success: true,
            data: {
                query: q,
                results: populatedDocuments,
                totalResults: filteredDocuments.length,
                pagination: {
                    limit: parseInt(limit),
                    skip: parseInt(skip),
                    hasMore: (parseInt(skip) + parseInt(limit)) < filteredDocuments.length
                }
            }
        });

    } catch (error) {
        console.error('Semantic search error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Text-based search (fallback)
const textSearch = async (req, res) => {
    try {
        const { q, department, category, tags, limit = 20, skip = 0 } = req.query;
        const user = req.user;

        if (!q || q.trim().length < 2) {
            return res.status(400).json({
                message: 'Search query is required and must be at least 2 characters',
                success: false
            });
        }

        // Build filter object
        let filter = { isActive: true };

        // Department filter based on user role
        if (user.role === 'department_user') {
            filter.department = user.department;
        } else if (department) {
            filter.department = department;
        }

        // Additional filters
        if (category) {
            filter.category = category;
        }

        if (tags && Array.isArray(tags)) {
            filter.tags = { $in: tags };
        }

        // Text search
        const searchResults = await KnowledgeBaseModel.searchByText(q, {
            department: filter.department,
            category: filter.category,
            tags: filter.tags,
            limit: parseInt(limit),
            skip: parseInt(skip)
        });

        // Update search count
        await Promise.all(
            searchResults.map(doc => doc.incrementSearchCount())
        );

        res.status(200).json({
            message: 'Text search completed successfully',
            success: true,
            data: {
                query: q,
                results: searchResults,
                totalResults: searchResults.length,
                pagination: {
                    limit: parseInt(limit),
                    skip: parseInt(skip)
                }
            }
        });

    } catch (error) {
        console.error('Text search error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get knowledge base entries
const getKnowledgeBaseEntries = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            category,
            department,
            tags,
            search
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
        if (category) {
            filter.category = category;
        }

        if (tags && Array.isArray(tags)) {
            filter.tags = { $in: tags };
        }

        // Search filter
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { summary: { $regex: search, $options: 'i' } },
                { tags: { $in: [new RegExp(search, 'i')] } },
                { keywords: { $in: [new RegExp(search, 'i')] } }
            ];
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Execute query
        const [entries, totalCount] = await Promise.all([
            KnowledgeBaseModel.find(filter)
                .populate('documentId', 'title description department status')
                .populate('createdBy', 'name email')
                .populate('updatedBy', 'name email')
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit))
                .select('-embeddings'), // Exclude embeddings for list view
            KnowledgeBaseModel.countDocuments(filter)
        ]);

        // Get category counts
        const categoryCounts = await KnowledgeBaseModel.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            message: 'Knowledge base entries retrieved successfully',
            success: true,
            data: {
                entries,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalCount / parseInt(limit)),
                    totalCount,
                    hasNext: skip + parseInt(limit) < totalCount,
                    hasPrev: parseInt(page) > 1
                },
                categoryCounts
            }
        });

    } catch (error) {
        console.error('Get knowledge base entries error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get single knowledge base entry
const getKnowledgeBaseEntryById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const entry = await KnowledgeBaseModel.findById(id)
            .populate('documentId', 'title description department status versions')
            .populate('createdBy', 'name email department')
            .populate('updatedBy', 'name email department');

        if (!entry) {
            return res.status(404).json({
                message: 'Knowledge base entry not found',
                success: false
            });
        }

        // Check department access
        if (user.role === 'department_user' && entry.department !== user.department) {
            return res.status(403).json({
                message: 'Access denied: You can only view knowledge base entries from your department',
                success: false
            });
        }

        // Update access count
        await entry.incrementSearchCount();

        res.status(200).json({
            message: 'Knowledge base entry retrieved successfully',
            success: true,
            data: { entry }
        });

    } catch (error) {
        console.error('Get knowledge base entry by ID error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update knowledge base entry
const updateKnowledgeBaseEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const user = req.user;

        const entry = await KnowledgeBaseModel.findById(id);
        if (!entry) {
            return res.status(404).json({
                message: 'Knowledge base entry not found',
                success: false
            });
        }

        // Check department access
        if (user.role === 'department_user' && entry.department !== user.department) {
            return res.status(403).json({
                message: 'Access denied: You can only modify knowledge base entries from your department',
                success: false
            });
        }

        // If content is being updated, regenerate embeddings
        if (updateData.content && updateData.content !== entry.content) {
            updateData.embeddings = await generateEmbeddings(updateData.content);
        }

        updateData.updatedBy = user._id;

        // Update entry
        const updatedEntry = await KnowledgeBaseModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )
            .populate('documentId', 'title description department status')
            .populate('createdBy', 'name email')
            .populate('updatedBy', 'name email');

        res.status(200).json({
            message: 'Knowledge base entry updated successfully',
            success: true,
            data: { entry: updatedEntry }
        });

    } catch (error) {
        console.error('Update knowledge base entry error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Delete knowledge base entry
const deleteKnowledgeBaseEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const entry = await KnowledgeBaseModel.findById(id);
        if (!entry) {
            return res.status(404).json({
                message: 'Knowledge base entry not found',
                success: false
            });
        }

        // Check department access
        if (user.role === 'department_user' && entry.department !== user.department) {
            return res.status(403).json({
                message: 'Access denied: You can only delete knowledge base entries from your department',
                success: false
            });
        }

        // Soft delete
        entry.isActive = false;
        await entry.save();

        res.status(200).json({
            message: 'Knowledge base entry deleted successfully',
            success: true
        });

    } catch (error) {
        console.error('Delete knowledge base entry error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get knowledge base statistics
const getKnowledgeBaseStats = async (req, res) => {
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
            totalEntries,
            entriesByCategory,
            entriesByDepartment,
            topSearched,
            recentEntries
        ] = await Promise.all([
            // Total entries
            KnowledgeBaseModel.countDocuments(filter),

            // Entries by category
            KnowledgeBaseModel.aggregate([
                { $match: filter },
                {
                    $group: {
                        _id: '$category',
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Entries by department (admin only)
            user.role === 'admin' ? KnowledgeBaseModel.aggregate([
                { $match: { isActive: true } },
                {
                    $group: {
                        _id: '$department',
                        count: { $sum: 1 }
                    }
                }
            ]) : [],

            // Top searched entries
            KnowledgeBaseModel.find(filter)
                .sort({ searchCount: -1 })
                .limit(10)
                .select('title category searchCount')
                .populate('documentId', 'title department'),

            // Recent entries
            KnowledgeBaseModel.find(filter)
                .sort({ createdAt: -1 })
                .limit(10)
                .select('title category createdAt')
                .populate('documentId', 'title department')
                .populate('createdBy', 'name')
        ]);

        res.status(200).json({
            message: 'Knowledge base statistics retrieved successfully',
            success: true,
            data: {
                totalEntries,
                entriesByCategory,
                entriesByDepartment: user.role === 'admin' ? entriesByDepartment : undefined,
                topSearched,
                recentEntries
            }
        });

    } catch (error) {
        console.error('Get knowledge base stats error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    indexDocument,
    semanticSearch,
    textSearch,
    getKnowledgeBaseEntries,
    getKnowledgeBaseEntryById,
    updateKnowledgeBaseEntry,
    deleteKnowledgeBaseEntry,
    getKnowledgeBaseStats
};
