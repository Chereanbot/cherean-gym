import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        minLength: [3, "Username must be at least 3 characters long"],
        maxLength: [30, "Username cannot exceed 30 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please enter a valid email address"
        ]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [6, "Password must be at least 6 characters long"]
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    profileImage: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        maxLength: [500, "Bio cannot exceed 500 characters"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLogin: Date,
    socialLinks: {
        facebook: String,
        twitter: String,
        linkedin: String,
        github: String
    },
    settings: {
        emailNotifications: {
            type: Boolean,
            default: true
        },
        twoFactorAuth: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.verificationToken;
            delete ret.resetPasswordToken;
            delete ret.resetPasswordExpire;
            return ret;
        }
    }
});

// Add indexes for better query performance
UserSchema.index({ username: 1, email: 1 });

// Pre-save hook for any additional processing
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    // Additional pre-save logic can be added here
    next();
});

// Instance method to check if user is admin
UserSchema.methods.isAdmin = function() {
    return this.role === 'admin';
};

// Static method to find user by email
UserSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase() });
};

// Ensure model is only compiled once
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;