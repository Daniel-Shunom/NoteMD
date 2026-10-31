// models/User.js

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'First name is required.'],
      trim: true,
    },
    lname: {
      type: String,
      required: [true, 'Last name is required.'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address.'],
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minlength: [6, 'Password must be at least 6 characters long.'],
    },
    role: {
      type: String,
      enum: ['doctor', 'patient'],
      required: [true, 'User role is required.'],
    },
    licenseNumber: {
      type: String,
      required: function () {
        return this.role === 'doctor';
      },
      trim: true,
    },
    // **New Fields**
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      /*required: function () {
        return this.role === 'patient';
      },*/
    },
    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Pre-save middleware to hash passwords
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Prevent model recompilation in environments like serverless functions
const User = mongoose.models.User || mongoose.model('User', userSchema);

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ doctor: 1 }); // For patient queries
userSchema.index({ patients: 1 });

export default User;
