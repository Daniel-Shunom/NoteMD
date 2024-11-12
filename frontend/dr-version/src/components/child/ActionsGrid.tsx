// components/ActionIconsGrid.tsx

"use client";

import React, { useState, useContext } from 'react';
import { Mail, Calendar, Repeat, Trash2, X } from 'lucide-react';
import { SelectedPatientContext, Patient } from '../../../context/SelectedPatientContext';

const ActionIconsGrid: React.FC = () => {
  const { selectedPatient } = useContext(SelectedPatientContext);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeAction, setActiveAction] = useState<string>('');

  // Handler to perform actions based on the clicked icon
  const handleIconClick = (action: string) => {
    if (!selectedPatient) {
      alert('No patient selected. Please select a patient first.');
      return;
    }

    switch (action) {
      case 'Email':
        if (selectedPatient.email) {
          // Open default email client with pre-filled recipient
          window.location.href = `mailto:${selectedPatient.email}`;
        } else {
          alert('Selected patient does not have an email address.');
        }
        break;

      case 'Schedule Appointment':
        if (selectedPatient.email) {
          // Open Google Calendar with pre-filled event details
          const eventTitle = encodeURIComponent(`Appointment with ${selectedPatient.name} ${selectedPatient.lname || ''}`);
          const eventDetails = encodeURIComponent('Please attend the scheduled appointment.');
          const eventLocation = encodeURIComponent('');
          const email = selectedPatient.email;
          const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${eventDetails}&location=${eventLocation}&add=${email}`;

          window.open(googleCalendarUrl, '_blank');
        } else {
          alert('Selected patient does not have an email address.');
        }
        break;

      default:
        // For other actions, open the modal
        setActiveAction(action);
        setIsModalOpen(true);
    }
  };

  // Handler to close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setActiveAction('');
  };

  // List of actions with corresponding icons and colors
  const actions = [
    { id: 1, label: 'Email', icon: <Mail className="w-6 h-6" />, color: 'bg-gradient-to-br from-blue-500 to-indigo-600' },
    { id: 2, label: 'Schedule Appointment', icon: <Calendar className="w-6 h-6" />, color: 'bg-gradient-to-br from-green-500 to-teal-600' },
    { id: 3, label: 'Follow Up', icon: <Repeat className="w-6 h-6" />, color: 'bg-gradient-to-br from-yellow-500 to-orange-600' },
    { id: 4, label: 'Remove Patient', icon: <Trash2 className="w-6 h-6" />, color: 'bg-gradient-to-br from-red-500 to-pink-600' },
  ];

  return (
    <>
      {/* Grid Container */}
      <div className="w-full h-full grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <div
            key={action.id}
            className={`
              flex items-center justify-center 
              ${action.color} 
              rounded-lg 
              shadow-md 
              cursor-pointer 
              transform 
              transition-transform 
              duration-300 
              hover:scale-105 
              hover:shadow-xl 
              flex-grow
            `}
            onClick={() => handleIconClick(action.label)}
            aria-label={action.label}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter') handleIconClick(action.label) }}
          >
            {/* Icon */}
            <div className="text-white">
              {action.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Follow Up and Remove Patient */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          {/* Modal Content */}
          <div className="bg-gray-800 rounded-lg shadow-lg w-11/12 max-w-md p-6 relative">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={handleCloseModal}
              aria-label="Close Modal"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <h2 className="text-xl font-semibold text-white mb-4">
              {activeAction} Action
            </h2>

            {/* Modal Body */}
            <div className="text-gray-300">
              <p>
                {/* Placeholder for modal content */}
                This is a placeholder for the {activeAction} action. You can add your custom content here.
              </p>
            </div>

            {/* Modal Footer (Optional) */}
            {/* <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div> */}
          </div>
        </div>
      )}
    </>
  );
};

export default ActionIconsGrid;
