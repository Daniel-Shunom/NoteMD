"use client"
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { SelectedPatientContext } from '../../../context/SelectedPatientContext'; // Adjust path as needed
import { toast } from 'react-toastify';

interface Document {
  _id: string;
  patientId: string;
  fileName: string;
  fileUrl: string;
  content: string;
  uploadDate: string;
  uploadedBy: string;
}

const DocumentList: React.FC = () => {
  const { selectedPatient } = useContext(SelectedPatientContext);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPatient) {
      fetchDocuments(selectedPatient.id);
    }
  }, [selectedPatient]);

  const fetchDocuments = async (patientId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/documents/${patientId}`, {
        withCredentials: true,
      });

      setDocuments(response.data.documents);
    } catch (error: any) {
      console.error('Error fetching documents:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch documents.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedPatient) {
    return <div>Please select a patient to view documents.</div>;
  }

  return (
    <div className="w-full h-full">
      <h2 className="text-xl font-semibold mb-4">Documents for {selectedPatient.name}</h2>
      {loading ? (
        <div>Loading documents...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : documents.length === 0 ? (
        <div>No documents found.</div>
      ) : (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li key={doc._id} className="flex items-center justify-between bg-gray-100 p-2 rounded">
              <span>{doc.fileName}</span>
              <a
                href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/documents/${doc._id}/download`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                View
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DocumentList;
