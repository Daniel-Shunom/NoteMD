"use client"
// TimeSlot.tsx

import React from 'react';
import { TimeSlot as TimeSlotType } from './types';

interface TimeSlotProps extends TimeSlotType {
  onSelect: (time: string) => void;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ time, status, onSelect }) => (
  <div
    className={`flex items-center gap-2 p-4 rounded-xl transition-all duration-300 transform hover:scale-102 cursor-pointer ${
      status === 'available'
        ? 'bg-blue-50 hover:bg-blue-100'
        : status === 'pending'
        ? 'bg-amber-50'
        : 'bg-gray-50'
    } border-2 border-transparent hover:border-blue-200`}
    onClick={() => status === 'available' && onSelect(time)}
  >
    <svg
      className="w-5 h-5 text-blue-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path strokeWidth="2" d="M12 6v6l4 2" />
    </svg>
    <span className="flex-1 text-gray-700">{time}</span>
    <span
      className={`px-3 py-1 text-sm rounded-full transition-colors duration-300 ${
        status === 'available'
          ? 'bg-blue-100 text-blue-700'
          : status === 'pending'
          ? 'bg-amber-100 text-amber-700'
          : 'bg-gray-100 text-gray-700'
      }`}
    >
      {status}
    </span>
  </div>
);

export default TimeSlot;
