import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        shortDescription: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        technologies: {
            type: String,
            required: true
        },
        features: [String],
        category: {
            type: String,
            enum: [
                'Web App',
                'Mobile App',
                'Desktop App',
                'E-commerce',
                'Portfolio',
                'Blog',
                'Social Media',
                'Educational',
                'Enterprise',
                'API/Backend',
                'Library',
                'Game',
                'AI/ML',
                'Blockchain',
                'IoT',
                'Other'
            ],
            default: 'Web App'
        },
        subCategory: {
            type: String,
            default: ''
        },
        status: {
            type: String,
            enum: ['Completed', 'In Progress', 'Planned', 'Beta', 'Maintenance'],
            default: 'Completed'
        },
        challengesFaced: [{
            challenge: String,
            solution: String,
            impact: String
        }],
        role: String,
        teamSize: Number,
        duration: String,
        targetAudience: String,
        businessImpact: String,
        technicalHighlights: [String],
        deploymentDetails: {
            hosting: String,
            infrastructure: String,
            cicd: String
        },
        metrics: {
            performance: String,
            scalability: String,
            userBase: String
        },
        futureEnhancements: [String],
        links: {
            website: String,
            github: String,
            documentation: String,
            demo: String
        },
        screenshots: [{
            url: String,
            title: String,
            description: String,
            section: String,
            order: Number
        }],
        testimonials: [{
            name: String,
            role: String,
            comment: String,
            stakeholderType: String,
            focusArea: String,
            impact: String,
            credibilityFactors: [String],
            verified: {
                type: Boolean,
                default: false
            }
        }],
        seoMetadata: {
            title: String,
            description: String,
            keywords: [String],
            ogImage: String
        },
        analytics: {
            views: {
                type: Number,
                default: 0
            },
            likes: {
                type: Number,
                default: 0
            },
            shares: {
                type: Number,
                default: 0
            }
        },
        collaborators: [{
            name: String,
            role: String,
            github: String,
            linkedin: String
        }],
        awards: [{
            title: String,
            date: Date,
            description: String,
            link: String
        }],
        timeline: [{
            date: Date,
            milestone: String,
            description: String
        }],
        resources: [{
            type: {
                type: String,
                enum: ['Documentation', 'Tutorial', 'Blog Post', 'Video', 'Code Sample']
            },
            title: String,
            url: String,
            description: String
        }],
        techStack: {
            frontend: [String],
            backend: [String],
            database: [String],
            devops: [String],
            tools: [String]
        },
        performance: {
            lighthouse: {
                performance: Number,
                accessibility: Number,
                bestPractices: Number,
                seo: Number,
                pwa: Number
            },
            loadTime: String,
            apiLatency: String,
            uptime: String
        }
    },
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Virtual for project age
ProjectSchema.virtual('age').get(function() {
    return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Index for search
ProjectSchema.index({
    name: 'text',
    shortDescription: 'text',
    description: 'text',
    technologies: 'text'
});

// Pre-save middleware to process technologies
ProjectSchema.pre('save', function(next) {
    // Ensure technologies is a comma-separated string
    if (Array.isArray(this.technologies)) {
        this.technologies = this.technologies.join(', ');
    }
    
    // Generate SEO metadata if not provided
    if (!this.seoMetadata.title) {
        this.seoMetadata.title = this.name;
    }
    if (!this.seoMetadata.description) {
        this.seoMetadata.description = this.shortDescription;
    }
    if (!this.seoMetadata.keywords || this.seoMetadata.keywords.length === 0) {
        this.seoMetadata.keywords = this.technologies.split(',').map(tech => tech.trim());
    }

    next();
});

// Method to increment view count
ProjectSchema.methods.incrementViews = async function() {
    this.analytics.views += 1;
    return this.save();
};

// Static method to find similar projects
ProjectSchema.statics.findSimilar = function(project) {
    return this.find({
        $text: { 
            $search: `${project.technologies} ${project.category}` 
        },
        _id: { $ne: project._id }
    }).limit(3);
};

const Project = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
export default Project;