// components/child/ImplDashboard/mood-dialog.tsx
"use client";

import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/Dashboard/AlertDialog";

interface MoodDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedMood: number | null;
  setSelectedMood: (mood: number | null) => void;
}

const MoodDialog: React.FC<MoodDialogProps> = ({
  open,
  setOpen,
  selectedMood,
  setSelectedMood,
}) => {
  // State to manage the dialog step
  const [isThankYou, setIsThankYou] = useState<boolean>(false);

  // Define mood options with emojis and labels
  const moods = [
    { label: "Very Unhappy", emoji: "😞" },
    { label: "Unhappy", emoji: "😕" },
    { label: "Neutral", emoji: "😐" },
    { label: "Happy", emoji: "🙂" },
    { label: "Very Happy", emoji: "😊" },
  ];

  // Handler for mood selection
  const handleMoodSelect = (moodIndex: number) => {
    setSelectedMood(moodIndex);
    setIsThankYou(true);
    // Optionally, send the mood data to the server here
    // Example:
    // sendMoodData(moodIndex);
  };

  // Handler to close the dialog after thank-you message
  const handleClose = () => {
    setIsThankYou(false);
    setSelectedMood(null);
    setOpen(false);
  };

  return (
    <AlertDialog open={open} setOpen={setOpen}>
      <AlertDialogContent className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 relative">
        {!isThankYou ? (
          <div>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-semibold text-gray-800 text-center">
                How Are You Feeling Today?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription className="mt-4">
              <div className="grid grid-cols-5 gap-4">
                {moods.map((mood, index) => (
                  <button
                    key={index}
                    onClick={() => handleMoodSelect(index)}
                    className="flex flex-col items-center p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-200"
                    aria-label={mood.label}
                  >
                    <span className="text-4xl">{mood.emoji}</span>
                    <span className="mt-2 text-sm text-gray-700">{mood.label}</span>
                  </button>
                ))}
              </div>
            </AlertDialogDescription>
            <AlertDialogFooter className="mt-6">
              <AlertDialogCancel className="w-full bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-200">
                Skip for Now
              </AlertDialogCancel>
            </AlertDialogFooter>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <svg
              className="h-12 w-12 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <AlertDialogTitle className="text-2xl font-semibold text-gray-800 text-center mt-4">
              Thank You!
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-center text-gray-600">
              Thank you for your feedback. We will relay this to your assigned medical care professional!
            </AlertDialogDescription>
            <AlertDialogFooter className="mt-6 w-full">
              <button
                onClick={handleClose}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                Close
              </button>
            </AlertDialogFooter>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MoodDialog;
