import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    enum: ['user', 'ai', 'agent'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  attachment: {
    type: {
      type: String,
      enum: ['image', 'audio', 'file'],
    },
    url: String,
    fileName: String,
  },
  metadata: {
    type: Map,
    of: String,
    default: {},
  },
  isRead: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

// Add indexes for better query performance
chatMessageSchema.index({ chatId: 1, timestamp: -1 });
chatMessageSchema.index({ sender: 1 });

const ChatMessage = mongoose.models.ChatMessage || mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage; 