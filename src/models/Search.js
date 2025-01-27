import mongoose from 'mongoose';

const SearchSchema = new mongoose.Schema({
    query: { 
        type: String, 
        required: true 
    },
    embedding: {
        type: [Number],
        required: false,
        validate: {
            validator: function(v) {
                return v === undefined || v === null || Array.isArray(v);
            },
            message: 'Embedding must be an array of numbers or null'
        }
    },
    type: {
        type: String,
        enum: ['blog', 'project', 'service', 'message', 'all'],
        default: 'all'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    results: [{
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'resultType'
        },
        resultType: {
            type: String,
            enum: ['Blog', 'Project', 'Service', 'Contact', 'blog', 'project', 'service', 'message'],
            required: true,
            set: function(v) {
                // Convert to capitalized model name if lowercase
                switch(v.toLowerCase()) {
                    case 'blog': return 'Blog';
                    case 'project': return 'Project';
                    case 'service': return 'Service';
                    case 'message': return 'Contact';
                    default: return v;
                }
            }
        },
        score: {
            type: Number,
            default: 1
        }
    }],
    timestamp: {
        type: Date,
        default: Date.now
    },
    aiProvider: {
        type: String,
        enum: ['gemini', 'none'],
        default: 'none'
    }
}, {
    timestamps: true
});

// Create indexes for better query performance
SearchSchema.index({ query: 'text' });
SearchSchema.index({ userId: 1, timestamp: -1 });
SearchSchema.index({ embedding: '2dsphere' });

// Pre-save middleware to set aiProvider
SearchSchema.pre('save', function(next) {
    if (this.embedding) {
        this.aiProvider = 'gemini';
    }
    next();
});

const Search = mongoose.models.Search || mongoose.model('Search', SearchSchema);
export default Search; 