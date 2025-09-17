// controllers/userController.js
const User = require('../Models/User'); 
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Document = require('../Models/Document');
const nodemailer = require('nodemailer'); 

// Invite a new employee (Admin only)


const inviteEmployee = async (req, res) => {
  try {
    const admin = req.user; // admin info from middleware

    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can invite employees' });
    }

    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Generate random password
    const rawPassword = crypto.randomBytes(8).toString('hex');
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // Create new employee
    const employee = new User({
      name,
      email,
      password: hashedPassword,
      role: 'department_user',
      department: admin.department, // employee inherits admin's department
    });

    await employee.save();

    // --- SMTP Email Sending ---
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,     
        pass: process.env.GMAIL_PASS,     
      },
    });

    const mailOptions = {
      from: 'yournewgmail@gmail.com',
      to: email,
      subject: 'Your Temporary Password',
      text: `Hello ${name},\n\nYou have been invited to the system.\n\nYour temporary password is: ${rawPassword}\n\nPlease log in and change your password immediately.\n\nRegards,\nAdmin Team`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: 'Employee invited successfully. Password sent via email.',
      success: true,
      data: {
        userId: employee._id,
        // rawPassword: rawPassword, // optional: you can remove if you don’t want to return it
      }
    });

  } catch (error) {
    console.error("InviteEmployee Error:", error);
    res.status(500).json({ message: 'Internal server error', success: false });
  }
};


const assignUsersToDocument = async (req, res) => {
  try {
    const { id: documentId } = req.params;
    const { userIds } = req.body;
    const admin = req.user; // comes from ensureAuthenticated middleware

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        message: "No users provided",
        success: false
      });
    }

    // Find the document
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({
        message: "Document not found",
        success: false
      });
    }

    // Check that this admin actually owns the document
    if (document.department !== admin.department) {
      return res.status(403).json({
        message: "You can only assign users within your own department’s documents",
        success: false
      });
    }

    // Fetch all users being assigned
    const users = await User.find({ _id: { $in: userIds } });

    // Filter out users not in the same department
    const invalidUsers = users.filter(u => u.department !== admin.department);

    if (invalidUsers.length > 0) {
      return res.status(400).json({
        message: "Some users do not belong to your department",
        invalidUsers: invalidUsers.map(u => ({ id: u._id, name: u.name, dept: u.department })),
        success: false
      });
    }

    // Assign users
    const updatedDoc = await Document.findByIdAndUpdate(
      documentId,
      { $addToSet: { allowedUsers: { $each: userIds } } },
      { new: true }
    ).populate("allowedUsers", "name email department");

    res.status(200).json({
      message: "Users assigned successfully",
      success: true,
      data: updatedDoc
    });
  } catch (error) {
    console.error("Assign Users Error:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message
    });
  }
};


// Get all employees under the admin's department
const getDepartmentEmployees = async (req, res) => {
  try {
    const admin = req.user; // admin info from middleware

    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can view department employees', success: false });
    }

    // Fetch employees in the same department
    const employees = await User.find({
      department: admin.department,
      role: 'department_user',
      isActive: true
    }).select('name email lastLogin createdAt'); // only return these fields

    res.status(200).json({
      message: 'Department employees retrieved successfully',
      success: true,
      data: employees
    });
  } catch (error) {
    console.error('Error fetching department employees:', error);
    res.status(500).json({
      message: 'Internal server error',
      success: false,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


module.exports = {
  inviteEmployee,
  getDepartmentEmployees,
  assignUsersToDocument
};
