"use client"
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash, Edit2, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Calendar/dialog"
import { Button } from "@/components/ui/Calendar/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/Calendar/dropdownmenu"

interface Meeting {
  id: string;
  title: string;
  time: string;
}

const GlassCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [meetings, setMeetings] = useState<{[key: string]: Meeting[]}>({});
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Get calendar data
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  // Navigation handlers
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // Meeting handlers
  const addMeeting = (date: string, title: string, time: string) => {
    const newMeeting = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      time,
    };
    
    setMeetings(prev => ({
      ...prev,
      [date]: [...(prev[date] || []), newMeeting]
    }));
    setIsDialogOpen(false);
  };

  const updateMeeting = (date: string, meeting: Meeting) => {
    setMeetings(prev => ({
      ...prev,
      [date]: prev[date].map(m => m.id === meeting.id ? meeting : m)
    }));
    setEditingMeeting(null);
    setIsDialogOpen(false);
  };

  const deleteMeeting = (date: string, meetingId: string) => {
    setMeetings(prev => ({
      ...prev,
      [date]: prev[date].filter(m => m.id !== meetingId)
    }));
  };

  // Time slots generation
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  // Meeting Form Component
  const MeetingForm = ({ 
    onSubmit, 
    initialData = { title: '', time: '09:00' }
  }: { 
    onSubmit: (title: string, time: string) => void, 
    initialData?: { title: string, time: string } 
  }) => {
    const [title, setTitle] = useState(initialData.title);
    const [time, setTime] = useState(initialData.time);

    return (
      <div className="space-y-4 p-4">
        <div className="space-y-2">
          <label className="text-sm text-gray-200">Meeting Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 rounded bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter meeting title"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-200">Time</label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full p-2 rounded bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {generateTimeSlots().map(timeSlot => (
              <option key={timeSlot} value={timeSlot}>
                {timeSlot}
              </option>
            ))}
          </select>
        </div>
        <Button 
          className="w-full bg-white/10 hover:bg-white/20"
          onClick={() => onSubmit(title, time)}
        >
          {editingMeeting ? 'Update Meeting' : 'Add Meeting'}
        </Button>
      </div>
    );
  };

  // Calendar grid generation
  const renderCalendarDays = () => {
    const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
    const days = [];
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-full w-full bg-white/5 rounded-lg"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = formatDate(date);
      const isToday = new Date().toDateString() === date.toDateString();
      const dayMeetings = meetings[dateString] || [];

      days.push(
        <div 
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`
            h-full w-full p-1 sm:p-2 rounded-lg backdrop-blur-sm transition-all cursor-pointer overflow-hidden
            ${isToday ? 'bg-white/20' : 'bg-white/10 hover:bg-white/15'}
            ${selectedDate?.toDateString() === date.toDateString() ? 'ring-2 ring-blue-400' : ''}
          `}
        >
          <div className="flex justify-between items-start">
            <span className={`text-xs sm:text-sm ${isToday ? 'font-bold' : ''}`}>{day}</span>
            {dayMeetings.length > 0 && (
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            )}
          </div>
          <div className="mt-1 space-y-1">
            {dayMeetings.map((meeting) => (
              <div 
                key={meeting.id} 
                className="text-xs p-1 rounded bg-white/10 group relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-blue-300" />
                  <span>{meeting.time}</span>
                </div>
                <div className="truncate">{meeting.title}</div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 h-6 w-6"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => {
                        setEditingMeeting(meeting);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={() => deleteMeeting(dateString, meeting.id)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return { days, monthNames, dayNames };
  };

  const { days, monthNames, dayNames } = renderCalendarDays();

  return (
    <div className="w-full h-[28rem] p-2 sm:p-4 rounded-xl bg-gray-800 border border-white/10 shadow-xl flex flex-col overflow-hidden">
      {/* Calendar Header */}
      <div className="flex-none">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-light text-white">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4 text-white" />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>
      </div>
      {/* Day Names */}
      <div className="flex-none mt-2">
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map(day => (
            <div key={day} className="text-xs sm:text-sm text-center text-gray-400">
              {day}
            </div>
          ))}
        </div>
      </div>
      {/* Calendar Grid */}
      <div className="flex-grow mt-1 overflow-hidden">
        <div className="grid grid-cols-7 grid-rows-6 gap-1 h-full">
          {days}
        </div>
      </div>
      {/* Add Meeting Button */}
      {selectedDate && (
        <div className="flex-none mt-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-gray-700 hover:bg-gray-600">
                <Plus className="h-4 w-4 mr-2" />
                Add Meeting
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-800 border border-white/10">
              <DialogHeader>
                <DialogTitle>
                  {editingMeeting ? 'Edit Meeting' : 'Add Meeting'} for {selectedDate.toDateString()}
                </DialogTitle>
              </DialogHeader>
              <MeetingForm
                onSubmit={(title, time) => {
                  if (editingMeeting) {
                    updateMeeting(formatDate(selectedDate), {
                      ...editingMeeting,
                      title,
                      time
                    });
                  } else {
                    addMeeting(formatDate(selectedDate), title, time);
                  }
                }}
                initialData={editingMeeting ? {
                  title: editingMeeting.title,
                  time: editingMeeting.time
                } : undefined}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default GlassCalendar;