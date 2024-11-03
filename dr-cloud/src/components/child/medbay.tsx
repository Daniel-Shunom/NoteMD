// src/components/MedsBay.tsx

import React, { useEffect, useState } from 'react';
import { useSocket } from '../../../context/Socketcontext';
import { usePrescription } from '../../../hooks/usePrescriptionhook';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PrescriptionData } from '../../../types/types';
import jwt_decode from "jwt-decode";

interface JwtPayload {
  userId: string;
  // Add other fields if necessary
}

const MedsBay: React.FC = () => {
  const { socket } = useSocket();
  const { prescriptions, setPrescriptions } = usePrescription();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing prescriptions on component mount
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const token = localStorage.getItem('token'); // Ensure the key matches

        if (!token) {
          setError('Authentication token missing.');
          setLoading(false);
          return;
        }

        // Decode token to get userId
        const decoded: JwtPayload = jwt_decode<JwtPayload>(token);
        const userId = decoded.userId;

        const response = await axios.get(
          `http://localhost:5000/api/medications/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data.data.medications as PrescriptionData[];
        setPrescriptions(data);
      } catch (err: any) {
        console.error('Error fetching prescriptions:', err);
        setError(err.response?.data?.message || 'Failed to fetch prescriptions.');
        toast.error(err.response?.data?.message || 'Failed to fetch prescriptions.');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [setPrescriptions]);

  // Listen for new prescriptions in real-time
  useEffect(() => {
    if (!socket) return;

    const handleNewPrescription = (data: PrescriptionData) => {
      setPrescriptions((prev) => [data, ...prev]);
      toast.info(`New prescription received: ${data.medication}`);
    };

    socket.on('new-prescription', handleNewPrescription);

    // Cleanup
    return () => {
      socket.off('new-prescription', handleNewPrescription);
    };
  }, [socket, setPrescriptions]);

  if (loading) {
    return <p className="text-center">Loading prescriptions...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-4">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <h1 className="text-2xl font-bold mb-4">Your Prescriptions</h1>
      {prescriptions.length === 0 ? (
        <p>No prescriptions yet.</p>
      ) : (
        <ul className="space-y-4">
          {prescriptions.map((med: PrescriptionData) => (
            <li key={med.id} className="p-4 bg-white rounded-md shadow">
              <h3 className="text-lg font-semibold">{med.medication}</h3>
              <p className="text-sm text-gray-600">Dosage: {med.dosage}</p>
              {med.instructions && (
                <p className="text-sm text-gray-600">Instructions: {med.instructions}</p>
              )}
              <p className="text-xs text-gray-500">
                Prescribed by: {med.prescribedBy}
              </p>
              <p className="text-xs text-gray-500">
                Assigned on: {new Date(med.dateAssigned).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MedsBay;





/*"use client"
// App.tsx
import React from 'react';
import DrugGrid from '../ui/meds'; // Adjust the import path as necessary
import { Pill, Syringe, Droplet, FlaskConical } from 'lucide-react'; // Corrected import

const MedsBay: React.FC = () => {
  // Define the items to display in the grid
  const drugItems = [
    {
      id: 1,
      icon: Pill,
      label: 'Aspirin',
      modalContent: (
        <div>
          <h3 className="text-lg  text-black font-semibold mb-2">Aspirin Details</h3>
          <p className="text-black">
            Aspirin is used to reduce fever and relieve mild to moderate pain from conditions such as muscle aches, toothaches, common cold, and headaches.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      icon: Syringe,
      label: 'Insulin',
      modalContent: (
        <div>
          <h3 className="text-lg text-black font-semibold mb-2">Insulin Details</h3>
          <p className="text-black">
            Insulin is a hormone used to control blood sugar in people with diabetes.
          </p>
        </div>
      ),
    },
    {
      id: 3,
      icon: Droplet,
      label: 'Cough Syrup',
      modalContent: (
        <div>
          <h3 className="text-lg text-black font-semibold mb-2">Cough Syrup Details</h3>
          <p className="text-black">
            Cough syrup is used to treat coughs and relieve throat irritation.
          </p>
        </div>
      ),
    },
    {
      id: 4,
      icon: FlaskConical, // Updated icon
      label: 'Antibiotic',
      modalContent: (
        <div>
          <h3 className="text-lg text-black font-semibold mb-2">Antibiotic Details</h3>
          <p className="text-black">
            Antibiotics are used to treat or prevent some types of bacterial infections.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Active Meds</h1>
      <DrugGrid items={drugItems} />
    </div>
  );
};

export default MedsBay;*/
