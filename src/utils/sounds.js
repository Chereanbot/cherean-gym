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
    static instance = null;
    audioElements = new Map();

    constructor() {
        if (SoundManager.instance) {
            return SoundManager.instance;
        }
        SoundManager.instance = this;
        this.initializeSounds();
    }

    initializeSounds() {
        Object.entries(NOTIFICATION_SOUNDS).forEach(([key, url]) => {
            const audio = new Audio(url);
            audio.preload = 'auto';
            this.audioElements.set(key, audio);
        });
    }

    async playSound(type = 'default') {
        try {
            const audio = this.audioElements.get(type);
            if (audio) {
                audio.currentTime = 0;
                await audio.play();
            }
        } catch (error) {
            console.error('Error playing sound:', error);
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