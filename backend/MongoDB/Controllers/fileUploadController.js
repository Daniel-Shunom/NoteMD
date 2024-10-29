// controllers/uploadDocumentController.js

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Document from '../models/doc_models.js';
import User from '../models/user_model.js';
import 'openai';
import logger from '../../logger.js'; // Ensure logger is correctly set up

// Initialize OpenAI
const configuration = process.env.OPENAI_API_KEY;
const openai = new OpenAIApi(configuration);

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    // Optional: Implement file type validation
    const allowedTypes = ['application/pdf', 'text/plain', 'image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type.'));
    }
  },
}).array('documents', 10); // Limit to 10 files per upload

// Helper function to extract text from files
const extractTextContent = async (filePath, mimeType) => {
  try {
    if (mimeType === 'application/pdf') {
      const pdfParse = require('pdf-parse');
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } else if (mimeType.startsWith('text/')) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return content;
    } else {
      // For image files, you might integrate OCR here
      return '';
    }
  } catch (error) {
    logger.error(`Error extracting content from file: ${error.message}`);
    return '';
  }
};

// Controller to handle document uploads
export const uploadDocuments = async (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      logger.warn(`Multer error: ${err.message}`);
      return res.status(400).json({ status: 'error', message: err.message });
    } else if (err) {
      logger.warn(`Upload error: ${err.message}`);
      return res.status(400).json({ status: 'error', message: err.message });
    }

    const { patientId } = req.body;
    const files = req.files;

    if (!patientId) {
      logger.warn('No patientId provided in the request.');
      return res.status(400).json({ status: 'error', message: 'patientId is required.' });
    }

    try {
      // Validate patient
      const patient = await User.findById(patientId);
      if (!patient || patient.role !== 'patient') {
        logger.warn(`Patient not found or invalid role: ${patientId}`);
        return res.status(404).json({ status: 'error', message: 'Patient not found.' });
      }

      // Verify that the doctor is assigned to this patient
      const doctorId = req.user.userId; // Assuming `user` object has `userId`
      if (patient.doctor.toString() !== doctorId) {
        logger.warn(`Doctor ${doctorId} is not assigned to patient ${patientId}`);
        return res.status(403).json({ status: 'error', message: 'You are not assigned to this patient.' });
      }

      if (!files || files.length === 0) {
        logger.warn('No files uploaded.');
        return res.status(400).json({ status: 'error', message: 'No files uploaded.' });
      }

      const uploadedDocuments = [];

      for (const file of files) {
        const content = await extractTextContent(file.path, file.mimetype);

        if (!content) {
          logger.warn(`No content extracted from file: ${file.originalname}`);
          continue; // Skip files with no extractable content
        }

        // Generate embedding using OpenAI
        const embeddingResponse = await openai.createEmbedding({
          model: 'text-embedding-ada-002', // Choose appropriate model
          input: content,
        });

        const embedding = embeddingResponse.data.data[0].embedding;

        // Generate file URL (assuming you serve /uploads statically)
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

        // Save document to MongoDB
        const document = new Document({
          patientId,
          fileName: file.originalname,
          fileUrl,
          content,
          embedding,
          uploadedBy: doctorId,
        });

        await document.save();
        uploadedDocuments.push(document);
      }

      res.status(200).json({
        status: 'success',
        message: 'Documents uploaded successfully.',
        documents: uploadedDocuments,
      });
    } catch (error) {
      logger.error(`Error uploading documents: ${error.message}`);
      res.status(500).json({ status: 'error', message: 'Failed to upload documents.' });
    }
  });
};
