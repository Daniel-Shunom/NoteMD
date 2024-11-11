// src/components/MedsBay.tsx

import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PrescriptionData } from '../../../types/types';
import { AuthContext } from '../../../context/Authcontext'; // Import AuthContext

const MedsBay: React.FC = () => {
  const authContext = useContext(AuthContext);

  // Handle the case where AuthContext is undefined
  if (!authContext) {
    throw new Error('AuthContext not found. Make sure you are using AuthProvider.');
  }

  const { auth } = authContext;
  const [prescriptions, setPrescriptions] = useState<PrescriptionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing prescriptions on component mount
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const userId = auth.user!.id; // Get userId from auth context

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/medications/:${userId}`,
          {
            withCredentials: true, // Include cookies in the request
          }
        );

        const data = response.data.data.medications as PrescriptionData[];
        setPrescriptions(data);
      } catch (err: any) {
        console.error('Error fetching prescriptions:', err);
        setError(
          err.response?.data?.message || 'Failed to fetch prescriptions.'
        );
        toast.error(
          err.response?.data?.message || 'Failed to fetch prescriptions.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (auth.user) {
      fetchPrescriptions();
    } else if (!auth.loading) {
      setLoading(false);
    }
  }, [auth.user, auth.loading]);

  // Handle loading and authentication states
  if (auth.loading || loading) {
    return <p className="text-center">Loading prescriptions...</p>;
  }

  if (!auth.user) {
    return (
      <p className="text-center text-red-500">
        You need to be logged in to view this page.
      </p>
    );
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
                <p className="text-sm text-gray-600">
                  Instructions: {med.instructions}
                </p>
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
