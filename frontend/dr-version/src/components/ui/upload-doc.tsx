// components/FileUploader.tsx

import React, { useState, useCallback, useRef, useContext } from 'react';
import clsx from 'clsx';
import {
  Upload,
  X,
  File as FileIcon,
  Image as ImageIcon,
  FileText,
  Music,
  Video,
  Archive,
  Code,
  Database,
} from 'lucide-react';
import { SelectedPatientContext, Patient } from '../../../context/SelectedPatientContext'; // Adjust path as needed
import axios from 'axios';
import { toast } from 'react-toastify';

interface FileWithPreview extends File {
  preview?: string;
}

interface FileUploaderProps {
  // Appearance
  accentColor?: string;
  glassmorphism?: boolean;
  showTypeIndicator?: boolean;
  showFileSize?: boolean;
  compact?: boolean;
  
  // Functionality
  maxFiles?: number;
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in bytes
  
  // Callbacks
  onFilesChange?: (files: File[]) => void;
  onFileRemove?: (file: File) => void;
  onError?: (error: string) => void;
}

const ACCENT_COLORS = [
  'blue',
  'red',
  'green',
  'yellow',
  'purple',
  'pink',
  'indigo',
  'cyan',
  'teal',
  'orange',
];

const getFileTypeIcon = (file: File) => {
  const fileType = file.type.split('/')[0];
  const extension = file.name.split('.').pop()?.toLowerCase();
  
  switch (fileType) {
    case 'image':
      return <ImageIcon className="w-4 h-4 text-emerald-500" />;
    case 'video':
      return <Video className="w-4 h-4 text-purple-500" />;
    case 'audio':
      return <Music className="w-4 h-4 text-pink-500" />;
    case 'text':
      return <FileText className="w-4 h-4 text-blue-500" />;
    default:
      switch (extension) {
        case 'pdf':
          return <FileText className="w-4 h-4 text-red-500" />;
        case 'zip':
        case 'rar':
        case '7z':
          return <Archive className="w-4 h-4 text-yellow-500" />;
        case 'js':
        case 'ts':
        case 'jsx':
        case 'tsx':
        case 'html':
        case 'css':
          return <Code className="w-4 h-4 text-green-500" />;
        case 'sql':
        case 'db':
          return <Database className="w-4 h-4 text-orange-500" />;
        default:
          return <FileIcon className="w-4 h-4 text-gray-500" />;
      }
  }
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const FileUploader: React.FC<FileUploaderProps> = ({
  accentColor = 'blue',
  glassmorphism = true,
  showTypeIndicator = true,
  showFileSize = true,
  compact = false,
  maxFiles = Infinity,
  acceptedFileTypes,
  maxFileSize,
  onFilesChange,
  onFileRemove,
  onError,
}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Loading state
  const [uploadProgress, setUploadProgress] = useState<number>(0); // Progress state
  const [uploadedDocuments, setUploadedDocuments] = useState<any[]>([]); // Store uploaded documents
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Consume the context to get the selected patient
  const { selectedPatient } = useContext(SelectedPatientContext);

  const validateFile = (file: File): boolean => {
    if (maxFileSize && file.size > maxFileSize) {
      onError?.(`File ${file.name} exceeds maximum size of ${formatFileSize(maxFileSize)}`);
      return false;
    }
    
    if (acceptedFileTypes && !acceptedFileTypes.includes(file.type)) {
      onError?.(`File type ${file.type} is not accepted`);
      return false;
    }
    
    return true;
  };

  const handleFiles = (newFiles: FileWithPreview[]) => {
    if (files.length + newFiles.length > maxFiles) {
      onError?.(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles = newFiles.filter(validateFile);
    const updatedFiles = [...files, ...validFiles];
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files) as FileWithPreview[];
    handleFiles(droppedFiles);
  }, [files.length]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files) as FileWithPreview[];
      handleFiles(selectedFiles);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (indexToRemove: number) => {
    const fileToRemove = files[indexToRemove];
    const newFiles = files.filter((_, index) => index !== indexToRemove);
    setFiles(newFiles);
    onFilesChange?.(newFiles);
    onFileRemove?.(fileToRemove);
  };

  // Ensure the accentColor is one of the predefined colors
  const validAccentColor = ACCENT_COLORS.includes(accentColor) ? accentColor : 'blue';

  const uploadFilesToServer = async (filesToUpload: File[]) => {
    if (!selectedPatient) {
      onError?.('No patient selected. Please select a patient before uploading documents.');
      toast.error('No patient selected. Please select a patient before uploading documents.');
      return;
    }
  
    console.log('Selected Patient:', selectedPatient); // Detailed Logging
  
    const patientId = selectedPatient.id //|| selectedPatient.id;
    if (!patientId) {
      onError?.('Selected patient does not have a valid ID.');
      toast.error('Selected patient does not have a valid ID.');
      return;
    }
  
    const formData = new FormData();
    formData.append('patientId', patientId.toString());
    filesToUpload.forEach((file) => {
      formData.append('documents', file);
    });

    try {
      setIsUploading(true); // Start loading
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload-documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true, // Send cookies with the request
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      });
      toast.success('Documents uploaded successfully.');
      setUploadedDocuments(response.data.documents); // Store uploaded documents
      setFiles([]); // Clear files after successful upload
    } catch (error: any) {
      console.error('Error uploading documents:', error);
      const errorMessage = error.response?.data?.message || 'Failed to upload documents.';
      onError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsUploading(false); // End loading
      setUploadProgress(0); // Reset progress
    }
  };

  const handleSubmit = () => {
    uploadFilesToServer(files);
  };

  return (
    <div className="w-full h-full relative">
      {glassmorphism && (
        <div
          className={clsx(
            'absolute inset-0 bg-gradient-to-br -z-10',
            `from-${validAccentColor}-500/20`,
            'to-purple-500/20'
          )}
        />
      )}
      
      <div
        className={clsx(
          'relative w-full h-full',
          glassmorphism ? 'backdrop-blur-md bg-white/30' : 'bg-white',
          'rounded-xl shadow-lg',
          glassmorphism ? 'border border-white/30' : 'border border-gray-200'
        )}
      >
        <div className="flex h-full">
          {/* File List Section */}
          <div className="flex-1 p-2 min-w-0 flex flex-col">
            <div
              className={clsx(
                'flex-1',
                glassmorphism ? 'backdrop-blur-sm bg-white/40' : 'bg-gray-50',
                'rounded-lg',
                'max-h-64', // Set maximum height
                'overflow-y-auto', // Enable vertical scrolling
              )}
            >
              <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {files.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-600 text-sm">No files uploaded yet</p>
                  </div>
                ) : (
                  <ul className={`p-1 ${compact ? 'space-y-1' : 'space-y-2'}`}>
                    {files.map((file, index) => (
                      <li
                        key={index}
                        className={clsx(
                          'flex items-center gap-2',
                          compact ? 'p-1.5' : 'p-2',
                          glassmorphism ? 'bg-white/50' : 'bg-white',
                          'rounded-md hover:bg-white/70',
                          'transition-all duration-300',
                          glassmorphism ? 'backdrop-blur-sm' : '',
                          'group'
                        )}
                      >
                        {showTypeIndicator && getFileTypeIcon(file)}
                        <span className={`flex-1 truncate text-gray-700 ${compact ? 'text-xs' : 'text-sm'}`}>
                          {file.name}
                        </span>
                        {showFileSize && (
                          <span className={`text-gray-400 ${compact ? 'text-xs' : 'text-sm'}`}>
                            {formatFileSize(file.size)}
                          </span>
                        )}
                        <button
                          onClick={() => removeFile(index)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded-full transition-all duration-300"
                          aria-label="Remove file"
                        >
                          <X className="w-3 h-3 text-red-500" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="w-40 p-2 flex-shrink-0 flex flex-col items-center">
            <div
              className={clsx(
                'relative rounded-lg border-2 border-dashed cursor-pointer w-full',
                'transition-all duration-300 ease-in-out flex-grow',
                isDragging
                  ? `border-${validAccentColor}-400 bg-${validAccentColor}-50/50`
                  : 'border-gray-300/50 hover:border-gray-400/50 bg-white/30 hover:bg-white/40',
                glassmorphism ? 'backdrop-blur-sm' : ''
              )}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={handleUploadClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileInput}
                accept={acceptedFileTypes?.join(',')}
                className="hidden"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3">
                <div 
                  className={clsx(
                    'transform transition-all duration-300',
                    isDragging ? 'scale-110 rotate-12' : 'scale-100 rotate-0'
                  )}
                >
                  <Upload className={clsx(`w-6 h-6 text-${validAccentColor}-500`)} />
                </div>
                <p className="text-xs text-gray-600 text-center">
                  Drop files here or click to upload
                </p>
                {(acceptedFileTypes || maxFileSize) && (
                  <div className="text-[10px] text-gray-400 text-center">
                    {acceptedFileTypes && <p>Accepted: {acceptedFileTypes.join(', ')}</p>}
                    {maxFileSize && <p>Max size: {formatFileSize(maxFileSize)}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Buttons Section */}
            <div className="mt-2 w-full flex justify-between space-x-2">
              <button
                onClick={() => setFiles([])}
                className="flex-1 px-2 py-1 bg-gray-200/50 text-gray-700 rounded-lg hover:bg-gray-300/50 transition-colors"
                disabled={isUploading} // Disable during upload
              >
                Clear
              </button>
              <button
                onClick={handleSubmit}
                disabled={files.length === 0 || !selectedPatient || isUploading}
                className={clsx(
                  'flex-1 px-2 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors',
                  (files.length === 0 || !selectedPatient || isUploading) && 'opacity-50 cursor-not-allowed'
                )}
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>

        {/* Optional: Progress Bar */}
        {isUploading && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
