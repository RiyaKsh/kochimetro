const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VersionSchema = new Schema({
    fileUrl: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    versionNumber: {
        type: Number,
        required: true
    },
    changeDescription: {
        type: String,
        trim: true,
        maxlength: 500
    }
});

const DocumentSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    department: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    status: {
        type: String,
        enum: ['Draft', 'Pending Review', 'Under Review', 'Approved', 'Rejected'],
        default: 'Pending Review',
        required: true
    },
    versions: [VersionSchema],
    currentVersion: {
        type: Number,
        default: 1
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    reviewedAt: {
        type: Date,
        default: null
    },
    reviewComments: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: 50
    }],
    isArchived: {
        type: Boolean,
        default: false
    },
    archiveReason: {
        type: String,
        trim: true,
        maxlength: 500
    },
    category: { 
        type: String 
    },
    priority: { 
        type: String, 
        enum: ['Low', 'Medium', 'High'], 
        default: 'Medium' 
    },
    language: { 
        type: String 
    },
    access: {
        type: String,
        enum: ['self', 'department', 'cross-department'], // type of access
        default: 'self'
    },
    allowedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }], // explicit users
    allowedDepartments: [{ type: String }], // departments allowed
}, {
    timestamps: true
});

// Indexes for better query performance
DocumentSchema.index({ department: 1 });
DocumentSchema.index({ status: 1 });
DocumentSchema.index({ uploadedBy: 1 });
DocumentSchema.index({ createdAt: -1 });
DocumentSchema.index({ title: 'text', description: 'text' });

// Virtual for getting the latest version
DocumentSchema.virtual('latestVersion').get(function() {
    return this.versions[this.versions.length - 1];
});

// Method to add a new version
DocumentSchema.methods.addVersion = function(fileUrl, uploadedBy, changeDescription = '') {
    const newVersion = {
        fileUrl,
        uploadedBy,
        versionNumber: this.currentVersion + 1,
        changeDescription,
        uploadedAt: new Date()
    };
    
    this.versions.push(newVersion);
    this.currentVersion = newVersion.versionNumber;
    return this.save();
};

// Method to update status
DocumentSchema.methods.updateStatus = function(newStatus, reviewedBy, reviewComments = '') {
    this.status = newStatus;
    this.reviewedBy = reviewedBy;
    this.reviewedAt = new Date();
    this.reviewComments = reviewComments;
    return this.save();
};

const DocumentModel = mongoose.model('Document', DocumentSchema);
module.exports = DocumentModel;
