// AppointmentCard.tsx

import React from 'react';
import { Appointment } from './types';

interface AppointmentCardProps {
  appointment: Appointment;
  onApprove?: (id: string) => void;
  onDecline?: (id: string) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onApprove, onDecline }) => (
  <div className="mb-6 p-6 rounded-2xl bg-white shadow-sm border-2 border-gray-100 hover:border-blue-100 transition-all duration-300">
    <div className="flex justify-between items-start">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-50 rounded-full">
            <svg
              className="w-5 h-5 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeWidth="2" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" strokeWidth="2" />
            </svg>
          </div>
          <span className="font-medium text-gray-800">{appointment.patientName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 ml-1">
          <svg
            className="w-4 h-4 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeWidth="2" d="M12 6v6l4 2" />
          </svg>
          <span>{appointment.time}</span>
        </div>
        <p className="mt-3 text-sm text-gray-600 ml-1">{appointment.reason}</p>
      </div>
      <div className="flex gap-3">
        {appointment.status === 'pending' && onApprove && onDecline && (
          <>
            <button
              className="px-4 py-2 text-sm bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300 shadow-sm hover:shadow"
              onClick={() => onApprove(appointment._id!)}
            >
              Approve
            </button>
            <button
              className="px-4 py-2 text-sm border-2 border-gray-200 rounded-full hover:bg-gray-50 transition-colors duration-300"
              onClick={() => onDecline(appointment._id!)}
            >
              Decline
            </button>
          </>
        )}
        <span
          className={`px-3 py-2 text-sm rounded-full transition-colors duration-300 ${
            appointment.status === 'approved'
              ? 'bg-green-100 text-green-700'
              : appointment.status === 'declined'
              ? 'bg-red-100 text-red-700'
              : 'bg-amber-100 text-amber-700'
          }`}
        >
          {appointment.status}
        </span>
      </div>
    </div>
  </div>
);

export default AppointmentCard;
