import Notification from '@/models/Notification';
import { soundManager } from './sounds';

export async function createNotification({
    message,
    type = 'info',
    category = 'general',
    link,
    importance = 'low',
    metadata = {},
    expiresAt,
    playSound = true
}) {
    try {
        const notification = await Notification.create({
            message,
            type,
            category,
            link,
            importance,
            metadata,
            expiresAt
        });

        if (playSound) {
            soundManager.playNotificationSound(type);
        }

        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
}

// Blog related notifications
export async function notifyBlogCreated(blog) {
    return createNotification({
        message: `New blog post created: ${blog.title}`,
        type: 'success',
        category: 'blog',
        link: `/blog/${blog.slug}`,
        importance: 'medium',
        metadata: { blogId: blog._id }
    });
}

export async function notifyBlogPublished(blog) {
    return createNotification({
        message: `Blog post published: ${blog.title}`,
        type: 'success',
        category: 'blog',
        link: `/blog/${blog.slug}`,
        importance: 'medium',
        metadata: { blogId: blog._id }
    });
}

export async function notifyBlogCommented(blog, comment) {
    return createNotification({
        message: `New comment on "${blog.title}" from ${comment.author}`,
        type: 'info',
        category: 'blog',
        link: `/blog/${blog.slug}#comment-${comment._id}`,
        importance: 'low',
        metadata: { blogId: blog._id, commentId: comment._id }
    });
}

// Project related notifications
export async function notifyProjectCreated(project) {
    return createNotification({
        message: `New project created: ${project.name}`,
        type: 'success',
        category: 'project',
        link: `/projects/${project.slug}`,
        importance: 'medium',
        metadata: { projectId: project._id }
    });
}

export async function notifyProjectUpdated(project) {
    return createNotification({
        message: `Project updated: ${project.name}`,
        type: 'info',
        category: 'project',
        link: `/projects/${project.slug}`,
        metadata: { projectId: project._id }
    });
}

export async function notifyProjectStatusChanged(project, oldStatus, newStatus) {
    return createNotification({
        message: `Project "${project.name}" status changed from ${oldStatus} to ${newStatus}`,
        type: 'info',
        category: 'project',
        link: `/projects/${project.slug}`,
        importance: 'medium',
        metadata: { projectId: project._id, oldStatus, newStatus }
    });
}

// Message related notifications
export async function notifyNewMessage(message) {
    return createNotification({
        message: `New message from ${message.name}`,
        type: 'message',
        category: 'general',
        link: '/admin/messages',
        importance: 'high',
        metadata: { messageId: message._id }
    });
}

export async function notifyUrgentMessage(message) {
    return createNotification({
        message: `Urgent message from ${message.name}: ${message.subject}`,
        type: 'warning',
        category: 'general',
        link: '/admin/messages',
        importance: 'high',
        metadata: { messageId: message._id }
    });
}

// System notifications
export async function notifySystemUpdate(message, importance = 'medium') {
    return createNotification({
        message,
        type: 'info',
        category: 'system',
        importance
    });
}

export async function notifySystemMaintenance(startTime, duration) {
    return createNotification({
        message: `System maintenance scheduled for ${startTime} (Duration: ${duration})`,
        type: 'warning',
        category: 'system',
        importance: 'high',
        metadata: { startTime, duration }
    });
}

export async function notifyBackupComplete(status, details) {
    return createNotification({
        message: `System backup ${status}: ${details}`,
        type: status === 'completed' ? 'success' : 'error',
        category: 'system',
        importance: 'medium',
        metadata: { status, details }
    });
}

// Error notifications
export async function notifyError(error, context) {
    return createNotification({
        message: `Error in ${context}: ${error.message}`,
        type: 'error',
        category: 'system',
        importance: 'high',
        metadata: { error: error.message, stack: error.stack }
    });
}

// Security notifications
export async function notifyLoginAttempt(success, username, ipAddress) {
    return createNotification({
        message: `${success ? 'Successful' : 'Failed'} login attempt for ${username} from ${ipAddress}`,
        type: success ? 'success' : 'warning',
        category: 'auth',
        importance: success ? 'low' : 'high',
        metadata: { username, ipAddress }
    });
}

export async function notifySecurityAlert(message, details) {
    return createNotification({
        message,
        type: 'error',
        category: 'auth',
        importance: 'high',
        metadata: details
    });
}

// Performance notifications
export async function notifyPerformanceIssue(metric, value, threshold) {
    return createNotification({
        message: `Performance alert: ${metric} (${value}) exceeded threshold (${threshold})`,
        type: 'warning',
        category: 'system',
        importance: 'high',
        metadata: { metric, value, threshold }
    });
}

// Reminder notifications
export async function notifyReminder(message, dueDate) {
    return createNotification({
        message,
        type: 'reminder',
        category: 'general',
        importance: 'medium',
        metadata: { dueDate },
        expiresAt: new Date(dueDate)
    });
} 