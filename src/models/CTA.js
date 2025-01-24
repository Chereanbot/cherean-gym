import mongoose from 'mongoose'

const ctaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  primaryButton: {
    text: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  secondaryButton: {
    text: {
      type: String
    },
    url: {
      type: String
    }
  },
  backgroundImage: {
    type: String
  },
  backgroundColor: {
    type: String,
    default: '#000000'
  },
  textColor: {
    type: String,
    default: '#FFFFFF'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  position: {
    type: String,
    enum: ['top', 'middle', 'bottom'],
    default: 'bottom'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

const CTA = mongoose.models.CTA || mongoose.model('CTA', ctaSchema)

export default CTA 