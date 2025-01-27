import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'closed', 'pending'],
    default: 'active',
  },
  subject: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
  },
  tags: [{
    type: String,
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  satisfaction: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: String,
  },
  metadata: {
    type: Map,
    of: String,
    default: {},
  }
}, {
  timestamps: true,
});

// Add indexes for better query performance
chatSchema.index({ userId: 1, status: 1 });
chatSchema.index({ startTime: -1 });

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);

export default Chat; 