// models/Document.js

import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient ID is required.'],
      index: true, // Ensures faster queries on patientId
    },
    fileName: {
      type: String,
      required: [true, 'File name is required.'],
      trim: true,
    },
    fileData: { 
      type: Buffer, 
      required: true 
    },
    fileMimeType: { 
      type: String, 
      required: true 
    },
    content: {
      type: String,
      required: [true, 'Content extracted from the file is required.'],
    },
    embedding: {
      type: [Number],
      required: [true, 'Vector embedding is required.'],
      validate: {
        validator: function(v) {
          // Replace 768 with your embedding dimension
          return v.length === 1536;
        },
        message: props => `Embedding must be 1536 dimensions. Currently, it's ${props.value.length}.`,
      },
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader (doctor) ID is required.'],
      index: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Note: knnVector index will be created separately

export default mongoose.model('Document', documentSchema);
