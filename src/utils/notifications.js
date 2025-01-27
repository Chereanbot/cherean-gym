import Notification from '@/models/Notification';
import { soundManager } from './sounds';

export async function createNotification({
    message,
    type = 'info',
    category = 'system',
    link = null,
    importance = 'low',
    metadata = {}
}) {
    try {
        const response = await fetch('/api/notifications/realtime', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message,
                type,
                category,
                link,
                importance,
                metadata
            })
        });

        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Error creating notification:', error);
        return false;
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

export async function notifyBlogComment(blog, comment) {
    return createNotification({
        message: `New comment on "${blog.title}"`,
        type: 'info',
        category: 'blog',
        link: `/blog/${blog.slug}#comments`,
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

// Message related notifications
export async function notifyNewMessage(message) {
    return createNotification({
        message: `New message from ${message.name}`,
        type: 'info',
        category: 'message',
        importance: 'high',
        link: '/admin/messages',
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
        type: 'warning',
        category: 'system',
        importance: importance || 'high'
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

// Error notifications
export async function notifyError(error, context = '') {
    const errorMessage = context 
        ? `Error in ${context}: ${error.message}`
        : `Error: ${error.message}`;
        
    return createNotification({
        message: errorMessage,
        type: 'error',
        category: 'system',
        importance: 'high',
        metadata: { 
            error: error.message, 
            stack: error.stack,
            context 
        }
    });
}

// Security notifications
export async function notifyLoginAttempt(success, info) {
    const username = info.username || 'Unknown';
    const ipAddress = info.ip || 'Unknown IP';
    
    return createNotification({
        message: success 
            ? `Successful login from ${ipAddress} (${username})`
            : `Failed login attempt for ${username} from ${ipAddress}`,
        type: success ? 'success' : 'warning',
        category: 'auth',
        importance: success ? 'low' : 'high',
        metadata: { ...info, success }
    });
}

// AI-Related Notifications
export async function notifyAICompletion(prompt, type) {
    return createNotification({
        message: `AI ${type} generation completed`,
        type: 'success',
        category: 'ai',
        importance: 'medium',
        metadata: { prompt, type }
    });
}

export async function notifyAIError(error, type) {
    return createNotification({
        message: `AI ${type} generation failed: ${error.message}`,
        type: 'error',
        category: 'ai',
        importance: 'high',
        metadata: { error: error.toString(), type }
    });
}

export async function notifyAIQuota(remaining, limit) {
    const percentage = (remaining / limit) * 100;
    return createNotification({
        message: `AI API quota at ${percentage}% (${remaining}/${limit} requests remaining)`,
        type: percentage < 20 ? 'warning' : 'info',
        category: 'ai',
        importance: percentage < 20 ? 'high' : 'medium',
        metadata: { remaining, limit, percentage }
    });
}

// Analytics Notifications
export async function notifyAnalyticsThreshold(metric, value, threshold) {
    return createNotification({
        message: `${metric} reached ${value} (threshold: ${threshold})`,
        type: 'info',
        category: 'analytics',
        importance: 'medium',
        metadata: { metric, value, threshold }
    });
}

export async function notifyTrafficSpike(current, average) {
    const increase = ((current - average) / average) * 100;
    return createNotification({
        message: `Traffic spike detected: ${increase.toFixed(1)}% increase`,
        type: 'warning',
        category: 'analytics',
        importance: 'high',
        metadata: { current, average, increase }
    });
}