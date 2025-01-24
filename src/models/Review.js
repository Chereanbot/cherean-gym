import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    // Basic Review Information
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxLength: 100
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxLength: 1000
    },
    
    // Review Categories
    categories: {
        expertise: { type: Number, min: 1, max: 10 },
        communication: { type: Number, min: 1, max: 10 },
        quality: { type: Number, min: 1, max: 10 },
        timeline: { type: Number, min: 1, max: 10 }
    },
    
    // Reviewer Information
    reviewer: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        company: {
            type: String,
            trim: true
        },
        position: {
            type: String,
            trim: true
        }
    },
    
    // Review Context
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    serviceType: {
        type: String,
        enum: ['Web Development', 'Mobile Development', 'UI/UX Design', 'Consulting', 'Other'],
        required: true
    },
    
    // Media and Attachments
    media: [{
        type: {
            type: String,
            enum: ['image', 'video'],
            required: true
        },
        url: {
            type: String,
            required: true
        },
        caption: String
    }],
    
    // Verification and Status
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationDetails: {
        method: String,
        verifiedAt: Date,
        verifiedBy: String
    },
    
    // Social Proof
    socialProof: {
        platform: String,
        profileUrl: String,
        verified: Boolean
    },
    
    // Metadata
    tags: [String],
    language: {
        type: String,
        default: 'en'
    },
    helpful: {
        count: { type: Number, default: 0 },
        users: [{ type: String }]
    },
    
    // Response and Follow-up
    response: {
        content: String,
        respondedAt: Date,
        respondedBy: String
    },
    followUp: {
        requested: { type: Boolean, default: false },
        completedAt: Date,
        notes: String
    }
}, {
    timestamps: true
});

// Indexes for better query performance
reviewSchema.index({ rating: 1, status: 1 });
reviewSchema.index({ 'reviewer.email': 1 });
reviewSchema.index({ projectId: 1 });
reviewSchema.index({ serviceType: 1 });

// Virtual for average category rating
reviewSchema.virtual('categoryAverage').get(function() {
    const categories = this.categories;
    if (!categories) return null;
    
    const values = Object.values(categories).filter(val => val != null);
    if (values.length === 0) return null;
    
    return values.reduce((sum, val) => sum + val, 0) / values.length;
});

// Method to check if review needs moderation
reviewSchema.methods.needsModeration = function() {
    return this.status === 'pending' || !this.isVerified;
};

// Static method to get average ratings
reviewSchema.statics.getAverageRatings = async function(filter = {}) {
    return this.aggregate([
        { $match: { ...filter, status: 'approved' } },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 },
                categories: {
                    $avg: {
                        expertise: '$categories.expertise',
                        communication: '$categories.communication',
                        quality: '$categories.quality',
                        timeline: '$categories.timeline'
                    }
                }
            }
        }
    ]);
};

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review; 