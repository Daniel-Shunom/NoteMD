"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Stethoscope, Pill, Bone, Brain } from 'lucide-react';

// Mock data for scheduled visits (now only using the icon and id)
const scheduledVisits = [
  { id: 1, icon: Stethoscope },
  { id: 2, icon: Pill },
  { id: 3, icon: Bone },
  { id: 4, icon: Brain },
];

const ScheduledVisits = () => {
  // Set the state to allow number or null
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <motion.div
      className="bg-gray-100 p-6 rounded-xl shadow-lg max-w-md mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
        <Calendar className="mr-2" />
        Upcoming Visits
      </h2>
      <div className="flex justify-around items-center">
        {scheduledVisits.map((visit) => (
          <motion.div
            key={visit.id}
            className="bg-white p-4 rounded-full shadow flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 360 }}
            onHoverStart={() => setHoveredId(visit.id)}
            onHoverEnd={() => setHoveredId(null)}
          >
            <motion.div
              className="text-blue-500"
              animate={{ 
                scale: hoveredId === visit.id ? [1, 1.2, 1] : 1,
              }}
              transition={{ duration: 0.3, repeat: hoveredId === visit.id ? Infinity : 0 }}
            >
              <visit.icon size={28} />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ScheduledVisits;
