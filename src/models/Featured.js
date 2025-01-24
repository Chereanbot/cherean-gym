import mongoose from 'mongoose'

const featuredSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  projectUrl: {
    type: String,
    required: true
  },
  githubUrl: {
    type: String
  },
  technologies: [{
    type: String
  }],
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

const Featured = mongoose.models.Featured || mongoose.model('Featured', featuredSchema)

export default Featured 