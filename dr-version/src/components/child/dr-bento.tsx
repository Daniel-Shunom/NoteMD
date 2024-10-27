// components/DrBento.tsx

import React from "react";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import {
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import UserProfile from "../ui/patientprofile";
import SelectPatients from "../ui/select-patients";
import FileUploader from "../ui/upload-doc";
import { SelectedPatientProvider } from "../../../context/SelectedPatientContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function DrBento() {
  return (
    <SelectedPatientProvider>
      <div className="flex flex-col space-y-6 max-w-4xl mx-auto h-full p-4">
        <BentoGrid>
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              icon={item.icon}
              className={i === 0 || i === 3 ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>
        {/* Centralized ToastContainer */}
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      </div>
    </SelectedPatientProvider>
  );
}

const SkeletonOne = () => (
  <div className="flex items-center w-full h-32 rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 p-2">
    <UserProfile />
  </div>
);

const SkeletonTwo = () => (
  <div className="flex items-center w-full h-40 rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 p-4">
    <SelectPatients />
  </div>
);

const SkeletonThree = () => (
  <div className="flex items-center w-full h-40 rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 p-4">
    {/* Placeholder for Call to Action */}
    <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
      <p className="text-gray-500 dark:text-gray-300">Call to Action Buttons Here</p>
    </div>
  </div>
);

const SkeletonFour = () => (
  <div className="flex items-center w-full h-40 rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 p-4">
    <FileUploader />
  </div>
);

const items = [
  {
    title: "Patient",
    description: "Contains Patient profile",
    header: <SkeletonOne />,
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Hospital",
    description: "Will contain your doctor's hospital location and details",
    header: <SkeletonTwo />,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Call to Action",
    description: "Contain buttons like call, schedule, text.",
    header: <SkeletonThree />,
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Last Visit",
    description: "Contains summary from last visit plus any instructions",
    header: <SkeletonFour />,
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
];
