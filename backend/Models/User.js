const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'department_user'],
        default: 'department_user',
        required: true
    },
    department: {
        type: String,
        required: function () {
            return this.role === 'department_user';
        },
        trim: true,
        maxlength: 100
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});


// Index for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ department: 1 });
UserSchema.index({ role: 1 });

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;