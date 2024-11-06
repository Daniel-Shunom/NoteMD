import React, { useState, ChangeEvent, FormEvent, useContext } from "react";
import axios from "axios";
import { SelectedPatientContext } from "../../../context/SelectedPatientContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import animation library
import Lottie from "react-lottie";
import successAnimationData from "./successAnimation.json";

// Import the CreatableSelect component
import CreatableSelect from "react-select/creatable";

// Import custom styles for react-select
import "../../custom_styles/prescribeMedForm.css";

const PrescribeMedication: React.FC = () => {
  const { selectedPatient } = useContext(SelectedPatientContext);

  const [medicationName, setMedicationName] = useState<string>("");
  const [dosage, setDosage] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState<boolean>(false);

  // Preset dosages
  const dosageOptions = [
    { value: "250mg", label: "250 mg" },
    { value: "500mg", label: "500 mg" },
    { value: "1g", label: "1 g" },
    { value: "5ml", label: "5 ml" },
    { value: "10ml", label: "10 ml" },
    // Add more standard doses as needed
  ];

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
      const response = await axios.post(
        "/api/medications",
        {
          patientId: selectedPatient.id,
          medicationName,
          dosage,
          instructions,
        },
        {
          withCredentials: true, // Include cookies in the request
        }
      );

      setMessage(response.data.message);
      setMedicationName("");
      setDosage("");
      setInstructions("");
      toast.success("Medication prescribed successfully.");

      // Show success animation
      setShowSuccessAnimation(true);
      setTimeout(() => {
        setShowSuccessAnimation(false);
      }, 3000); // Animation duration
    } catch (error: any) {
      console.error("Error prescribing medication:", error);
      setMessage(error.response?.data?.message || "An error occurred.");
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation options
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: successAnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full h-full flex flex-col bg-white rounded-3xl shadow-lg p-6 space-y-4 overflow-auto"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Prescribe Medication
        </h2>

        {message && (
          <div
            className={`text-center text-sm ${
              message.includes("successfully") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex flex-col flex-grow">
          <label htmlFor="medicationName" className="mb-1 text-sm font-medium text-gray-700">
            Medication Name
          </label>
          <input
            type="text"
            id="medicationName"
            value={medicationName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setMedicationName(e.target.value)}
            placeholder="Enter medication name"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
            required
          />
        </div>

        <div className="flex flex-col flex-grow">
          <label htmlFor="dosage" className="mb-1 text-sm font-medium text-gray-700">
            Dosage
          </label>
          <CreatableSelect
            id="dosage"
            isClearable
            options={dosageOptions}
            value={dosage ? { label: dosage, value: dosage } : null}
            onChange={(newValue: any) => {
              setDosage(newValue ? newValue.value : "");
            }}
            placeholder="Select or enter a dosage"
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        <div className="flex flex-col flex-grow">
          <label htmlFor="instructions" className="mb-1 text-sm font-medium text-gray-700">
            Instructions (Optional)
          </label>
          <textarea
            id="instructions"
            value={instructions}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInstructions(e.target.value)}
            placeholder="Enter any specific instructions"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm resize-none flex-grow"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors flex items-center justify-center ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? (
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
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

        {/* Success Animation */}
        {showSuccessAnimation && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-3xl">
            <Lottie options={defaultOptions} height={200} width={200} />
          </div>
        )}
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
