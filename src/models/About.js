import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema(
    {
        headline: {
            type: String,
            required: [true, 'Please provide a professional headline'],
            maxlength: [100, 'Headline cannot be more than 100 characters']
        },
        shortBio: {
            type: String,
            required: [true, 'Please provide a short bio'],
            maxlength: [150, 'Short bio cannot be more than 150 characters']
        },
        aboutme: {
            type: String,
            required: [true, 'Please provide about information'],
            maxlength: [1000, 'About me cannot be more than 1000 characters']
        },
        vision: {
            type: String,
            required: [true, 'Please provide your professional vision'],
            maxlength: [500, 'Vision cannot be more than 500 characters']
        },
        uniqueSellingPoints: [{
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            icon: {
                type: String,
                default: 'star'
            }
        }],
        principles: [{
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            }
        }],
        journey: [{
            year: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            }
        }],
        expertise: [{
            area: {
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
            }
        }],
        noofprojects: {
            type: String,
            required: [true, 'Please provide number of projects']
        },
        yearofexerience: {
            type: String,
            required: [true, 'Please provide years of experience']
        },
        noofclients: {
            type: String,
            required: [true, 'Please provide number of clients']
        },
        skills: {
            type: String,
            required: [true, 'Please provide skills']
        },
        resume: {
            url: String,
            publicId: String,
            updatedAt: Date
        },
        deviceImages: {
            iPhone: {
                type: String,
                validate: {
                    validator: function(v) {
                        return !v || /^https?:\/\/.+/.test(v);
                    },
                    message: 'iPhone image must be a valid URL'
                }
            },
            macBook: {
                type: String,
                validate: {
                    validator: function(v) {
                        return !v || /^https?:\/\/.+/.test(v);
                    },
                    message: 'MacBook image must be a valid URL'
                }
            }
        },
        education: [{
            degree: String,
            institution: String,
            year: String,
            description: String
        }],
        certifications: [{
            name: String,
            issuer: String,
            year: String,
            link: String
        }],
        languages: [{
            name: String,
            proficiency: {
                type: String,
                enum: ['Basic', 'Intermediate', 'Advanced', 'Native']
            }
        }],
        achievements: [{
            title: String,
            year: String,
            description: String
        }],
        socialLinks: {
            github: String,
            linkedin: String,
            twitter: String,
            portfolio: String
        }
    },
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)

// Add any pre-save middleware
AboutSchema.pre('save', function(next) {
    // Trim whitespace from skills
    if (this.skills) {
        this.skills = this.skills.split(',')
            .map(skill => skill.trim())
            .filter(skill => skill.length > 0)
            .join(', ');
    }
    next();
})

// Add virtual for total years of experience
AboutSchema.virtual('totalExperience').get(function() {
    return this.yearofexerience || '0';
})

// Add method to get formatted skills array
AboutSchema.methods.getSkillsArray = function() {
    return this.skills ? this.skills.split(',').map(skill => skill.trim()) : [];
}

const About = mongoose.models.About || mongoose.model("About", AboutSchema)

export default About