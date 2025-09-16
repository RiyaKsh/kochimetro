require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

// Ensure we resolve from project root
const db = require('../Models/db');
const User = require('../Models/User');

async function listUsers() {
  try {
    // Wait for mongoose connection
    // If Models/db already initiated connection, mongoose.connection.readyState should be 1
    if (mongoose.connection.readyState !== 1) {
      const mongo_url = process.env.MONGO_CONN || 'mongodb://localhost:27017/compliance-management';
      await mongoose.connect(mongo_url);
    }

    const users = await User.find().select('name email role department isActive createdAt').lean();
    console.log(`Found ${users.length} users:`);
    users.forEach(u => console.log(`${u._id} | ${u.email} | ${u.name} | ${u.role} | ${u.department} | active:${u.isActive} | created:${u.createdAt}`));

    process.exit(0);
  } catch (err) {
    console.error('Error listing users:', err);
    process.exit(1);
  }
}

listUsers();
