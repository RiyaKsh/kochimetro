const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ComplianceSchema = new Schema({
    documentId: {
        type: Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'On Track', 'Overdue', 'Resolved'],
        default: 'Pending',
        required: true
    },
    reminders: {
        type: Boolean,
        default: true
    },
    reminderSent: {
        type: Boolean,
        default: false
    },
    lastReminderSent: {
        type: Date,
        default: null
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    complianceType: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    resolutionNotes: {
        type: String,
        trim: true,
        maxlength: 1000
    },
    resolvedAt: {
        type: Date,
        default: null
    },
    resolvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes for better query performance
ComplianceSchema.index({ documentId: 1 });
ComplianceSchema.index({ status: 1 });
ComplianceSchema.index({ assignedTo: 1 });
ComplianceSchema.index({ dueDate: 1 });
ComplianceSchema.index({ priority: 1 });
ComplianceSchema.index({ createdAt: -1 });

// Virtual for days until due
ComplianceSchema.virtual('daysUntilDue').get(function() {
    const today = new Date();
    const due = new Date(this.dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
});

// Virtual for is overdue
ComplianceSchema.virtual('isOverdue').get(function() {
    return this.dueDate < new Date() && this.status !== 'Resolved';
});

// Method to update status
ComplianceSchema.methods.updateStatus = function(newStatus, resolvedBy = null, resolutionNotes = '') {
    this.status = newStatus;
    
    if (newStatus === 'Resolved') {
        this.resolvedAt = new Date();
        this.resolvedBy = resolvedBy;
        this.resolutionNotes = resolutionNotes;
    }
    
    return this.save();
};

// Method to send reminder
ComplianceSchema.methods.markReminderSent = function() {
    this.reminderSent = true;
    this.lastReminderSent = new Date();
    return this.save();
};

// Static method to find overdue items
ComplianceSchema.statics.findOverdue = function() {
    return this.find({
        dueDate: { $lt: new Date() },
        status: { $nin: ['Resolved'] },
        isActive: true
    });
};

// Static method to find due soon items (within 7 days)
ComplianceSchema.statics.findDueSoon = function() {
    const today = new Date();
    const sevenDaysFromNow = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
    
    return this.find({
        dueDate: { $gte: today, $lte: sevenDaysFromNow },
        status: { $nin: ['Resolved'] },
        isActive: true
    });
};

const ComplianceModel = mongoose.model('Compliance', ComplianceSchema);
module.exports = ComplianceModel;
