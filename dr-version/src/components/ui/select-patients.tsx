"use client"
import React, { useState } from 'react';
import { User, X, Search, Check } from 'lucide-react';

interface Patient {
  id: number;
  name: string;
  age: number;
  condition: string;
}

interface SelectPatientsProps {
  onSelect?: (patient: Patient) => void;
  initialPatient?: Patient | null;
}

const SelectPatients: React.FC<SelectPatientsProps> = ({ onSelect, initialPatient = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(initialPatient);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample patient data
  const patients: Patient[] = [
    { id: 1, name: 'Sarah Anderson', age: 45, condition: 'Diabetes Type 2' },
    { id: 2, name: 'Michael Chen', age: 32, condition: 'Hypertension' },
    { id: 3, name: 'Emma Davis', age: 28, condition: 'Asthma' },
    { id: 4, name: 'James Wilson', age: 56, condition: 'Arthritis' },
    { id: 5, name: 'Maria Garcia', age: 39, condition: 'Migraine' },
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    onSelect?.(patient);
    setIsOpen(false);
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
          {selectedPatient ? selectedPatient.name : 'Select Patient'}
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
              <h2 className="text-xl font-semibold text-gray-800">Select Patient</h2>
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
              {filteredPatients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => handleSelectPatient(patient)}
                  className="w-full p-4 flex items-center space-x-4 hover:bg-blue-50/50 
                           transition-colors border-b border-gray-200/50 last:border-0"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100/50 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">{patient.name}</div>
                    <div className="text-sm text-gray-500">
                      Age: {patient.age} • {patient.condition}
                    </div>
                  </div>
                  {selectedPatient?.id === patient.id && (
                    <Check className="w-5 h-5 text-green-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectPatients;