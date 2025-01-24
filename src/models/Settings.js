import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  general: {
    siteName: { type: String, default: 'Cherinet Afewerk' },
    siteDescription: { type: String, default: 'Personal Portfolio & Blog' },
    contactEmail: { type: String, default: 'cherinet@example.com' },
    phoneNumber: { type: String },
    address: { type: String },
    socialLinks: {
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
      instagram: { type: String, default: '' }
    }
  },
  profile: {
    fullName: { type: String, default: 'Cherinet Afewerk' },
    role: { type: String, default: 'Full Stack Developer' },
    bio: { type: String },
    avatar: { type: String },
    resume: { type: String },
    skills: [{ type: String }],
    languages: [{
      name: { type: String },
      proficiency: { type: String }
    }]
  },
  seo: {
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: [String],
    googleAnalyticsId: String,
    favicon: String,
    ogImage: String,
    customHeadTags: String
  },
  api: {
    keys: [{
      name: { type: String },
      key: { type: String },
      service: { type: String },
      createdAt: { type: Date, default: Date.now }
    }]
  }
}, {
  timestamps: true,
  strict: false // Allow additional fields
});

const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);

export default Settings; 