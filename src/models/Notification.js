import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['success', 'warning', 'error', 'info'],
    default: 'info'
  },
  date: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  },
  link: {
    type: String
  },
  category: {
    type: String,
    enum: ['blog', 'project', 'service', 'experience', 'education', 'system'],
    default: 'system'
  }
})

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema)

export default Notification 