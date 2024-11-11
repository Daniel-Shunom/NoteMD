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
    <div className="w-full h-[30rem] overflow-hidden bg-gray-50 p-6 rounded-xl shadow-lg">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Medication Management</h1>
        {selectedPatient && (
          <p className="text-gray-600 mt-2">
            Patient: {selectedPatient.name} | ID: {selectedPatient.id}
          </p>
        )}
      </div>

      {/* Flex Container with Full Height */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 h-full">
        {/* Active Medications Panel */}
        <div className="w-full lg:w-3/5 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-6 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Active Medications</h2>
              <span className="bg-indigo-50 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">
                {activeMedications.length} Active
              </span>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto flex-grow">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : activeMedications.length > 0 ? (
              <div className="space-y-4">
                {activeMedications.map((med) => (
                  <div
                    key={med._id}
                    className="group relative bg-white rounded-lg border border-gray-200 hover:border-indigo-200 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{med.name}</h3>
                          <div className="mt-1 space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                {med.dosage}
                              </span>
                              <span className="text-gray-500 text-sm">
                                Prescribed {new Date(med.dateAssigned).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {med.instructions && (
                        <div className="mt-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                          {med.instructions}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No active medications</div>
                <p className="text-gray-500 text-sm">
                  Prescriptions will appear here once added
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Prescription Form */}
        <div className="w-full lg:w-2/5 flex flex-col overflow-y-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col flex-grow">
            {/* Form Header */}
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">New Prescription</h2>
            </div>

            {/* Scrollable Form Content */}
            <div className="p-6 overflow-y-auto flex-grow">
              <form onSubmit={handleSubmit} className="space-y-6 pb-5">
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

                <div>
                  <label
                    htmlFor="medicationName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Medication Name
                  </label>
                  <input
                    type="text"
                    id="medicationName"
                    value={medicationName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setMedicationName(e.target.value)
                    }
                    placeholder="Enter medication name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-2">
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
                    placeholder="Select"
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>

                <div>
                  <label
                    htmlFor="instructions"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Instructions (Optional)
                  </label>
                  <textarea
                    id="instructions"
                    value={instructions}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                      setInstructions(e.target.value)
                    }
                    placeholder="Enter any specific instructions"
                    rows={1}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 bg-indigo-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 flex items-center justify-center ${
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
            </div>

            {/* Success Animation */}
            {showSuccessAnimation && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-xl">
                <Lottie options={defaultOptions} height={200} width={200} />
              </div>
            )}
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
