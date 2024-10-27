// components/select-patients.tsx

"use client";

import React, { useState, useEffect, useContext } from 'react';
import { User, X, Search, Check } from 'lucide-react';
import api from '@/lib/api'; // Centralized Axios instance
import { toast } from 'react-toastify';
import { SelectedPatientContext } from '../../../context/SelectedPatientContext';

interface Patient {
  id: string;
  name: string;
  lname?: string;
  age: number;
  condition: string;
  isAssigned: boolean;
  email?: string;
}

interface SelectPatientsProps {
  onSelect?: (patient: Patient) => void;
  initialPatient?: Patient | null;
}

const SelectPatients: React.FC<SelectPatientsProps> = ({ onSelect, initialPatient = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPatients, setSelectedPatients] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Consume the context
  const { setSelectedPatient, selectedPatient } = useContext(SelectedPatientContext);

  // Fetch patients from the backend
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<Patient[]>('/patients');
        setPatients(response.data);
      } catch (err: any) {
        console.error('Error fetching patients:', err);
        setError(err.response?.data?.message || 'Failed to fetch patients.');
        toast.error(err.response?.data?.message || 'Failed to fetch patients.');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchPatients();
    }
  }, [isOpen]);

  // Filter patients based on search query
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (patient.lname && patient.lname.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle checkbox toggle for assignment
  const handleCheckboxChange = (patientId: string) => {
    setSelectedPatients(prev => {
      const newSet = new Set(prev);
      if (newSet.has(patientId)) {
        newSet.delete(patientId);
      } else {
        newSet.add(patientId);
      }
      return newSet;
    });
  };

  // Handle assigning selected patients
  const handleAssignPatients = async () => {
    if (selectedPatients.size === 0) {
      toast.warn('Please select at least one patient to assign.');
      return;
    }

    setAssigning(true);
    setError(null);
    try {
      const assignPromises = Array.from(selectedPatients).map(patientId =>
        api.post('/assign-patient', { patientId })
      );
      await Promise.all(assignPromises);
      // Refresh the patient list after assignment
      const response = await api.get<Patient[]>('/patients');
      setPatients(response.data);
      setSelectedPatients(new Set());
      toast.success('Selected patients have been assigned successfully.');
    } catch (err: any) {
      console.error('Error assigning patients:', err);
      setError(err.response?.data?.message || 'Failed to assign patients.');
      toast.error(err.response?.data?.message || 'Failed to assign patients.');
    } finally {
      setAssigning(false);
    }
  };

  // Handle selecting a patient to work on
  const handleSelectPatientForWork = (patient: Patient) => {
    setSelectedPatient(patient);
    toast.success(`Selected ${patient.name} to work on.`);
    setIsOpen(false); // Close the modal after selection
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-md border border-white/30 
                 rounded-lg shadow-lg hover:bg-white/30 transition-all duration-300"
      >
        <User className="w-5 h-5 text-blue-600" />
        <span className="text-gray-700">Select Patients</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          {/* Modal Content */}
          <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl 
                        border border-white/50 transform transition-all duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
              <h2 className="text-xl font-semibold text-gray-800">Select Patients</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-200/50 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-gray-200/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/50 border border-gray-200/50 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            {/* Patient List */}
            <div className="max-h-[400px] overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading patients...</div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
              ) : filteredPatients.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No patients found.</div>
              ) : (
                filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`w-full p-4 flex items-center space-x-4 hover:bg-blue-50/50 
                             transition-colors border-b border-gray-200/50 cursor-pointer
                             ${selectedPatient?.id === patient.id ? 'bg-blue-100/50' : ''}`}
                    onClick={() => handleSelectPatientForWork(patient)}
                  >
                    {/* Checkbox for Assignment */}
                    <input
                      type="checkbox"
                      checked={selectedPatients.has(patient.id)}
                      onChange={(e) => {
                        e.stopPropagation(); // Prevent triggering selection for work
                        handleCheckboxChange(patient.id);
                      }}
                      className="form-checkbox h-5 w-5 text-blue-600 flex-shrink-0"
                      disabled={patient.isAssigned && patient.id !== selectedPatient?.id} // Disable if assigned to another doctor
                    />

                    {/* User Icon */}
                    <div className="w-10 h-10 rounded-full bg-blue-100/50 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>

                    {/* Patient Details */}
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900 truncate">
                        {patient.name} {patient.lname || ''}
                      </div>
                      <div className="text-sm text-gray-500">
                        Age: {patient.age} • {patient.condition}
                      </div>
                    </div>

                    {/* Assigned Indicator Container */}
                    <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                      {patient.isAssigned ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        // Placeholder to reserve space
                        <span className="w-4 h-4"></span>
                      )}
                    </div>

                    {/* Button to Select for Work */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering other click events
                        handleSelectPatientForWork(patient);
                      }}
                      className={`ml-2 px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm
                                 ${!patient.isAssigned && 'bg-gray-400 cursor-not-allowed'}`}
                      disabled={!patient.isAssigned}
                    >
                      Work On
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Assign Button */}
            <div className="p-4 border-t border-gray-200/50 flex justify-end space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-200/50 text-gray-700 rounded-lg hover:bg-gray-300/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignPatients}
                disabled={assigning || selectedPatients.size === 0}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors 
                           ${assigning || selectedPatients.size === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {assigning ? 'Assigning...' : 'Assign Selected'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectPatients;
