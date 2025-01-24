import mongoose from "mongoose";

const DashboardSettingsSchema = new mongoose.Schema(
    {
        theme: {
            mode: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
            primaryColor: { type: String, default: 'green' },
            accentColor: { type: String, default: 'blue' },
            customCSS: { type: String, default: '' }
        },
        layout: {
            compactMode: { type: Boolean, default: false },
            showGreeting: { type: Boolean, default: true },
            cardSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
            gridColumns: { type: Number, min: 1, max: 4, default: 3 },
            stickyHeader: { type: Boolean, default: true },
            showSearch: { type: Boolean, default: true },
            showTimeline: { type: Boolean, default: true }
        },
        widgets: {
            blogs: {
                visible: { type: Boolean, default: true },
                order: { type: Number, default: 1 },
                showDrafts: { type: Boolean, default: true },
                showPublished: { type: Boolean, default: true },
                bgColor: { type: String, default: 'blue' },
                refreshInterval: { type: Number, default: 0 } // 0 means no auto-refresh
            },
            projects: {
                visible: { type: Boolean, default: true },
                order: { type: Number, default: 2 },
                showActive: { type: Boolean, default: true },
                showCompleted: { type: Boolean, default: true },
                bgColor: { type: String, default: 'green' },
                refreshInterval: { type: Number, default: 0 }
            },
            services: {
                visible: { type: Boolean, default: true },
                order: { type: Number, default: 3 },
                showCount: { type: Boolean, default: true },
                bgColor: { type: String, default: 'purple' },
                refreshInterval: { type: Number, default: 0 }
            },
            experience: {
                visible: { type: Boolean, default: true },
                order: { type: Number, default: 4 },
                showCount: { type: Boolean, default: true },
                bgColor: { type: String, default: 'orange' },
                refreshInterval: { type: Number, default: 0 }
            },
            education: {
                visible: { type: Boolean, default: true },
                order: { type: Number, default: 5 },
                showCount: { type: Boolean, default: true },
                bgColor: { type: String, default: 'pink' },
                refreshInterval: { type: Number, default: 0 }
            },
            messages: {
                visible: { type: Boolean, default: true },
                order: { type: Number, default: 6 },
                showUnread: { type: Boolean, default: true },
                showTotal: { type: Boolean, default: true },
                bgColor: { type: String, default: 'yellow' },
                refreshInterval: { type: Number, default: 30 } // 30 seconds default refresh for messages
            },
            performance: {
                visible: { type: Boolean, default: true },
                order: { type: Number, default: 7 },
                showVisitors: { type: Boolean, default: true },
                showPageViews: { type: Boolean, default: true },
                showBounceRate: { type: Boolean, default: true },
                bgColor: { type: String, default: 'indigo' },
                refreshInterval: { type: Number, default: 60 }
            },
            activity: {
                visible: { type: Boolean, default: true },
                order: { type: Number, default: 8 },
                maxItems: { type: Number, default: 5 },
                showTimestamp: { type: Boolean, default: true },
                bgColor: { type: String, default: 'teal' },
                refreshInterval: { type: Number, default: 30 }
            }
        },
        quickActions: {
            newBlog: {
                visible: { type: Boolean, default: true },
                order: { type: Number, default: 1 },
                showDescription: { type: Boolean, default: true },
                shortcut: { type: String, default: 'ctrl+b' }
            },
            newProject: {
                visible: { type: Boolean, default: true },
                order: { type: Number, default: 2 },
                showDescription: { type: Boolean, default: true },
                shortcut: { type: String, default: 'ctrl+p' }
            },
            manageServices: {
                visible: { type: Boolean, default: true },
                order: { type: Number, default: 3 },
                showDescription: { type: Boolean, default: true },
                shortcut: { type: String, default: 'ctrl+s' }
            },
            updateExperience: {
                visible: { type: Boolean, default: true },
                order: { type: Number, default: 4 },
                showDescription: { type: Boolean, default: true },
                shortcut: { type: String, default: 'ctrl+e' }
            },
            viewMessages: {
                visible: { type: Boolean, default: true },
                order: { type: Number, default: 5 },
                showDescription: { type: Boolean, default: true },
                shortcut: { type: String, default: 'ctrl+m' }
            },
            editProfile: {
                visible: { type: Boolean, default: true },
                order: { type: Number, default: 6 },
                showDescription: { type: Boolean, default: true },
                shortcut: { type: String, default: 'ctrl+u' }
            }
        },
        notifications: {
            showInDashboard: { type: Boolean, default: true },
            position: { type: String, enum: ['top-right', 'top-left', 'bottom-right', 'bottom-left'], default: 'top-right' },
            autoHide: { type: Boolean, default: true },
            duration: { type: Number, default: 5000 },
            sound: { type: Boolean, default: true },
            desktop: { type: Boolean, default: true },
            groupSimilar: { type: Boolean, default: true },
            maxStack: { type: Number, default: 5 }
        },
        search: {
            enabled: { type: Boolean, default: true },
            shortcut: { type: String, default: 'ctrl+/' },
            searchIn: {
                blogs: { type: Boolean, default: true },
                projects: { type: Boolean, default: true },
                services: { type: Boolean, default: true },
                messages: { type: Boolean, default: true }
            },
            recentSearches: { type: Number, default: 5 }
        },
        performance: {
            enableTracking: { type: Boolean, default: true },
            metrics: {
                visitors: { type: Boolean, default: true },
                pageViews: { type: Boolean, default: true },
                bounceRate: { type: Boolean, default: true },
                avgSessionDuration: { type: Boolean, default: true }
            },
            interval: { type: String, enum: ['realtime', 'hourly', 'daily', 'weekly'], default: 'daily' }
        },
        timeline: {
            enabled: { type: Boolean, default: true },
            maxItems: { type: Number, default: 10 },
            showTypes: {
                blogs: { type: Boolean, default: true },
                projects: { type: Boolean, default: true },
                services: { type: Boolean, default: true },
                messages: { type: Boolean, default: true },
                system: { type: Boolean, default: true }
            },
            groupByDay: { type: Boolean, default: true }
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

const DashboardSettings = mongoose.models.DashboardSettings || mongoose.model("DashboardSettings", DashboardSettingsSchema);

export default DashboardSettings; 