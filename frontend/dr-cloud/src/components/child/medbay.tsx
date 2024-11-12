"use client";
import React, { useEffect, useId, useRef, useState, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/outside-click";
import { AuthContext } from "../../../context/Authcontext"; // Corrected import

export function MedicationsList() {
  const [medications, setMedications] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const ref = useRef(null);
  const id = useId();
  const [isMobile, setIsMobile] = useState(false);

  const { auth } = useContext(AuthContext);
  const { user } = auth || {};

  console.log('Auth context:', auth);
  console.log('User:', user);

  const truncateText = (text, maxLength = 20) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!auth.loading) {
      if (user && user.id) {
        console.log('User is available, fetching medications');
        fetchMedications(user.id);
      } else {
        console.log('No user found after loading');
        setLoading(false); // Stop loading if no user is found
      }
    } else {
      console.log('Auth is still loading');
    }
  }, [auth.loading, user]);

  const fetchMedications = async (userId) => {
    setLoading(true);
    setError(null);
    console.log('Fetching medications for user:', userId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/medications/:${userId}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      console.log('Received data:', data);
      if (res.ok && data.status === 'success' && data.data) {
        const medicationsData = data.data.medications;
        console.log('Medications data:', medicationsData);
        setMedications(medicationsData);
      } else {
        console.error('Failed to fetch medications:', data.message);
        setError(data.message || 'Failed to fetch medications');
      }
    } catch (error) {
      console.error('Error fetching medications:', error);
      setError(error.message || 'Error fetching medications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  // Animation variants for consistent transitions
  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };

  const modalVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      y: isMobile ? 20 : 0,
    },
    open: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 400,
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: isMobile ? 20 : 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const contentVariants = {
    closed: { opacity: 0, y: 10 },
    open: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.1,
        duration: 0.2
      }
    }
  };

  return (
    <div className="h-full w-full bg-neutral-900/30 rounded-xl p-4">
      {auth.loading || loading ? (
        <p className="text-neutral-200">Loading medications...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : medications.length === 0 ? (
        <p className="text-neutral-200">No medications found.</p>
      ) : (
        <>
          <AnimatePresence>
            {active && typeof active === "object" && (
              <motion.div
                variants={overlayVariants}
                initial="closed"
                animate="open"
                exit="closed"
                transition={{ duration: 0.2 }}
                className={`fixed inset-0 ${isMobile ? 'bg-black/80' : 'bg-black/60 backdrop-blur-sm'} z-10`}
                style={{
                  position: 'fixed',
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: '100vh',
                  touchAction: isMobile ? 'none' : 'auto',
                  overscrollBehavior: 'none'
                }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {active && typeof active === "object" ? (
              <div 
                className="fixed z-[100] p-4"
                style={{
                  position: 'fixed',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  maxWidth: '500px',
                  height: 'auto',
                  maxHeight: isMobile ? '90vh' : 'auto',
                  touchAction: isMobile ? 'none' : 'auto',
                  overscrollBehavior: 'none'
                }}
              >
                <motion.div
                  layoutId={`card-${active.name}-${id}`}
                  ref={ref}
                  className="relative w-full bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
                  variants={modalVariants}
                  initial="closed"
                  animate="open"
                  exit="exit"
                >
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-4 top-4 z-10 flex items-center justify-center bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded-full h-8 w-8 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActive(null);
                    }}
                  >
                    <CloseIcon />
                  </motion.button>

                  <div className={`${isMobile ? 'max-h-[70vh]' : 'max-h-[80vh]'} overflow-y-auto overscroll-contain scrollbar-none`}>
                    <div className="p-6 sm:p-8">
                      <motion.div 
                        className="pr-8"
                        variants={contentVariants}
                        initial="closed"
                        animate="open"
                      >
                        <h3 className="text-xl sm:text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                          {active.name}
                        </h3>
                        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 mt-2">
                          Dosage: {active.dosage}
                        </p>
                        <div className="mt-6">
                          <div className="prose dark:prose-invert max-w-none">
                            <p className="text-neutral-700 dark:text-neutral-300">
                              {active.instructions}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : null}
          </AnimatePresence>

          <div className="h-full overflow-hidden">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-neutral-200">Medications</h2>
              <p className="text-sm text-neutral-400">Scroll to view all medications</p>
            </div>

            <div className="h-[calc(100%-3rem)] overflow-hidden rounded-lg">
              <div className="overflow-x-auto overflow-y-hidden h-full pb-4">
                <div className="grid grid-flow-col md:grid-flow-row auto-cols-[250px] md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {medications.map((medication) => (
                    <motion.div
                      layoutId={`card-${medication.name}-${id}`}
                      key={`medication-${medication.name}-${id}`}
                      onClick={() => setActive(medication)}
                      className="group relative flex flex-col bg-white/5 hover:bg-white/10 dark:bg-neutral-800/50 dark:hover:bg-neutral-800/80 p-5 rounded-xl backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer border border-white/10"
                    >
                      <div className="flex-1 min-h-0 flex flex-col justify-between space-y-4">
                        <div>
                          <motion.h3
                            className="text-lg font-semibold text-neutral-200 truncate"
                            title={medication.name}
                          >
                            {truncateText(medication.name, 20)}
                          </motion.h3>
                          <motion.p
                            className="text-sm text-neutral-400 mt-1 truncate"
                            title={`Dosage: ${medication.dosage}`}
                          >
                            Dosage: {truncateText(medication.dosage, 15)}
                          </motion.p>
                          <p className="text-xs text-neutral-500 mt-2 line-clamp-2" title={medication.instructions}>
                            {medication.instructions}
                          </p>
                        </div>

                        <motion.button
                          className="w-full px-4 py-2 text-sm font-medium rounded-lg bg-green-500/20 hover:bg-green-500/30 text-green-400 transition-colors duration-200 backdrop-blur-sm group-hover:text-green-300"
                        >
                          View Details
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-neutral-800 dark:text-neutral-200"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
