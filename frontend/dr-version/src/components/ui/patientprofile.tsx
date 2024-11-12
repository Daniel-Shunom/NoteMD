// components/patientprofile.tsx

"use client";
import React, { useContext } from 'react';
import { User, Mail, IdCard } from 'lucide-react'; // Replaced 'Identification' with 'IdCard'
import { SelectedPatientContext } from '../../../context/SelectedPatientContext';

const UserProfile: React.FC = () => {
  const { selectedPatient } = useContext(SelectedPatientContext);

  if (!selectedPatient) {
    return (
      <div className="w-full h-full p-4 bg-white/20 dark:bg-gray-800/20 rounded-lg backdrop-blur-md border border-white/30 dark:border-gray-700/30 shadow-xl flex items-center justify-center">
        <p className="text-gray-300 text-center text-sm">No patient selected. Please select a patient to view details.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-4 bg-white/20 dark:bg-gray-800/20 rounded-lg backdrop-blur-md border border-white/30 dark:border-gray-700/30 shadow-xl">
      <div className="flex items-center">
        {/* User Icon Section */}
        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-blue-100/30 dark:bg-blue-900/30 flex items-center justify-center border border-blue-200/50 dark:border-blue-800/50">
          <User className="w-8 h-8 text-blue-600 dark:text-blue-300" />
        </div>

        {/* User Details Section */}
        <div className="ml-4 flex-1">
          {/* User Name */}
          <h2 className="text-lg font-semibold text-white dark:text-gray-200 mb-2">
            {selectedPatient.name} {selectedPatient.lname || ''}
          </h2>

          {/* User Information */}
          <div className="space-y-1">
            {/* Email */}
            {selectedPatient.email && (
              <div className="flex items-center text-white dark:text-gray-200">
                <Mail className="w-5 h-5 mr-2 text-blue-400" />
                <span className="truncate">{selectedPatient.email}</span>
              </div>
            )}

            {/* ID */}
            {selectedPatient.id && (
              <div className="flex items-center text-white dark:text-gray-200">
                <IdCard className="w-5 h-5 mr-2 text-green-400" />
                <span className="truncate">{selectedPatient.id}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
