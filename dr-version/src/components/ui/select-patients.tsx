"use client"
import React, { useState, useEffect } from 'react';
import { User, X, Search, Check } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  isAssigned: boolean; // Indicates if the patient is already assigned
}
interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  isAssigned: boolean;
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
  
  const router = useRouter();

  // Fetch patients from the backend
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get<Patient[]>('http://localhost:5000/api/patients', {
          withCredentials: true, // Include cookies
        });
        setPatients(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch patients.');
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
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle checkbox toggle
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
      alert('Please select at least one patient to assign.');
      return;
    }

    setAssigning(true);
    setError(null);
    try {
      const assignPromises = Array.from(selectedPatients).map(patientId =>
        axios.post('http://localhost:5000/api/assign-patient', { patientId }, { withCredentials: true })
      );
      await Promise.all(assignPromises);
      // Refresh the patient list after assignment
      const response = await axios.get<Patient[]>('http://localhost:5000/api/patients', {
        withCredentials: true,
      });
      setPatients(response.data);
      setSelectedPatients(new Set());
      alert('Selected patients have been assigned successfully.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to assign patients.');
    } finally {
      setAssigning(false);
    }
  };

  // Handle clicking on a patient to begin work
  const handleBeginWork = (patient: Patient) => {
    if (patient.isAssigned) {
      // Navigate to patient detail page or open a new component/modal
      router.push(`/patients/${patient.id}`);
    }
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
        <span className="text-gray-700">
          {selectedPatients.size > 0 ? `${selectedPatients.size} Selected` : 'Select Patients'}
        </span>
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
                    className="w-full p-4 flex items-center space-x-4 hover:bg-blue-50/50 
                             transition-colors border-b border-gray-200/50 last:border-0 cursor-pointer"
                    onClick={() => handleBeginWork(patient)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPatients.has(patient.id)}
                      onChange={(e) => {
                        e.stopPropagation(); // Prevent triggering handleBeginWork
                        handleCheckboxChange(patient.id);
                      }}
                      className="form-checkbox h-5 w-5 text-blue-600"
                      disabled={patient.isAssigned} // Disable if already assigned
                    />
                    <div className="w-10 h-10 rounded-full bg-blue-100/50 flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900">{patient.name}</div>
                      <div className="text-sm text-gray-500">
                        Age: {patient.age} • {patient.condition}
                      </div>
                    </div>
                    {patient.isAssigned && (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
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