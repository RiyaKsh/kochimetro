const ComplianceModel = require('../Models/Compliance');
const { sendComplianceReminder, sendOverdueComplianceNotification } = require('./EmailService');
const moment = require('moment');

// Send reminders for compliance tasks due soon
const sendDueSoonReminders = async () => {
    try {
        console.log('🔔 Checking for compliance tasks due soon...');
        
        // Find tasks due in the next 7 days that haven't been reminded
        const dueSoonTasks = await ComplianceModel.findDueSoon()
            .populate('assignedTo', 'name email')
            .populate('documentId', 'title department');

        let reminderCount = 0;
        
        for (const task of dueSoonTasks) {
            // Check if reminder was already sent recently (within 3 days)
            const lastReminder = task.lastReminderSent;
            const daysSinceLastReminder = lastReminder 
                ? moment().diff(moment(lastReminder), 'days')
                : 999;

            if (daysSinceLastReminder >= 3) {
                const result = await sendComplianceReminder(task);
                if (result.success) {
                    reminderCount++;
                    console.log(`✅ Reminder sent for task: ${task.complianceType} (${task.assignedTo.email})`);
                } else {
                    console.error(`❌ Failed to send reminder for task: ${task._id}`, result.error);
                }
            }
        }

        console.log(`📧 Sent ${reminderCount} due soon reminders`);
        return { success: true, count: reminderCount };

    } catch (error) {
        console.error('❌ Error sending due soon reminders:', error);
        return { success: false, error: error.message };
    }
};

// Send notifications for overdue compliance tasks
const sendOverdueNotifications = async () => {
    try {
        console.log('🚨 Checking for overdue compliance tasks...');
        
        const overdueTasks = await ComplianceModel.findOverdue()
            .populate('assignedTo', 'name email')
            .populate('documentId', 'title department');

        let notificationCount = 0;
        
        for (const task of overdueTasks) {
            // Check if overdue notification was sent recently (within 1 day)
            const lastReminder = task.lastReminderSent;
            const hoursSinceLastReminder = lastReminder 
                ? moment().diff(moment(lastReminder), 'hours')
                : 999;

            if (hoursSinceLastReminder >= 24) {
                const result = await sendOverdueComplianceNotification(task);
                if (result.success) {
                    // Mark reminder as sent
                    await task.markReminderSent();
                    notificationCount++;
                    console.log(`🚨 Overdue notification sent for task: ${task.complianceType} (${task.assignedTo.email})`);
                } else {
                    console.error(`❌ Failed to send overdue notification for task: ${task._id}`, result.error);
                }
            }
        }

        console.log(`📧 Sent ${notificationCount} overdue notifications`);
        return { success: true, count: notificationCount };

    } catch (error) {
        console.error('❌ Error sending overdue notifications:', error);
        return { success: false, error: error.message };
    }
};

// Update compliance task statuses based on due dates
const updateComplianceStatuses = async () => {
    try {
        console.log('🔄 Updating compliance task statuses...');
        
        const today = new Date();
        
        // Update overdue tasks
        const overdueResult = await ComplianceModel.updateMany(
            {
                dueDate: { $lt: today },
                status: { $in: ['Pending', 'On Track'] },
                isActive: true
            },
            {
                $set: { status: 'Overdue' }
            }
        );

        console.log(`📊 Updated ${overdueResult.modifiedCount} tasks to overdue status`);
        return { success: true, updated: overdueResult.modifiedCount };

    } catch (error) {
        console.error('❌ Error updating compliance statuses:', error);
        return { success: false, error: error.message };
    }
};

// Main reminder service function
const runReminderService = async () => {
    try {
        console.log('🚀 Starting reminder service...');
        
        const results = await Promise.all([
            updateComplianceStatuses(),
            sendDueSoonReminders(),
            sendOverdueNotifications()
        ]);

        const summary = {
            statusUpdate: results[0],
            dueSoonReminders: results[1],
            overdueNotifications: results[2]
        };

        console.log('✅ Reminder service completed:', summary);
        return summary;

    } catch (error) {
        console.error('❌ Reminder service error:', error);
        return { success: false, error: error.message };
    }
};

// Run reminder service if called directly
if (require.main === module) {
    runReminderService()
        .then(() => {
            console.log('🎉 Reminder service finished');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Reminder service failed:', error);
            process.exit(1);
        });
}

module.exports = {
    runReminderService,
    sendDueSoonReminders,
    sendOverdueNotifications,
    updateComplianceStatuses
};
