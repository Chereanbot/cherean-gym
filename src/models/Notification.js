import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info'
  },
  category: {
    type: String,
    enum: ['blog', 'project', 'service', 'system', 'auth', 'general'],
    default: 'general'
  },
  read: {
    type: Boolean,
    default: false
  },
  link: {
    type: String
  },
  importance: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true
})

// Index for efficient querying
notificationSchema.index({ read: 1, createdAt: -1 })
notificationSchema.index({ category: 1, createdAt: -1 })
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema)

export default Notification 