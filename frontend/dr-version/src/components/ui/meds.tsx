import React, { useState, useEffect, ChangeEvent, FormEvent, useContext } from "react";
import axios from "axios";
import { SelectedPatientContext } from "../../../context/SelectedPatientContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Lottie from "react-lottie";
import successAnimationData from "./successAnimation.json";
import CreatableSelect from "react-select/creatable";
import "../../custom_styles/prescribeMedForm.css";

interface Medication {
  id: string;
  medicationName: string;
  dosage: string;
  instructions?: string;
  prescribedDate: string;
}

const PrescribeMedication: React.FC = () => {
  const { selectedPatient } = useContext(SelectedPatientContext);
  const [activeMedications, setActiveMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  // Existing state variables
  const [medicationName, setMedicationName] = useState<string>("");
  const [dosage, setDosage] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState<boolean>(false);

  const dosageOptions = [
    { value: "250mg", label: "250 mg" },
    { value: "500mg", label: "500 mg" },
    { value: "1g", label: "1 g" },
    { value: "5ml", label: "5 ml" },
    { value: "10ml", label: "10 ml" },
  ];

  // Fetch active medications
  useEffect(() => {
    const fetchMedications = async () => {
      if (!selectedPatient) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/medications/${selectedPatient.id}`,
          { withCredentials: true }
        );
        setActiveMedications(response.data);
      } catch (error) {
        console.error("Error fetching medications:", error);
        toast.error("Failed to fetch active medications");
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, [selectedPatient]);

  // Existing handleSubmit function with medication refresh
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/medications`,
        {
          patientId: selectedPatient.id,
          medicationName,
          dosage,
          instructions,
        },
        {
          withCredentials: true,
        }
      );

      // Refresh medications list
      const updatedMeds = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/medications/${selectedPatient.id}`,
        { withCredentials: true }
      );
      setActiveMedications(updatedMeds.data);

      setMessage(response.data.message);
      setMedicationName("");
      setDosage("");
      setInstructions("");
      toast.success("Medication prescribed successfully.");

      setShowSuccessAnimation(true);
      setTimeout(() => {
        setShowSuccessAnimation(false);
      }, 3000);
    } catch (error: any) {
      console.error("Error prescribing medication:", error);
      setMessage(error.response?.data?.message || "An error occurred.");
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: successAnimationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-6 p-4">
      {/* Active Medications Panel */}
      <div className="w-full md:w-1/2 bg-white rounded-3xl shadow-lg p-6 overflow-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Medications</h2>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : activeMedications.length > 0 ? (
          <div className="space-y-4">
            {activeMedications.map((med) => (
              <div
                key={med.id}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors"
              >
                <h3 className="font-semibold text-lg text-gray-800">{med.medicationName}</h3>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Dosage:</span> {med.dosage}
                  </p>
                  {med.instructions && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Instructions:</span> {med.instructions}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Prescribed: {new Date(med.prescribedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            No active medications for this patient
          </div>
        )}
      </div>

      {/* Prescription Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full md:w-1/2 bg-white rounded-3xl shadow-lg p-6 space-y-4 overflow-auto"
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

        {showSuccessAnimation && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-3xl">
            <Lottie options={defaultOptions} height={200} width={200} />
          </div>
        )}
      </form>

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