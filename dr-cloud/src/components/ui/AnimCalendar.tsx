"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AnimatedCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateDates = (): (Date | null)[] => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const dates: (Date | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      dates.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }

    return dates;
  };

  const changeMonth = (increment: number): void => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } }
  };

  const dateVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      className="bg-gray-100 p-6 rounded-3xl shadow-lg max-w-md mx-auto"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <div className="flex justify-between items-center mb-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-600 hover:text-gray-800"
          onClick={() => changeMonth(-1)}
        >
          <ChevronLeft size={24} />
        </motion.button>
        <h2 className="text-2xl font-semibold text-gray-800">
          {months[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-600 hover:text-gray-800"
          onClick={() => changeMonth(1)}
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDate.getMonth()}
          className="grid grid-cols-7 gap-2"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          {generateDates().map((date, index) => (
            <motion.div
              key={index}
              variants={dateVariants}
              className={`aspect-square flex items-center justify-center rounded-full text-sm ${
                date ? 'cursor-pointer hover:bg-gray-200' : ''
              } ${isToday(date) ? 'bg-blue-100 text-blue-600' : ''} ${
                selectedDate && date && selectedDate.getTime() === date.getTime()
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700'
              }`}
              onClick={() => date && setSelectedDate(date)}
              whileHover={date ? { scale: 1.1 } : {}}
              whileTap={date ? { scale: 0.9 } : {}}
            >
              {date ? date.getDate() : ''}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default AnimatedCalendar;
