// dr-version/components/PrescribeMedication.tsx

import React, { useState, ChangeEvent, FormEvent, useContext } from "react";
import axios from "axios";
import { SelectedPatientContext, Patient } from '../../../context/SelectedPatientContext';
import { AuthContext } from '../../../context/Authcontext';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const PrescribeMedication: React.FC = () => {
  const { selectedPatient } = useContext(SelectedPatientContext);
  const { auth } = useContext(AuthContext);

  const [medicationName, setMedicationName] = useState<string>("");
  const [dosage, setDosage] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    if (!selectedPatient) {
      setMessage("No patient selected.");
      setIsSubmitting(false);
      return;
    }

    if (!medicationName || !dosage) {
      setMessage("Medication name and dosage are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token"); // Adjust based on your auth implementation

      const response = await axios.post(
        "http://localhost:5000/api/medications",
        {
          patientId: selectedPatient.id,
          medicationName,
          dosage,
          instructions,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
      setMedicationName("");
      setDosage("");
      setInstructions("");
      toast.success("Medication prescribed successfully.");
    } catch (error: any) {
      console.error("Error prescribing medication:", error);
      setMessage(error.response?.data?.message || "An error occurred.");
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-xl shadow-md p-8 flex flex-col space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">Prescribe Medication</h2>

        {message && (
          <div
            className={`text-center text-sm ${
              message.includes("successfully") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex flex-col">
          <label htmlFor="medicationName" className="mb-1 text-sm font-medium text-gray-700">
            Medication Name
          </label>
          <input
            type="text"
            id="medicationName"
            value={medicationName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setMedicationName(e.target.value)}
            placeholder="Enter medication name"
            className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="dosage" className="mb-1 text-sm font-medium text-gray-700">
            Dosage
          </label>
          <input
            type="text"
            id="dosage"
            value={dosage}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDosage(e.target.value)}
            placeholder="e.g., 500mg"
            className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="instructions" className="mb-1 text-sm font-medium text-gray-700">
            Instructions (Optional)
          </label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInstructions(e.target.value)}
            placeholder="Enter any specific instructions"
            className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            rows={3}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`mt-4 py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center justify-center ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? (
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : null}
          {isSubmitting ? "Prescribing..." : "Prescribe"}
        </button>
      </form>

      {/* Toast Notifications */}
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
    </div>
  );
};

export default PrescribeMedication;
