// Analytics event tracking utility
import { track } from '@vercel/analytics';

class Analytics {
    constructor() {
        this.ws = null;
        this.sessionId = this.generateSessionId();
        this.sessionStart = Date.now();
        this.pageViews = 0;
        this.connected = false;
        this.queue = [];
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;

        // Initialize connection
        this.connect();

        // Track page views
        this.trackPageView();

        // Add event listeners
        window.addEventListener('beforeunload', () => this.endSession());
    }

    connect() {
        try {
            this.ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001');

            this.ws.onopen = () => {
                this.connected = true;
                this.reconnectAttempts = 0;
                console.log('Analytics: Connected to WebSocket server');
                
                // Send queued events
                while (this.queue.length > 0) {
                    const event = this.queue.shift();
                    this.send(event);
                }
            };

            this.ws.onclose = () => {
                this.connected = false;
                console.log('Analytics: Disconnected from WebSocket server');
                this.reconnect();
            };

            this.ws.onerror = (error) => {
                console.error('Analytics: WebSocket error:', error);
                this.connected = false;
            };
        } catch (error) {
            console.error('Analytics: Error connecting to WebSocket server:', error);
        }
    }

    reconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            setTimeout(() => this.connect(), delay);
        }
    }

    generateSessionId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    send(data) {
        if (this.connected && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({
                ...data,
                sessionId: this.sessionId,
                timestamp: Date.now()
            }));
        } else {
            this.queue.push(data);
        }
    }

    trackPageView() {
        this.pageViews++;
        this.send({
            type: 'pageview',
            path: window.location.pathname,
            title: document.title,
            referrer: document.referrer
        });
    }

    trackEvent(action, data = {}) {
        this.send({
            type: 'user_action',
            action,
            path: window.location.pathname,
            ...data
        });
    }

    updateSessionMetrics() {
        const duration = Date.now() - this.sessionStart;
        this.send({
            type: 'session_update',
            duration,
            pageViews: this.pageViews,
            bounced: this.pageViews === 1
        });
    }

    endSession() {
        this.updateSessionMetrics();
        if (this.ws) {
            this.ws.close();
        }
    }
}

// Create singleton instance
let analytics;

export function initAnalytics() {
    if (typeof window !== 'undefined' && !analytics) {
        analytics = new Analytics();
    }
    return analytics;
}

export function trackEvent(action, data) {
    if (analytics) {
        analytics.trackEvent(action, data);
    }
}

export default analytics;

// Portfolio specific events
export const analyticsEvents = {
  // Contact form events
  CONTACT_FORM_SUBMIT: 'contact_form_submit',
  CONTACT_FORM_SUCCESS: 'contact_form_success',
  CONTACT_FORM_ERROR: 'contact_form_error',

  // Project interactions
  PROJECT_VIEW: 'project_view',
  PROJECT_CLICK: 'project_click',
  
  // Blog interactions
  BLOG_POST_VIEW: 'blog_post_view',
  BLOG_CATEGORY_CLICK: 'blog_category_click',
  
  // Service interactions
  SERVICE_VIEW: 'service_view',
  SERVICE_INQUIRY: 'service_inquiry',

  // Resume/CV interactions
  RESUME_DOWNLOAD: 'resume_download',
  GITHUB_CLICK: 'github_click',

  // Navigation
  NAV_ITEM_CLICK: 'nav_item_click',
  
  // Social links
  SOCIAL_LINK_CLICK: 'social_link_click',

  // Ethiopian specific events
  ETHIOPIAN_MARKET_INQUIRY: 'ethiopian_market_inquiry',
  ETHIO_TECH_CONTENT_VIEW: 'ethio_tech_content_view',
  LOCAL_PROJECT_INQUIRY: 'local_project_inquiry'
};

// Example usage functions
export const trackProjectView = (projectName, projectId) => {
  trackEvent(analyticsEvents.PROJECT_VIEW, {
    project_name: projectName,
    project_id: projectId,
    region: 'Ethiopia'
  });
};

export const trackContactFormSubmit = (formType) => {
  trackEvent(analyticsEvents.CONTACT_FORM_SUBMIT, {
    form_type: formType,
    region: 'Ethiopia'
  });
};

export const trackBlogPostView = (postTitle, postCategory) => {
  trackEvent(analyticsEvents.BLOG_POST_VIEW, {
    post_title: postTitle,
    category: postCategory,
    region: 'Ethiopia'
  });
};

export const trackSocialClick = (platform) => {
  trackEvent(analyticsEvents.SOCIAL_LINK_CLICK, {
    platform: platform,
    region: 'Ethiopia'
  });
};

export const trackNavigation = (destination) => {
  trackEvent(analyticsEvents.NAV_ITEM_CLICK, {
    destination: destination,
    region: 'Ethiopia'
  });
};

export const trackServiceInquiry = (serviceName) => {
  trackEvent(analyticsEvents.SERVICE_INQUIRY, {
    service_name: serviceName,
    region: 'Ethiopia'
  });
};

// Ethiopian market specific tracking
export const trackEthiopianMarketInquiry = (marketType, projectType) => {
  trackEvent(analyticsEvents.ETHIOPIAN_MARKET_INQUIRY, {
    market_type: marketType,
    project_type: projectType,
    region: 'Ethiopia'
  });
};

export const trackEthioTechContent = (contentType, topic) => {
  trackEvent(analyticsEvents.ETHIO_TECH_CONTENT_VIEW, {
    content_type: contentType,
    topic: topic,
    region: 'Ethiopia'
  });
};

export const trackLocalProjectInquiry = (projectType, location) => {
  trackEvent(analyticsEvents.LOCAL_PROJECT_INQUIRY, {
    project_type: projectType,
    location: location,
    region: 'Ethiopia'
  });
}; 