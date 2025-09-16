 const bcrypt = require('bcrypt');
 const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    // ✅ check if user already exists (by email)
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: 'User already exists, please login',
        success: false
      });
    }

    // ✅ check if an admin already exists for this department
    const existingAdmin = await UserModel.findOne({ department, role: 'admin' });
    if (existingAdmin) {
      return res.status(409).json({
        message: `An admin already exists for the ${department} department`,
        success: false
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // create new admin
    const newAdmin = new UserModel({
      name,
      email,
      password: hashedPassword,
      department,
      role: 'admin'   // force role = admin, no input needed
    });

    await newAdmin.save();

    // generate JWT token
    const token = jwt.sign(
      {
        _id: newAdmin._id,
        email: newAdmin.email,
        role: newAdmin.role,
        department: newAdmin.department
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: "Admin registered successfully",
      success: true,
      data: {
        user: {
          _id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
          department: newAdmin.department
        },
        token,
        redirectTo:
          (process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : '') +
          '/dashboard'
      }
    });

  } catch (error) {
    console.error('Registration error:', error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Email already exists',
        success: false
      });
    }

    res.status(500).json({
      message: "Internal server error",
      success: false,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await UserModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ 
                message: 'Invalid email or password', 
                success: false 
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({ 
                message: 'Account is deactivated. Please contact administrator.', 
                success: false 
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                message: 'Invalid email or password', 
                success: false 
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { 
                _id: user._id, 
                email: user.email,
                role: user.role,
                department: user.department
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login successful",
            success: true,
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    department: user.department,
                    lastLogin: user.lastLogin
                },
                token,
                // frontend iss URL par redirect kare after successful login
                redirectTo: (process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : '') + '/dashboard'
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get current user profile
const getProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user._id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        res.status(200).json({
            message: "Profile retrieved successfully",
                success: true,
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    department: user.department,
                    isActive: user.isActive,
                    lastLogin: user.lastLogin,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                }
            }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const { name, department } = req.body;
        const userId = req.user._id;

        const updateData = {};
        if (name) updateData.name = name;
        if (department) updateData.department = department;

        const user = await UserModel.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            data: {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    department: user.department,
                    isActive: user.isActive,
                    lastLogin: user.lastLogin,
                    updatedAt: user.updatedAt
                }
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Change password
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        const user = await UserModel.findById(userId).select('+password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
                success: false
            });
        }

        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                message: 'Current password is incorrect',
                success: false
            });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);
        
        // Update password
        user.password = hashedNewPassword;
        await user.save();

        res.status(200).json({
            message: "Password changed successfully",
            success: true
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Logout (client-side token removal, but we can track it)
const logout = async (req, res) => {
    try {
        res.status(200).json({
            message: "Logged out successfully",
            success: true
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    logout
};