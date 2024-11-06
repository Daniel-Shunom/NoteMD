"use client"
// AppointmentScheduler.tsx

import React, { useState } from 'react';
import PatientAppointmentScheduler from './PatientAppointmentScheduler';
import DoctorAppointmentScheduler from './DoctorAppointmentScheduler';

const AppointmentScheduler: React.FC = () => {
  const [view, setView] = useState<'patient' | 'doctor'>('patient');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Medical Appointments</h1>
            <div className="flex p-1 bg-gray-100 rounded-xl">
              <button
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  view === 'patient'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setView('patient')}
              >
                Patient View
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  view === 'doctor'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => setView('doctor')}
              >
                Doctor View
              </button>
            </div>
          </div>
        </div>

        {view === 'patient' && <PatientAppointmentScheduler />}
        {view === 'doctor' && <DoctorAppointmentScheduler />}
      </div>
    </div>
  );
};

export default AppointmentScheduler;
