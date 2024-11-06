"use client"
// DoctorAppointmentScheduler.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Appointment } from './types';
import AppointmentCard from './AppointmentCard';

const DoctorAppointmentScheduler: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('/api/appointments', { withCredentials: true });
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleApprove = async (appointmentId: string) => {
    try {
      await axios.put(`/api/appointments/${appointmentId}/approve`, {}, { withCredentials: true });
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === appointmentId ? { ...appointment, status: 'approved' } : appointment
        )
      );
    } catch (error) {
      console.error('Error approving appointment:', error);
    }
  };

  const handleDecline = async (appointmentId: string) => {
    try {
      await axios.put(`/api/appointments/${appointmentId}/decline`, {}, { withCredentials: true });
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === appointmentId ? { ...appointment, status: 'declined' } : appointment
        )
      );
    } catch (error) {
      console.error('Error declining appointment:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Today's Appointments</h2>
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment._id}
          appointment={appointment}
          onApprove={handleApprove}
          onDecline={handleDecline}
        />
      ))}
    </div>
  );
};

export default DoctorAppointmentScheduler;
