import React from 'react';
import { Calendar, Pill, Activity, FileText } from 'lucide-react';
import StatCard from './statcard';
import { Stat } from '../../ui/Dashboard/types';

const StatsSection: React.FC = () => {
  const stats: Stat[] = [
    { 
      label: "Next Appointment", 
      value: "Nov 29", 
      icon: Calendar, 
      color: "text-indigo-700",  // Darker indigo for better contrast
      bg: "bg-indigo-100",       // Slightly darker background
      borderColor: "border-indigo-200"
    },
    { 
      label: "Active Prescriptions", 
      value: "4 Active", 
      icon: Pill, 
      color: "text-rose-700",    // Changed to rose for better medical association
      bg: "bg-rose-100",         // Matching rose background
      borderColor: "border-rose-200"
    },
    { 
      label: "Health Score", 
      value: "85%", 
      icon: Activity, 
      color: "text-emerald-700", // Darker emerald for better contrast
      bg: "bg-emerald-100",      // Slightly darker background
      borderColor: "border-emerald-200"
    },
    { 
      label: "Pending Reports", 
      value: "2 New", 
      icon: FileText, 
      color: "text-cyan-700",    // Changed to cyan for better distinction
      bg: "bg-cyan-100",         // Matching cyan background
      borderColor: "border-cyan-200"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full rounded-2xl overflow-hidden p-4 bg-gradient-to-r from-white to-slate-100 shadow-lg">
      {stats.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
};

export default StatsSection;