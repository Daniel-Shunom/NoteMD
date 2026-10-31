// src/components/DoctorLoginBox.tsx
"use client";

import React, { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';

const DoctorLoginBox: React.FC = () => {
  const email = 'doc@doc.com';
  const password = 'docdoc';

  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000); // Reset after 2 seconds
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-lg shadow-lg mb-6">
      <h4 className="text-2xl font-semibold text-indigo-700 mb-4 text-center">Demo</h4>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Email:</span>
          <button
            onClick={() => handleCopy(email)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Copy Email"
          >
            {copied === email ? (
              <FiCheck className="w-5 h-5 text-green-500" />
            ) : (
              <FiCopy className="w-5 h-5" />
            )}
          </button>
        </div>
        <span className="text-md text-gray-800 break-all mt-1">{email}</span>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Password:</span>
          <button
            onClick={() => handleCopy(password)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Copy Password"
          >
            {copied === password ? (
              <FiCheck className="w-5 h-5 text-green-500" />
            ) : (
              <FiCopy className="w-5 h-5" />
            )}
          </button>
        </div>
        <span className="text-md text-gray-800 break-all mt-1">{password}</span>
      </div>
    </div>
  );
};

export default DoctorLoginBox;
