"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CalendarProps = {
  initialDate?: Date;
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
};

const _Calendar: React.FC<CalendarProps> = ({
  initialDate = new Date(),
  selectedDate: propSelectedDate = null,
  onDateSelect,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    propSelectedDate
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setSelectedDate(propSelectedDate);
  }, [propSelectedDate]);

  const changeMonth = (increment: number): void => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1)
    );
  };

  const generateDates = (): (Date | null)[] => {
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();
    const dates: (Date | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      dates.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      dates.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }

    return dates;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
  };

  return (
    <>
      <motion.div
        className="bg-gray-100 p-4 rounded-xl shadow-lg w-full max-w-md mx-auto border"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={() => changeMonth(-1)}
          onNextMonth={() => changeMonth(1)}
        />
        <DaysOfWeek />
        <DatesGrid
          dates={generateDates()}
          currentDate={currentDate}
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
        />

        {/* Book Schedule Button */}
        <div className="mt-4 flex justify-center">
          <motion.button
            onClick={toggleModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Book Schedule
          </motion.button>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleModal} // Close modal when clicking on overlay
            />

            {/* Modal Content */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-30"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <div
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto relative"
                onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Schedule Appointment</h2>
                  <button
                    onClick={toggleModal}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    ✕
                  </button>
                </div>
                {/* Placeholder for your component */}
                <div className="mt-4">
                  {/* You can replace this div with your component */}
                  <p className="text-gray-600">
                    This is a placeholder for your appointment scheduling component.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

type CalendarHeaderProps = {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
}) => {
  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className="flex justify-between items-center mb-4">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="text-gray-600 hover:text-gray-800"
        onClick={onPrevMonth}
      >
        <ChevronLeft size={24} />
      </motion.button>
      <h2 className="text-xl font-semibold text-gray-800">
        {months[currentDate.getMonth()]} {currentDate.getFullYear()}
      </h2>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="text-gray-600 hover:text-gray-800"
        onClick={onNextMonth}
      >
        <ChevronRight size={24} />
      </motion.button>
    </div>
  );
};

const DaysOfWeek: React.FC = () => {
  const daysOfWeek: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="grid grid-cols-7 gap-2 mb-2">
      {daysOfWeek.map((day) => (
        <div
          key={day}
          className="text-center text-xs sm:text-sm font-medium text-gray-600"
        >
          {day}
        </div>
      ))}
    </div>
  );
};

type DatesGridProps = {
  dates: (Date | null)[];
  currentDate: Date;
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
};

const DatesGrid: React.FC<DatesGridProps> = ({
  dates,
  currentDate,
  selectedDate,
  onDateSelect,
}) => {
  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const dateVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentDate.getMonth()}
        className="grid grid-cols-7 gap-2"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={{
          hidden: { opacity: 0, scale: 0.9 },
          visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
          exit: { opacity: 0, scale: 0.9, transition: { duration: 0.3 } },
        }}
      >
        {dates.map((date, index) => (
          <motion.div
            key={index}
            variants={dateVariants}
            className={`aspect-square flex items-center justify-center rounded-full text-xs sm:text-sm ${
              date ? "cursor-pointer hover:bg-gray-200" : ""
            } ${isToday(date) ? "bg-blue-100 text-blue-600" : ""} ${
              selectedDate && date && selectedDate.getTime() === date.getTime()
                ? "bg-blue-500 text-white"
                : "text-gray-700"
            }`}
            onClick={() => date && onDateSelect(date)}
            whileHover={date ? { scale: 1.05 } : {}}
            whileTap={date ? { scale: 0.95 } : {}}
          >
            {date ? date.getDate() : ""}
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};

export default _Calendar;
