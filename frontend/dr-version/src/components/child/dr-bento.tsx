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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ActionIconsGrid from "./ActionsGrid";

export function DrBento() {
  return (
    <div className="flex flex-col space-y-6 w-full h-full p-2">
      <BentoGrid>
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            header={item.header}
            icon={item.icon}
            className={`${i === 0 || i === 3 ? "md:col-span-2" : ""}`}
          />
        ))}
      </BentoGrid>
      {/* Centralized ToastContainer */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </div>
  );
}

const SkeletonOne = () => (
  <div className="flex items-center w-full h-32 rounded-xl bg-white p-2">
    <UserProfile />
  </div>
);

const SkeletonTwo = () => (
  <div className="flex items-center w-full h-20 rounded-xl bg-white p-2">
    <SelectPatients />
  </div>
);

const SkeletonThree = () => (
  <div className="flex items-center w-full h-40 rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 p-2">
    {/* Placeholder for Call to Action */}
    <div className="w-full h-full bg-gray-700/30 dark:bg-gray-700/30 rounded-lg flex items-center justify-center">
      <ActionIconsGrid />
    </div>
  </div>
);

const SkeletonFour = () => (
  <div className="flex items-center w-full h-40 rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 p-2">
    <FileUploader />
  </div>
);

const items = [
  {
    title: "Patient Profile",
    description: "",
    header: <SkeletonOne />,
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Select Patient",
    description: "Select to start",
    header: <SkeletonTwo />,
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Call to Action",
    description: "",
    header: <SkeletonThree />,
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "User Chatbot",
    description: "Gives patient chatbot context on Medical documents",
    header: <SkeletonFour />,
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
];
