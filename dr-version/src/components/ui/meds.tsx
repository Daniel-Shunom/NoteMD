"use client"
// src/components/PrescribeMedication.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface PrescriptionDetails {
  patient: string;
  condition: string;
  medication: string;
}

const PrescribeMedication: React.FC = () => {
  const [patient, setPatient] = useState<string>("");
  const [condition, setCondition] = useState<string>("");
  const [medication, setMedication] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    const prescription: PrescriptionDetails = { patient, condition, medication };

    try {
      // TODO: Replace with actual submission logic, e.g., API call
      console.log("Prescription Details:", prescription);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success("Medication prescribed successfully!");
      
      // Reset form fields
      setPatient("");
      setCondition("");
      setMedication("");
    } catch (error) {
      console.error("Error prescribing medication:", error);
      toast.error("Failed to prescribe medication. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center bg-gray-200 p-1 rounded-2xl">
      <form
        onSubmit={handleSubmit}
        className="w-full h-full max-w-2xl bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg rounded-xl shadow-md p-8 flex flex-col space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">Prescribe Medication</h2>

        <div className="flex flex-col">
          <label htmlFor="patient" className="mb-1 text-sm font-medium text-gray-700">
            Patient Name
          </label>
          <input
            type="text"
            id="patient"
            value={patient}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPatient(e.target.value)}
            placeholder="Enter patient's full name"
            className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="condition" className="mb-1 text-sm font-medium text-gray-700">
            Condition
          </label>
          <select
            id="condition"
            value={condition}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setCondition(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          >
            <option value="" disabled>
              Select a condition
            </option>
            <option value="Hypertension">Hypertension</option>
            <option value="Diabetes">Diabetes</option>
            <option value="Asthma">Asthma</option>
            <option value="Arthritis">Arthritis</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label htmlFor="medication" className="mb-1 text-sm font-medium text-gray-700">
            Medication
          </label>
          <input
            type="text"
            id="medication"
            value={medication}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setMedication(e.target.value)}
            placeholder="Enter medication name"
            className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
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
