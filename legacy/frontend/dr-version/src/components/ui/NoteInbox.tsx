"use client"

import React, { useState } from 'react';
import { Search, Calendar, Star, StarOff, Clock, User, Filter } from 'lucide-react';

interface Note {
  id: number;
  patient: string;
  date: string;
  time: string;
  type: string;
  preview: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  doctor: string;
}

interface StarredNotes {
  [key: number]: boolean;
}

const notes: Note[] = [
  {
    id: 1,
    patient: "Sarah Johnson",
    date: "2024-11-03",
    time: "14:30",
    type: "Follow-up",
    preview: "Patient reports improvement in sleep patterns following new medication regimen...",
    content: "Patient reports improvement in sleep patterns following new medication regimen. Blood pressure readings: 120/80. Continue current prescription for 30 days. Schedule follow-up in 2 weeks.",
    priority: "medium",
    doctor: "Dr. Emily Chen"
  },
  {
    id: 2,
    patient: "Michael Rodriguez",
    date: "2024-11-03",
    time: "11:15",
    type: "Initial Consultation",
    preview: "New patient presenting with chronic lower back pain. Initial assessment shows...",
    content: "New patient presenting with chronic lower back pain. Initial assessment shows possible disc herniation. Ordered MRI scan. Prescribed pain management routine and physical therapy exercises.",
    priority: "high",
    doctor: "Dr. James Wilson"
  },
  {
    id: 3,
    patient: "Emma Thompson",
    date: "2024-11-03",
    time: "09:45",
    type: "Lab Review",
    preview: "Blood work results indicate improved cholesterol levels. LDL decreased by...",
    content: "Blood work results indicate improved cholesterol levels. LDL decreased by 15%. HDL within normal range. Continue current statin medication. Dietary changes showing positive impact.",
    priority: "low",
    doctor: "Dr. Emily Chen"
  }
];

const DoctorNotesInbox: React.FC = () => {
  const [selectedNote, setSelectedNote] = useState<Note>(notes[0]);
  const [starredNotes, setStarredNotes] = useState<StarredNotes>({});

  const getPriorityColor = (priority: Note['priority']): string => {
    const colors: Record<Note['priority'], string> = {
      low: "bg-blue-100 text-blue-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800"
    };
    return colors[priority];
  };

  const toggleStar = (noteId: number) => {
    setStarredNotes(prev => ({
      ...prev,
      [noteId]: !prev[noteId]
    }));
  };

  return (
    // Main container that will fill parent's dimensions
    <div className="h-[28rem] w-full flex flex-col bg-gray-50 rounded-lg overflow-hidden">
      {/* Fixed-height header */}
      <div className="shrink-0 p-4 bg-white border-b flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Medical Notes Inbox</h1>
        <div className="flex gap-2">
          <button 
            type="button"
            className="inline-flex items-center px-3 py-2 text-sm font-medium border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button 
            type="button"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700"
          >
            <Clock className="h-4 w-4 mr-2" />
            Recent
          </button>
        </div>
      </div>

      {/* Flexible content area */}
      <div className="flex flex-1 min-h-0">
        {/* Left panel - Notes list */}
        <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col min-h-0 bg-white border-r">
          {/* Fixed-height search bar */}
          <div className="shrink-0 p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search notes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Scrollable notes list */}
          <div className="flex-1 overflow-y-auto">
            {notes.map(note => (
              <div
                key={note.id}
                className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 border-b ${
                  selectedNote?.id === note.id ? 'bg-gray-50' : ''
                }`}
                onClick={() => setSelectedNote(note)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{note.patient}</h3>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(note.priority)}`}>
                      {note.priority}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(note.id);
                      }}
                      className="text-gray-400 hover:text-yellow-400"
                    >
                      {starredNotes[note.id] ? (
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <span className="px-2 py-1 text-xs font-medium border rounded-full">
                    {note.type}
                  </span>
                  <span>•</span>
                  <span>{note.time}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{note.preview}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel - Note details */}
        <div className="hidden md:flex flex-1 flex-col min-h-0 bg-white">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {selectedNote.patient}
                </h2>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {selectedNote.doctor}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {selectedNote.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {selectedNote.time}
                  </div>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedNote.priority)}`}>
                {selectedNote.priority}
              </span>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{selectedNote.content}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorNotesInbox;