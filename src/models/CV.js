import mongoose from 'mongoose'

const languageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  proficiency: {
    type: String,
    enum: ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'],
    required: true
  }
})

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  current: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: true
  },
  achievements: [{
    type: String,
    trim: true
  }]
})

const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: true,
    trim: true
  },
  institution: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  year: {
    type: String,
    required: true,
    trim: true
  },
  gpa: {
    type: String,
    trim: true
  },
  honors: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
})

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    trim: true
  },
  technologies: {
    type: String,
    trim: true
  },
  results: {
    type: String,
    trim: true
  },
  link: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v)
      },
      message: 'Please enter a valid URL'
    }
  }
})

const certificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  issuer: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date
  },
  credentialId: {
    type: String,
    trim: true
  },
  link: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v)
      },
      message: 'Please enter a valid URL'
    }
  }
})

const awardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  issuer: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    trim: true
  }
})

const cvSchema = new mongoose.Schema({
  personalInfo: {
    fullName: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function(v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        },
        message: 'Please enter a valid email address'
      }
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^[\d\s+()-]{10,}$/.test(v)
        },
        message: 'Please enter a valid phone number'
      }
    },
    location: {
      type: String,
      trim: true
    },
    photo: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v)
        },
        message: 'Please enter a valid URL'
      }
    },
    github: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v)
        },
        message: 'Please enter a valid URL'
      }
    },
    website: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v)
        },
        message: 'Please enter a valid URL'
      }
    },
    summary: {
      type: String,
      required: true,
      trim: true
    }
  },
  experience: [experienceSchema],
  education: [educationSchema],
  skills: {
    technical: [{
      type: String,
      trim: true
    }],
    soft: [{
      type: String,
      trim: true
    }],
    languages: [languageSchema]
  },
  projects: [projectSchema],
  certifications: [certificationSchema],
  awards: [awardSchema],
  resume: {
    url: {
      type: String,
      trim: true
    },
    publicId: {
      type: String,
      trim: true
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true
})

// Add indexes for better query performance
cvSchema.index({ 'personalInfo.email': 1 })
cvSchema.index({ createdAt: -1 })

// Add methods if needed
cvSchema.methods.toJSON = function() {
  const cv = this.toObject()
  delete cv.__v
  return cv
}

// Add validation for dates
experienceSchema.pre('validate', function(next) {
  if (this.endDate && this.startDate && this.endDate < this.startDate) {
    this.invalidate('endDate', 'End date must be after start date')
  }
  next()
})

// Add validation for GPA
educationSchema.path('gpa').validate(function(value) {
  if (!value) return true
  const gpaValue = parseFloat(value)
  return !isNaN(gpaValue) && gpaValue >= 0 && gpaValue <= 4
}, 'GPA must be a number between 0 and 4')

// Add validation for year
educationSchema.path('year').validate(function(value) {
  const currentYear = new Date().getFullYear()
  const year = parseInt(value.replace('Expected ', ''))
  return !isNaN(year) && year >= 1900 && year <= currentYear + 10
}, 'Invalid year')

// Add validation for certification dates
certificationSchema.pre('validate', function(next) {
  if (this.expiryDate && this.date && this.expiryDate < this.date) {
    this.invalidate('expiryDate', 'Expiry date must be after issue date')
  }
  next()
})

// Add methods to cvSchema
cvSchema.methods = {
  // Format dates in experience
  formatExperienceDates() {
    return this.experience.map(exp => ({
      ...exp.toObject(),
      startDate: exp.startDate.toLocaleDateString(),
      endDate: exp.current ? 'Present' : exp.endDate?.toLocaleDateString()
    }))
  },

  // Get total years of experience
  getTotalExperience() {
    return this.experience.reduce((total, exp) => {
      const start = new Date(exp.startDate)
      const end = exp.current ? new Date() : new Date(exp.endDate)
      const years = (end - start) / (1000 * 60 * 60 * 24 * 365.25)
      return total + years
    }, 0).toFixed(1)
  },

  // Get all skills (combined)
  getAllSkills() {
    return {
      technical: this.skills.technical,
      soft: this.skills.soft,
      languages: this.skills.languages.map(l => `${l.name} (${l.proficiency})`)
    }
  },

  // Get active certifications
  getActiveCertifications() {
    const now = new Date()
    return this.certifications.filter(cert => 
      !cert.expiryDate || new Date(cert.expiryDate) > now
    )
  },

  // Check if CV is complete
  isComplete() {
    const requiredSections = [
      this.personalInfo.fullName,
      this.personalInfo.email,
      this.personalInfo.title,
      this.personalInfo.summary,
      this.experience.length > 0,
      this.education.length > 0,
      this.skills.technical.length > 0
    ]
    return requiredSections.every(Boolean)
  }
}

// Add static methods
cvSchema.statics = {
  // Find CVs by skill
  async findBySkill(skill) {
    return this.find({
      $or: [
        { 'skills.technical': { $regex: skill, $options: 'i' } },
        { 'skills.soft': { $regex: skill, $options: 'i' } },
        { 'skills.languages.name': { $regex: skill, $options: 'i' } }
      ]
    })
  },

  // Find CVs by experience range
  async findByExperienceRange(minYears, maxYears) {
    const cvs = await this.find()
    return cvs.filter(cv => {
      const years = parseFloat(cv.getTotalExperience())
      return years >= minYears && years <= maxYears
    })
  },

  // Find CVs by certification
  async findByCertification(certName) {
    return this.find({
      'certifications.name': { $regex: certName, $options: 'i' }
    })
  }
}

// Add compound indexes
cvSchema.index({ 'personalInfo.fullName': 'text', 'personalInfo.summary': 'text' })
cvSchema.index({ 'experience.company': 1, 'experience.title': 1 })
cvSchema.index({ 'education.institution': 1, 'education.degree': 1 })

// Add middleware
cvSchema.pre('save', function(next) {
  // Sort experience by date (most recent first)
  this.experience.sort((a, b) => {
    const dateA = a.current ? new Date() : new Date(a.endDate)
    const dateB = b.current ? new Date() : new Date(b.endDate)
    return dateB - dateA
  })

  // Sort education by year (most recent first)
  this.education.sort((a, b) => {
    const yearA = parseInt(a.year.replace('Expected ', ''))
    const yearB = parseInt(b.year.replace('Expected ', ''))
    return yearB - yearA
  })

  next()
})

const CV = mongoose.models.CV || mongoose.model('CV', cvSchema)

export default CV 