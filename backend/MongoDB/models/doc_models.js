// models/Document.js

import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Patient ID is required.'],
    },
    fileName: {
      type: String,
      required: [true, 'File name is required.'],
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'File URL is required.'],
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
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader (doctor) ID is required.'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

documentSchema.index({ patientId: 1 });
documentSchema.index({ uploadedBy: 1 });

export default mongoose.model('Document', documentSchema);
