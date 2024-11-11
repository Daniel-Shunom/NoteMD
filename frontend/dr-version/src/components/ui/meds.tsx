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
  _id: string;
  name: string;
  dosage: string;
  instructions?: string;
  dateAssigned: string;
}

const PrescribeMedication: React.FC = () => {
  const { selectedPatient } = useContext(SelectedPatientContext);
  const [activeMedications, setActiveMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
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
        setActiveMedications(response.data.data.medications);
      } catch (error) {
        console.error("Error fetching medications:", error);
        toast.error("Failed to fetch active medications");
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, [selectedPatient]);

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

      // Fetch updated medications
      const updatedMeds = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/medications/${selectedPatient.id}`,
        { withCredentials: true }
      );
      setActiveMedications(updatedMeds.data.data.medications);

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
    <div>
      {/* Parent Container with Fixed Height */}
      <div
        className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6"
        style={{ height: '28rem' }}
      >
        {/* Header Section */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Medication Management</h1>
          {selectedPatient && (
            <p className="text-gray-600 mt-1">
              Patient: {selectedPatient.name} | ID: {selectedPatient.id}
            </p>
          )}
        </div>

        {/* Content Section */}
        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100%-4rem)]">
          {/* Active Medications Panel */}
          <div className="w-full lg:w-3/5 bg-white rounded-xl shadow-md border border-gray-100 flex flex-col">
            {/* ... Active Medications content remains unchanged ... */}
          </div>

          {/* Prescription Form */}
          <div className="w-full lg:w-2/5 flex flex-col">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 flex flex-col h-full">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">New Prescription</h2>
              </div>

              {/* Adjusted form */}
              <form
                onSubmit={handleSubmit}
                className="p-4 space-y-4 flex-1 overflow-y-auto"
              >
                {message && (
                  <div
                    className={`p-4 rounded-lg ${
                      message.includes("successfully")
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {message}
                  </div>
                )}

                <div className="space-y-4">
                  {/* ... Form fields remain unchanged ... */}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2 px-4 mt-4 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 flex items-center justify-center ${
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
                  {isSubmitting ? "Prescribing..." : "Prescribe Medication"}
                </button>
              </form>

              {showSuccessAnimation && (
                <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-xl">
                  <Lottie options={defaultOptions} height={200} width={200} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
