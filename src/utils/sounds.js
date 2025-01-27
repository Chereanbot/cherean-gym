// Sound URLs - replace these with your actual sound file URLs
const NOTIFICATION_SOUNDS = {
    default: '/sounds/notification.mp3',
    success: '/sounds/success.mp3',
    warning: '/sounds/warning.mp3',
    error: '/sounds/error.mp3',
    message: '/sounds/message.mp3',
    reminder: '/sounds/reminder.mp3'
};

class SoundManager {
    constructor() {
        this.sounds = {};
        this.isInitialized = false;
    }

    initializeSounds() {
        // Only initialize in browser environment
        if (typeof window !== 'undefined' && !this.isInitialized) {
            this.sounds = {
                notification: typeof Audio !== 'undefined' ? new Audio('/sounds/notification.mp3') : null,
                message: typeof Audio !== 'undefined' ? new Audio('/sounds/message.mp3') : null,
                alert: typeof Audio !== 'undefined' ? new Audio('/sounds/alert.mp3') : null
            };
            this.isInitialized = true;
        }
    }

    playSound(soundName) {
        if (!this.isInitialized) {
            this.initializeSounds();
        }

        const sound = this.sounds[soundName];
        if (sound && typeof window !== 'undefined') {
            sound.currentTime = 0;
            sound.play().catch(error => {
                console.log('Sound playback failed:', error);
            });
        }
    }

    // Play sound based on notification type
    playNotificationSound(notificationType) {
        switch (notificationType) {
            case 'success':
                this.playSound('success');
                break;
            case 'warning':
                this.playSound('warning');
                break;
            case 'error':
                this.playSound('error');
                break;
            case 'message':
                this.playSound('message');
                break;
            case 'reminder':
                this.playSound('reminder');
                break;
            default:
                this.playSound('default');
        }
    }
}

export const soundManager = new SoundManager();