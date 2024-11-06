// components/patientprofile.tsx

import React, { useContext } from 'react';
import { User } from 'lucide-react';
import { SelectedPatientContext } from '../../../context/SelectedPatientContext';

const UserProfile: React.FC = () => {
  const { selectedPatient } = useContext(SelectedPatientContext);

  if (!selectedPatient) {
    return (
      <div className="w-full h-full p-2 bg-white/20 dark:bg-gray-800/20 rounded-lg backdrop-blur-md backdrop-filter border border-white/30 dark:border-gray-700/30 shadow-xl flex items-center justify-center">
        <p className="text-gray-500 text-center text-sm">No patient selected. Please select a patient to view details.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-2 bg-white/20 dark:bg-gray-800/20 rounded-lg backdrop-blur-md backdrop-filter border border-white/30 dark:border-gray-700/30 shadow-xl">
      <div className="flex h-full">
        {/* User Icon Section */}
        <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100/30 dark:bg-blue-900/30 flex items-center justify-center border border-blue-200/50 dark:border-blue-800/50">
          <User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-300" />
        </div>

        {/* User Details Section */}
        <div className="flex-1 min-w-0 ml-2">
          <div className="bg-green-400/20 backdrop-blur-sm p-2 rounded-lg border border-green-200/50 dark:border-green-800/50 h-full flex flex-col justify-center">
            {/* User Name */}
            <h2 className="text-[clamp(0.9rem,1.8vw,1.2rem)] font-semibold text-gray-900 dark:text-white leading-tight truncate">
              {selectedPatient.name} {selectedPatient.lname || ''}
            </h2>
            
            {/* User Details List */}
            <dl className="mt-1 space-y-0.5 text-[clamp(0.75rem,1.5vw,0.9rem)] leading-tight">
              {/* Age */}
              <div className="flex flex-wrap items-start text-gray-700 dark:text-gray-300">
                <dt className="font-medium mr-1 flex-shrink-0">Age:</dt>
                <dd className="flex-1 min-w-0 truncate">{selectedPatient.age}</dd>
              </div>
              {/* Condition */}
              <div className="flex flex-wrap items-start text-gray-700 dark:text-gray-300">
                <dt className="font-medium mr-1 flex-shrink-0">Condition:</dt>
                <dd className="flex-1 min-w-0 truncate">{selectedPatient.condition}</dd>
              </div>
              {/* Email */}
              {selectedPatient.email && (
                <div className="flex flex-wrap items-start text-gray-700 dark:text-gray-300">
                  <dt className="font-medium mr-1 flex-shrink-0">Email:</dt>
                  <dd className="flex-1 min-w-0 truncate">{selectedPatient.email}</dd>
                </div>
              )}
              {/* ID */}
              {selectedPatient.id && (
                <div className="flex flex-wrap items-start text-gray-700 dark:text-gray-300">
                  <dt className="font-medium mr-1 flex-shrink-0">ID:</dt>
                  <dd className="flex-1 min-w-0 truncate">{selectedPatient.id}</dd>
                </div>
              )}
              {/* Add any additional fields here */}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
