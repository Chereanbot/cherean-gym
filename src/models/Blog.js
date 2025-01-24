import mongoose from "mongoose"

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tags: [{
      type: String
    }],
    status: {
      type: String,
      enum: ['Draft', 'Published'],
      default: 'Draft'
    },
    author: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0
    },
    readTime: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

// Create indexes for better search performance
BlogSchema.index({ title: 'text', content: 'text', tags: 'text' })

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema)

export default Blog 