"use client"
// App.tsx
import React from 'react';
import DrugGrid from '../ui/meds'; // Adjust the import path as necessary
import { Pill, Syringe, Droplet, FlaskConical } from 'lucide-react'; // Corrected import

const MedsBay: React.FC = () => {
  // Define the items to display in the grid
  const drugItems = [
    {
      id: 1,
      icon: Pill,
      label: 'Aspirin',
      modalContent: (
        <div>
          <h3 className="text-lg  text-black font-semibold mb-2">Aspirin Details</h3>
          <p className="text-black">
            Aspirin is used to reduce fever and relieve mild to moderate pain from conditions such as muscle aches, toothaches, common cold, and headaches.
          </p>
        </div>
      ),
    },
    {
      id: 2,
      icon: Syringe,
      label: 'Insulin',
      modalContent: (
        <div>
          <h3 className="text-lg text-black font-semibold mb-2">Insulin Details</h3>
          <p className="text-black">
            Insulin is a hormone used to control blood sugar in people with diabetes.
          </p>
        </div>
      ),
    },
    {
      id: 3,
      icon: Droplet,
      label: 'Cough Syrup',
      modalContent: (
        <div>
          <h3 className="text-lg text-black font-semibold mb-2">Cough Syrup Details</h3>
          <p className="text-black">
            Cough syrup is used to treat coughs and relieve throat irritation.
          </p>
        </div>
      ),
    },
    {
      id: 4,
      icon: FlaskConical, // Updated icon
      label: 'Antibiotic',
      modalContent: (
        <div>
          <h3 className="text-lg text-black font-semibold mb-2">Antibiotic Details</h3>
          <p className="text-black">
            Antibiotics are used to treat or prevent some types of bacterial infections.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Active Meds</h1>
      <DrugGrid items={drugItems} />
    </div>
  );
};

export default MedsBay;
