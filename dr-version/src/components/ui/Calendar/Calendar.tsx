// Calendar.tsx

import React from 'react';

interface CalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDate, setSelectedDate }) => {
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="rounded-xl bg-white p-4">
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="p-2 text-center text-sm text-gray-400 font-medium">
            {day}
          </div>
        ))}
        {days.map((day) => (
          <button
            key={day}
            className={`p-3 text-center rounded-lg transition-all duration-300 hover:bg-blue-50 ${
              selectedDate.getDate() === day ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700'
            }`}
            onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
