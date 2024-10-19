"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";

interface Event {
  id: number;
  title: string;
}

interface EventsState {
  [key: string]: Event[];
}

// Event Input Form Component
const EventInputForm: React.FC<{ onAddEvent: (eventName: string) => void }> = ({
  onAddEvent,
}) => {
  const [eventName, setEventName] = useState<string>("");

  const handleAddEvent = () => {
    if (eventName.trim() !== "") {
      onAddEvent(eventName);
      setEventName(""); // Clear input after adding
    }
  };

  return (
    <div className="mt-4 flex items-center space-x-2">
      <input
        type="text"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter event name"
      />
      <button
        onClick={handleAddEvent}
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500 transition-colors flex items-center justify-center"
      >
        <Plus size={18} />
      </button>
    </div>
  );
};

const _Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<EventsState>({});

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const addEvent = (date: Date, eventName: string) => {
    const dateStr = format(date, "yyyy-MM-dd");
    setEvents((prev) => ({
      ...prev,
      [dateStr]: [
        ...(prev[dateStr] || []),
        { id: Date.now(), title: eventName },
      ],
    }));
  };

  const handleAddEvent = (eventName: string) => {
    if (selectedDate) addEvent(selectedDate, eventName);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-blue-600 text-white">
        <button
          onClick={prevMonth}
          className="p-2 rounded-full hover:bg-blue-500 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h2 className="text-xl font-semibold">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-full hover:bg-blue-500 transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Days of the Week */}
      <div className="grid grid-cols-7 gap-1 p-4 bg-gray-100">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-gray-600 text-sm font-medium"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 gap-1 px-4 pb-4">
        {days.map((day) => (
          <div
            key={day.toString()}
            className={`relative p-2 text-center cursor-pointer rounded-lg transition-colors ${
              isSameMonth(day, currentDate)
                ? isToday(day)
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "bg-white text-gray-800 hover:bg-gray-200"
                : "bg-gray-50 text-gray-400"
            } ${
              selectedDate && isSameDay(day, selectedDate)
                ? "border border-blue-600"
                : ""
            }`}
            onClick={() => setSelectedDate(day)}
          >
            {format(day, "d")}
            {events[format(day, "yyyy-MM-dd")] && (
              <div className="absolute top-1 right-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Events Section */}
      <div className="p-4 border-t">
        <h3 className="text-lg font-semibold mb-2">
          {selectedDate
            ? format(selectedDate, "EEEE, MMMM d, yyyy")
            : "Select a date"}
        </h3>

        <ul className="space-y-2 max-h-40 overflow-y-auto">
          {selectedDate &&
            events[format(selectedDate, "yyyy-MM-dd")]?.map((event) => (
              <li
                key={event.id}
                className="flex items-center justify-between bg-gray-100 p-2 rounded"
              >
                <span>{event.title}</span>
                <button
                  className="text-red-500 hover:text-red-600"
                  onClick={() => {
                    // Delete event logic
                    const dateStr = format(selectedDate, "yyyy-MM-dd");
                    setEvents((prev) => {
                      const updatedEvents = prev[dateStr].filter(
                        (e) => e.id !== event.id
                      );
                      return {
                        ...prev,
                        [dateStr]: updatedEvents,
                      };
                    });
                  }}
                >
                  Delete
                </button>
              </li>
            ))}
        </ul>

        {selectedDate && <EventInputForm onAddEvent={handleAddEvent} />}
      </div>
    </div>
  );
};

export default _Calendar;
