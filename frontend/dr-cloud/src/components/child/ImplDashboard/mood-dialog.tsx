// components/ui/Dashboard/MoodDialog.tsx
"use client"

import React from 'react';
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
  setSelectedMood: (mood: number) => void;
}

const MoodDialog: React.FC<MoodDialogProps> = ({ open, setOpen, selectedMood, setSelectedMood }) => {
  const moods = ["🤒", "😔", "😐", "🙂", "😊"];

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="max-w-md bg-white p-6 lg:p-8 rounded-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl lg:text-2xl font-bold text-center mb-6 text-gray-900">
            How are you feeling today?
          </AlertDialogTitle>
          <AlertDialogDescription>
            <div className="flex justify-between mt-4 px-6 lg:px-8">
              {moods.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedMood(i);
                    setOpen(false);
                  }}
                  className={`text-6xl hover:scale-110 transition-transform duration-200 ${
                    selectedMood === i ? 'scale-110' : ''
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-8">
          <AlertDialogCancel className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium">
            Skip for now
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default MoodDialog;
