import mongoose from "mongoose"

const ServiceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    technologies: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema)

export default Service 