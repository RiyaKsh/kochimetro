const nodemailer = require('nodemailer');
const moment = require('moment');

// Create email transporter
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

// Email templates
const emailTemplates = {
    complianceReminder: (data) => ({
        subject: `Compliance Reminder: ${data.complianceType} - Due ${moment(data.dueDate).format('MMM DD, YYYY')}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2c3e50;">Compliance Reminder</h2>
                <p>Hello ${data.assignedToName},</p>
                <p>This is a reminder that you have a compliance task that is due soon:</p>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #495057; margin-top: 0;">Task Details</h3>
                    <p><strong>Type:</strong> ${data.complianceType}</p>
                    <p><strong>Description:</strong> ${data.description}</p>
                    <p><strong>Due Date:</strong> ${moment(data.dueDate).format('MMMM DD, YYYY')}</p>
                    <p><strong>Priority:</strong> <span style="color: ${data.priority === 'High' || data.priority === 'Critical' ? '#dc3545' : '#28a745'}">${data.priority}</span></p>
                    <p><strong>Document:</strong> ${data.documentTitle}</p>
                </div>
                
                <p>Please review and complete this task before the due date.</p>
                <p>You can access the compliance system at: <a href="${process.env.FRONTEND_URL}/compliance">${process.env.FRONTEND_URL}/compliance</a></p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
                <p style="color: #6c757d; font-size: 14px;">
                    This is an automated reminder from the Compliance Management System.
                </p>
            </div>
        `
    }),

    overdueCompliance: (data) => ({
        subject: `URGENT: Overdue Compliance Task - ${data.complianceType}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc3545;">Overdue Compliance Task</h2>
                <p>Hello ${data.assignedToName},</p>
                <p><strong style="color: #dc3545;">This compliance task is now overdue and requires immediate attention:</strong></p>
                
                <div style="background-color: #f8d7da; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
                    <h3 style="color: #721c24; margin-top: 0;">Task Details</h3>
                    <p><strong>Type:</strong> ${data.complianceType}</p>
                    <p><strong>Description:</strong> ${data.description}</p>
                    <p><strong>Due Date:</strong> <span style="color: #dc3545;">${moment(data.dueDate).format('MMMM DD, YYYY')}</span></p>
                    <p><strong>Days Overdue:</strong> <span style="color: #dc3545;">${moment().diff(moment(data.dueDate), 'days')} days</span></p>
                    <p><strong>Priority:</strong> <span style="color: #dc3545;">${data.priority}</span></p>
                    <p><strong>Document:</strong> ${data.documentTitle}</p>
                </div>
                
                <p><strong>Please complete this task immediately to avoid further delays.</strong></p>
                <p>You can access the compliance system at: <a href="${process.env.FRONTEND_URL}/compliance">${process.env.FRONTEND_URL}/compliance</a></p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
                <p style="color: #6c757d; font-size: 14px;">
                    This is an automated reminder from the Compliance Management System.
                </p>
            </div>
        `
    }),

    documentApproved: (data) => ({
        subject: `Document Approved: ${data.documentTitle}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #28a745;">Document Approved</h2>
                <p>Hello ${data.uploadedByName},</p>
                <p>Great news! Your document has been approved:</p>
                
                <div style="background-color: #d4edda; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
                    <h3 style="color: #155724; margin-top: 0;">Document Details</h3>
                    <p><strong>Title:</strong> ${data.documentTitle}</p>
                    <p><strong>Description:</strong> ${data.documentDescription}</p>
                    <p><strong>Department:</strong> ${data.department}</p>
                    <p><strong>Approved By:</strong> ${data.reviewedByName}</p>
                    <p><strong>Approved On:</strong> ${moment(data.reviewedAt).format('MMMM DD, YYYY at h:mm A')}</p>
                </div>
                
                <p>You can view the document at: <a href="${process.env.FRONTEND_URL}/documents/${data.documentId}">${process.env.FRONTEND_URL}/documents/${data.documentId}</a></p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
                <p style="color: #6c757d; font-size: 14px;">
                    This is an automated notification from the Compliance Management System.
                </p>
            </div>
        `
    }),

    documentRejected: (data) => ({
        subject: `Document Rejected: ${data.documentTitle}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc3545;">Document Rejected</h2>
                <p>Hello ${data.uploadedByName},</p>
                <p>Your document has been rejected and requires revision:</p>
                
                <div style="background-color: #f8d7da; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
                    <h3 style="color: #721c24; margin-top: 0;">Document Details</h3>
                    <p><strong>Title:</strong> ${data.documentTitle}</p>
                    <p><strong>Description:</strong> ${data.documentDescription}</p>
                    <p><strong>Department:</strong> ${data.department}</p>
                    <p><strong>Rejected By:</strong> ${data.reviewedByName}</p>
                    <p><strong>Rejected On:</strong> ${moment(data.reviewedAt).format('MMMM DD, YYYY at h:mm A')}</p>
                    <p><strong>Reason:</strong> ${data.reviewComments || 'No specific reason provided'}</p>
                </div>
                
                <p>Please review the feedback and resubmit your document with the necessary changes.</p>
                <p>You can access the document at: <a href="${process.env.FRONTEND_URL}/documents/${data.documentId}">${process.env.FRONTEND_URL}/documents/${data.documentId}</a></p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
                <p style="color: #6c757d; font-size: 14px;">
                    This is an automated notification from the Compliance Management System.
                </p>
            </div>
        `
    }),

    welcomeEmail: (data) => ({
        subject: `Welcome to Compliance Management System`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2c3e50;">Welcome to the Compliance Management System</h2>
                <p>Hello ${data.name},</p>
                <p>Welcome to the Compliance Management System! Your account has been successfully created.</p>
                
                <div style="background-color: #e3f2fd; padding: 20px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="color: #1976d2; margin-top: 0;">Account Details</h3>
                    <p><strong>Name:</strong> ${data.name}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Role:</strong> ${data.role === 'admin' ? 'Administrator' : 'Department User'}</p>
                    <p><strong>Department:</strong> ${data.department}</p>
                </div>
                
                <p>You can now access the system at: <a href="${process.env.FRONTEND_URL}">${process.env.FRONTEND_URL}</a></p>
                
                <p>If you have any questions or need assistance, please contact your system administrator.</p>
                
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
                <p style="color: #6c757d; font-size: 14px;">
                    This is an automated welcome email from the Compliance Management System.
                </p>
            </div>
        `
    })
};

// Send email function
const sendEmail = async (to, templateName, data) => {
    try {
        const transporter = createTransporter();
        const template = emailTemplates[templateName];
        
        if (!template) {
            throw new Error(`Email template '${templateName}' not found`);
        }

        const emailContent = template(data);

        const mailOptions = {
            from: `"Compliance Management System" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to: to,
            subject: emailContent.subject,
            html: emailContent.html
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}:`, result.messageId);
        return { success: true, messageId: result.messageId };

    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
};

// Send compliance reminder
const sendComplianceReminder = async (complianceTask) => {
    try {
        const data = {
            assignedToName: complianceTask.assignedTo.name,
            complianceType: complianceTask.complianceType,
            description: complianceTask.description,
            dueDate: complianceTask.dueDate,
            priority: complianceTask.priority,
            documentTitle: complianceTask.documentId.title
        };

        const result = await sendEmail(
            complianceTask.assignedTo.email,
            'complianceReminder',
            data
        );

        if (result.success) {
            // Mark reminder as sent
            await complianceTask.markReminderSent();
        }

        return result;

    } catch (error) {
        console.error('Error sending compliance reminder:', error);
        return { success: false, error: error.message };
    }
};

// Send overdue compliance notification
const sendOverdueComplianceNotification = async (complianceTask) => {
    try {
        const data = {
            assignedToName: complianceTask.assignedTo.name,
            complianceType: complianceTask.complianceType,
            description: complianceTask.description,
            dueDate: complianceTask.dueDate,
            priority: complianceTask.priority,
            documentTitle: complianceTask.documentId.title
        };

        return await sendEmail(
            complianceTask.assignedTo.email,
            'overdueCompliance',
            data
        );

    } catch (error) {
        console.error('Error sending overdue compliance notification:', error);
        return { success: false, error: error.message };
    }
};

// Send document approval notification
const sendDocumentApprovalNotification = async (document, reviewedBy) => {
    try {
        const data = {
            uploadedByName: document.uploadedBy.name,
            documentTitle: document.title,
            documentDescription: document.description,
            department: document.department,
            reviewedByName: reviewedBy.name,
            reviewedAt: document.reviewedAt,
            documentId: document._id
        };

        return await sendEmail(
            document.uploadedBy.email,
            'documentApproved',
            data
        );

    } catch (error) {
        console.error('Error sending document approval notification:', error);
        return { success: false, error: error.message };
    }
};

// Send document rejection notification
const sendDocumentRejectionNotification = async (document, reviewedBy) => {
    try {
        const data = {
            uploadedByName: document.uploadedBy.name,
            documentTitle: document.title,
            documentDescription: document.description,
            department: document.department,
            reviewedByName: reviewedBy.name,
            reviewedAt: document.reviewedAt,
            reviewComments: document.reviewComments,
            documentId: document._id
        };

        return await sendEmail(
            document.uploadedBy.email,
            'documentRejected',
            data
        );

    } catch (error) {
        console.error('Error sending document rejection notification:', error);
        return { success: false, error: error.message };
    }
};

// Send welcome email
const sendWelcomeEmail = async (user) => {
    try {
        const data = {
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department
        };

        return await sendEmail(
            user.email,
            'welcomeEmail',
            data
        );

    } catch (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error: error.message };
    }
};

// Bulk send emails
const sendBulkEmails = async (recipients, templateName, data) => {
    try {
        const results = [];
        
        for (const recipient of recipients) {
            const result = await sendEmail(recipient.email, templateName, {
                ...data,
                name: recipient.name
            });
            results.push({ recipient: recipient.email, ...result });
        }

        return results;

    } catch (error) {
        console.error('Error sending bulk emails:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendEmail,
    sendComplianceReminder,
    sendOverdueComplianceNotification,
    sendDocumentApprovalNotification,
    sendDocumentRejectionNotification,
    sendWelcomeEmail,
    sendBulkEmails
};
