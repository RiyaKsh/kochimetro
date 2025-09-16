const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const KnowledgeBaseSchema = new Schema({
    documentId: {
        type: Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    summary: {
        type: String,
        trim: true,
        maxlength: 500
    },
    embeddings: {
        type: [Number],
        required: true
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: 50
    }],
    keywords: [{
        type: String,
        trim: true,
        maxlength: 50
    }],
    category: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    department: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    language: {
        type: String,
        default: 'en',
        maxlength: 10
    },
    isActive: {
        type: Boolean,
        default: true
    },
    searchCount: {
        type: Number,
        default: 0
    },
    lastAccessed: {
        type: Date,
        default: null
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true
});

// Indexes for better query performance
KnowledgeBaseSchema.index({ documentId: 1 });
KnowledgeBaseSchema.index({ category: 1 });
KnowledgeBaseSchema.index({ department: 1 });
KnowledgeBaseSchema.index({ tags: 1 });
KnowledgeBaseSchema.index({ keywords: 1 });
KnowledgeBaseSchema.index({ isActive: 1 });
KnowledgeBaseSchema.index({ title: 'text', content: 'text', summary: 'text' });

// Index for vector similarity search (if using MongoDB Atlas Vector Search)
KnowledgeBaseSchema.index({ 
    embeddings: '2dsphere' 
});

// Method to update search count
KnowledgeBaseSchema.methods.incrementSearchCount = function() {
    this.searchCount += 1;
    this.lastAccessed = new Date();
    return this.save();
};

// Method to calculate similarity with another embedding
KnowledgeBaseSchema.methods.calculateSimilarity = function(otherEmbedding) {
    if (!this.embeddings || !otherEmbedding || this.embeddings.length !== otherEmbedding.length) {
        return 0;
    }
    
    // Calculate cosine similarity
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < this.embeddings.length; i++) {
        dotProduct += this.embeddings[i] * otherEmbedding[i];
        normA += this.embeddings[i] * this.embeddings[i];
        normB += otherEmbedding[i] * otherEmbedding[i];
    }
    
    if (normA === 0 || normB === 0) {
        return 0;
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// Static method to find similar documents
KnowledgeBaseSchema.statics.findSimilar = async function(queryEmbedding, limit = 10, threshold = 0.7) {
    const documents = await this.find({ isActive: true });
    
    const similarities = documents.map(doc => ({
        document: doc,
        similarity: doc.calculateSimilarity(queryEmbedding)
    }));
    
    return similarities
        .filter(item => item.similarity >= threshold)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit)
        .map(item => item.document);
};

// Static method to search by text
KnowledgeBaseSchema.statics.searchByText = function(query, options = {}) {
    const {
        department = null,
        category = null,
        tags = [],
        limit = 20,
        skip = 0
    } = options;
    
    const searchQuery = {
        isActive: true,
        $text: { $search: query }
    };
    
    if (department) {
        searchQuery.department = department;
    }
    
    if (category) {
        searchQuery.category = category;
    }
    
    if (tags.length > 0) {
        searchQuery.tags = { $in: tags };
    }
    
    return this.find(searchQuery)
        .sort({ score: { $meta: 'textScore' } })
        .limit(limit)
        .skip(skip)
        .populate('documentId', 'title status department');
};

const KnowledgeBaseModel = mongoose.model('KnowledgeBase', KnowledgeBaseSchema);
module.exports = KnowledgeBaseModel;
