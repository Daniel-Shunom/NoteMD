// src/components/CredentialsBox.tsx
"use client";

import React, { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';

interface Credential {
  role: string;
  email: string;
  password: string;
}

const CredentialsBox: React.FC = () => {
  const credentials: Credential[] = [
    {
      role: 'Doctor',
      email: 'dsj11@albion.edu',
      password: 'Daniel.1502@',
    },
    {
      role: 'Patient',
      email: 'jd@jd.com',
      password: 'jdjdjd',
    },
  ];

  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000); // Reset after 2 seconds
  };

  return (
    <div className="w-11/12 max-w-4xl  mt-12 p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-left">Credentials</h3>
      <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
        {credentials.map((cred, index) => (
          <div key={index} className="w-full md:w-1/2 bg-gradient-to-r from-blue-50 to-indigo-100 p-4 rounded-lg shadow-inner">
            <h4 className="text-xl font-medium text-indigo-700 mb-4">{cred.role}</h4>
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Email:</span>
                <button
                  onClick={() => handleCopy(cred.email)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {copied === cred.email ? <FiCheck className="w-5 h-5 text-green-500" /> : <FiCopy className="w-5 h-5" />}
                </button>
              </div>
              <span className="text-md text-gray-800 break-all">{cred.email}</span>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Password:</span>
                <button
                  onClick={() => handleCopy(cred.password)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {copied === cred.password ? <FiCheck className="w-5 h-5 text-green-500" /> : <FiCopy className="w-5 h-5" />}
                </button>
              </div>
              <span className="text-md text-gray-800 break-all">{cred.password}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CredentialsBox;
