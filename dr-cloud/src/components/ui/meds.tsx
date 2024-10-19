// DrugGrid.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideProps } from 'lucide-react'; // Import LucideProps

interface DrugItem {
  id: number;
  icon: React.ComponentType<LucideProps>;
  label: string;
  modalContent: React.ReactNode;
}

interface DrugGridProps {
  items: DrugItem[];
}

const DrugGrid: React.FC<DrugGridProps> = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState<DrugItem | null>(null);

  const openModal = (item: DrugItem) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-gray-200 p-6 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
          onClick={() => openModal(item)}
        >
          <item.icon size={48} color="currentColor" />
        </div>
      ))}

      <AnimatePresence>
        {selectedItem && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />

            {/* Modal Content */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-30"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <div
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto relative"
                onClick={(e) => e.stopPropagation()} // Prevents closing modal when clicking inside
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{selectedItem.label}</h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    ✕
                  </button>
                </div>
                {/* Placeholder for your component */}
                <div className="mt-4">
                  {/* Replace this with your own component */}
                  {selectedItem.modalContent}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DrugGrid;
