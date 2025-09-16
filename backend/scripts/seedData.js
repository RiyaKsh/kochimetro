const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const moment = require('moment');
require('dotenv').config();

// Import models
const UserModel = require('../Models/User');
const DocumentModel = require('../Models/Document');
const ComplianceModel = require('../Models/Compliance');
const KnowledgeBaseModel = require('../Models/KnowledgeBase');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CONN);
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Sample data
const departments = [
    'Human Resources',
    'Finance',
    'Operations',
    'IT',
    'Legal',
    'Marketing',
    'Sales',
    'Customer Service'
];

const complianceTypes = [
    'Document Review',
    'Policy Compliance',
    'Safety Inspection',
    'Financial Audit',
    'Security Assessment',
    'Quality Assurance',
    'Regulatory Compliance',
    'Training Completion'
];

const documentTitles = [
    'Employee Handbook 2024',
    'Safety Procedures Manual',
    'Financial Policy Guidelines',
    'IT Security Protocols',
    'Customer Service Standards',
    'Quality Control Procedures',
    'Emergency Response Plan',
    'Data Protection Policy',
    'Vendor Management Guidelines',
    'Risk Assessment Report'
];

const documentDescriptions = [
    'Comprehensive guide for employee policies and procedures',
    'Detailed safety protocols for workplace operations',
    'Financial guidelines and compliance requirements',
    'Information technology security standards and procedures',
    'Customer service best practices and standards',
    'Quality control measures and inspection procedures',
    'Emergency response and crisis management plan',
    'Data protection and privacy compliance guidelines',
    'Vendor selection and management procedures',
    'Risk assessment and mitigation strategies'
];

// Create sample users
const createUsers = async () => {
    console.log('👥 Creating sample users...');
    
    const users = [];
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12);
    const admin = new UserModel({
        name: 'System Administrator',
        email: 'admin@company.com',
        password: adminPassword,
        role: 'admin',
        department: 'IT',
        isActive: true
    });
    users.push(admin);
    
    // Create department users
    for (let i = 0; i < departments.length; i++) {
        const dept = departments[i];
        const userPassword = await bcrypt.hash('user123', 12);
        
        const user = new UserModel({
            name: `${dept} Manager`,
            email: `${dept.toLowerCase().replace(/\s+/g, '.')}@company.com`,
            password: userPassword,
            role: 'department_user',
            department: dept,
            isActive: true
        });
        users.push(user);
        
        // Create additional users for each department
        for (let j = 1; j <= 2; j++) {
            const additionalUser = new UserModel({
                name: `${dept} User ${j}`,
                email: `${dept.toLowerCase().replace(/\s+/g, '.')}.user${j}@company.com`,
                password: userPassword,
                role: 'department_user',
                department: dept,
                isActive: true
            });
            users.push(additionalUser);
        }
    }
    
    // Clear existing users and insert new ones
    await UserModel.deleteMany({});
    const createdUsers = await UserModel.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);
    
    return createdUsers;
};

// Create sample documents
const createDocuments = async (users) => {
    console.log('📄 Creating sample documents...');
    
    const documents = [];
    const admin = users.find(u => u.role === 'admin');
    
    for (let i = 0; i < documentTitles.length; i++) {
        const dept = departments[i % departments.length];
        const deptUsers = users.filter(u => u.department === dept);
        const uploadedBy = deptUsers[Math.floor(Math.random() * deptUsers.length)];
        
        const statuses = ['Draft', 'Pending Review', 'Under Review', 'Approved', 'Rejected'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        const document = new DocumentModel({
            title: documentTitles[i],
            description: documentDescriptions[i],
            department: dept,
            status: status,
            uploadedBy: uploadedBy._id,
            tags: [`${dept.toLowerCase()}`, 'policy', 'compliance'],
            versions: [{
                fileUrl: `/uploads/sample-document-${i + 1}.pdf`,
                uploadedBy: uploadedBy._id,
                versionNumber: 1,
                uploadedAt: moment().subtract(Math.floor(Math.random() * 30), 'days').toDate(),
                changeDescription: 'Initial version'
            }],
            currentVersion: 1
        });
        
        // Add review data if approved or rejected
        if (status === 'Approved' || status === 'Rejected') {
            document.reviewedBy = admin._id;
            document.reviewedAt = moment().subtract(Math.floor(Math.random() * 15), 'days').toDate();
            document.reviewComments = status === 'Approved' 
                ? 'Document meets all requirements and is approved for use.'
                : 'Document requires revisions before approval.';
        }
        
        documents.push(document);
    }
    
    // Clear existing documents and insert new ones
    await DocumentModel.deleteMany({});
    const createdDocuments = await DocumentModel.insertMany(documents);
    console.log(`✅ Created ${createdDocuments.length} documents`);
    
    return createdDocuments;
};

// Create sample compliance tasks
const createComplianceTasks = async (users, documents) => {
    console.log('📋 Creating sample compliance tasks...');
    
    const complianceTasks = [];
    
    for (let i = 0; i < documents.length; i++) {
        const document = documents[i];
        const deptUsers = users.filter(u => u.department === document.department);
        const assignedTo = deptUsers[Math.floor(Math.random() * deptUsers.length)];
        
        const dueDate = moment().add(Math.floor(Math.random() * 60) + 1, 'days').toDate();
        const statuses = ['Pending', 'On Track', 'Overdue', 'Resolved'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        const priorities = ['Low', 'Medium', 'High', 'Critical'];
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        
        const complianceType = complianceTypes[Math.floor(Math.random() * complianceTypes.length)];
        
        const complianceTask = new ComplianceModel({
            documentId: document._id,
            dueDate: dueDate,
            status: status,
            priority: priority,
            complianceType: complianceType,
            description: `Review and ensure compliance with ${document.title}`,
            assignedTo: assignedTo._id,
            department: document.department,
            reminders: true
        });
        
        // Add resolution data if resolved
        if (status === 'Resolved') {
            complianceTask.resolvedAt = moment().subtract(Math.floor(Math.random() * 10), 'days').toDate();
            complianceTask.resolvedBy = assignedTo._id;
            complianceTask.resolutionNotes = 'Compliance task completed successfully.';
        }
        
        complianceTasks.push(complianceTask);
    }
    
    // Create additional compliance tasks
    for (let i = 0; i < 20; i++) {
        const dept = departments[Math.floor(Math.random() * departments.length)];
        const deptUsers = users.filter(u => u.department === dept);
        const assignedTo = deptUsers[Math.floor(Math.random() * deptUsers.length)];
        
        const dueDate = moment().add(Math.floor(Math.random() * 90) + 1, 'days').toDate();
        const statuses = ['Pending', 'On Track', 'Overdue', 'Resolved'];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        const priorities = ['Low', 'Medium', 'High', 'Critical'];
        const priority = priorities[Math.floor(Math.random() * priorities.length)];
        
        const complianceType = complianceTypes[Math.floor(Math.random() * complianceTypes.length)];
        
        const complianceTask = new ComplianceModel({
            documentId: documents[Math.floor(Math.random() * documents.length)]._id,
            dueDate: dueDate,
            status: status,
            priority: priority,
            complianceType: complianceType,
            description: `Regular compliance check for ${complianceType.toLowerCase()}`,
            assignedTo: assignedTo._id,
            department: dept,
            reminders: true
        });
        
        // Add resolution data if resolved
        if (status === 'Resolved') {
            complianceTask.resolvedAt = moment().subtract(Math.floor(Math.random() * 15), 'days').toDate();
            complianceTask.resolvedBy = assignedTo._id;
            complianceTask.resolutionNotes = 'Compliance task completed successfully.';
        }
        
        complianceTasks.push(complianceTask);
    }
    
    // Clear existing compliance tasks and insert new ones
    await ComplianceModel.deleteMany({});
    const createdComplianceTasks = await ComplianceModel.insertMany(complianceTasks);
    console.log(`✅ Created ${createdComplianceTasks.length} compliance tasks`);
    
    return createdComplianceTasks;
};

// Create sample knowledge base entries
const createKnowledgeBaseEntries = async (users, documents) => {
    console.log('🧠 Creating sample knowledge base entries...');
    
    const knowledgeBaseEntries = [];
    
    for (let i = 0; i < documents.length; i++) {
        const document = documents[i];
        const deptUsers = users.filter(u => u.department === document.department);
        const createdBy = deptUsers[Math.floor(Math.random() * deptUsers.length)];
        
        const categories = ['Policy', 'Procedure', 'Guideline', 'Standard', 'Template', 'Reference'];
        const category = categories[Math.floor(Math.random() * categories.length)];
        
        // Generate sample embeddings (in real implementation, these would come from OpenAI)
        const embeddings = Array.from({ length: 1536 }, () => Math.random() * 2 - 1);
        
        const knowledgeBaseEntry = new KnowledgeBaseModel({
            documentId: document._id,
            title: document.title,
            content: `${document.description}. This document contains detailed information about ${document.title.toLowerCase()} and provides comprehensive guidelines for implementation and compliance.`,
            summary: `Summary of ${document.title}: ${document.description}`,
            embeddings: embeddings,
            category: category,
            department: document.department,
            tags: document.tags,
            keywords: [document.title.toLowerCase(), category.toLowerCase(), document.department.toLowerCase()],
            language: 'en',
            createdBy: createdBy._id,
            searchCount: Math.floor(Math.random() * 50)
        });
        
        knowledgeBaseEntries.push(knowledgeBaseEntry);
    }
    
    // Clear existing knowledge base entries and insert new ones
    await KnowledgeBaseModel.deleteMany({});
    const createdKnowledgeBaseEntries = await KnowledgeBaseModel.insertMany(knowledgeBaseEntries);
    console.log(`✅ Created ${createdKnowledgeBaseEntries.length} knowledge base entries`);
    
    return createdKnowledgeBaseEntries;
};

// Main seed function
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');
        
        await connectDB();
        
        // Create sample data
        const users = await createUsers();
        const documents = await createDocuments(users);
        const complianceTasks = await createComplianceTasks(users, documents);
        const knowledgeBaseEntries = await createKnowledgeBaseEntries(users, documents);
        
        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   👥 Users: ${users.length}`);
        console.log(`   📄 Documents: ${documents.length}`);
        console.log(`   📋 Compliance Tasks: ${complianceTasks.length}`);
        console.log(`   🧠 Knowledge Base Entries: ${knowledgeBaseEntries.length}`);
        
        console.log('\n🔑 Test Credentials:');
        console.log('   Admin: admin@company.com / admin123');
        console.log('   Department Users: [department].@company.com / user123');
        console.log('   Example: hr@company.com / user123');
        
        console.log('\n🚀 You can now start the server with: npm run dev');
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run seed function
seedDatabase();
