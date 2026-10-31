// models/meds_model.js

import mongoose from 'mongoose';

const medicationSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    medications: [
      {
        name: {
          type: String,
          required: [true, 'Medication name is required.'],
          trim: true,
        },
        dosage: {
          type: String,
          required: [true, 'Dosage is required.'],
          trim: true,
        },
        instructions: {
          type: String,
          trim: true,
        },
        dateAssigned: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
medicationSchema.index({ patient: 1 });
medicationSchema.index({ doctor: 1 });

const Medication = mongoose.models.Medication || mongoose.model('Medication', medicationSchema);

export default Medication;
