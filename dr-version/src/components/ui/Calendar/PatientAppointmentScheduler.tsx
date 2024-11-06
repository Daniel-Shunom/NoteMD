"use client"
// PatientAppointmentScheduler.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TimeSlot } from './types';
import TimeSlotComponent from './TimeSlotComponent';
import Calendar from './Calendar';

const PatientAppointmentScheduler: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await axios.get(`/api/slots?date=${selectedDate.toISOString()}`);
        setAvailableSlots(response.data);
      } catch (error) {
        console.error('Error fetching available slots:', error);
      }
    };
    fetchAvailableSlots();
  }, [selectedDate]);

  const handleScheduleAppointment = async () => {
    if (!selectedSlot) {
      alert('Please select a time slot.');
      return;
    }
    if (!reason.trim()) {
      alert('Please provide a reason for the appointment.');
      return;
    }
    try {
      const appointmentData = {
        time: selectedSlot,
        date: selectedDate.toISOString(),
        reason,
        doctorId: 'DOCTOR_ID', // Replace with actual doctor ID
      };
      const response = await axios.post('/api/appointments', appointmentData, { withCredentials: true });
      setMessage('Appointment scheduled successfully.');
      setSelectedSlot('');
      setReason('');
      // Refresh available slots
      const slotsResponse = await axios.get(`/api/slots?date=${selectedDate.toISOString()}`);
      setAvailableSlots(slotsResponse.data);
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      alert('Failed to schedule appointment.');
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Select Date</h2>
        <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Available Time Slots</h2>
        <div className="space-y-3">
          {availableSlots.map((slot, index) => (
            <TimeSlotComponent
              key={index}
              {...slot}
              onSelect={(time) => setSelectedSlot(time)}
            />
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Book Appointment</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <select
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300"
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
          >
            <option value="">Select time</option>
            {availableSlots
              .filter((slot) => slot.status === 'available')
              .map((slot, index) => (
                <option key={index} value={slot.time}>
                  {slot.time}
                </option>
              ))}
          </select>
          <input
            type="text"
            placeholder="Reason for appointment"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300"
          />
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-300 transform hover:scale-102 shadow-sm hover:shadow"
            onClick={handleScheduleAppointment}
          >
            Schedule Appointment
          </button>
        </div>
        {message && <p className="mt-4 text-green-600">{message}</p>}
      </div>
    </div>
  );
};

export default PatientAppointmentScheduler;
