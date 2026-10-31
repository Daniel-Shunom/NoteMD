// app/profile/page.tsx

"use client";

import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../../context/Authcontext';
import { useRouter } from 'next/navigation';

const ProfilePage: React.FC = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!authContext) {
      router.push('/');
      return;
    }

    const { auth } = authContext;

    if (!auth.loading && (!auth.user || auth.user.role !== 'doctor')) {
      router.push('/');
    }
  }, [authContext, router]);

  if (!authContext || authContext.auth.loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-700 dark:text-gray-200">Loading...</div>
      </div>
    );
  }

  const user = authContext.auth.user;

  if (!user || user.role !== 'doctor') {
    return null; // Redirecting in useEffect
  }

  const handleLogout = async () => {
    if (authContext) {
      await authContext.logout();
    }
  };

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900 rounded-2xl">
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 md:flex md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                {user.name.charAt(0)}
                {user.lname.charAt(0)}
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                  Dr. {user.name} {user.lname}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                <p className="mt-1 text-gray-600 dark:text-gray-400">License Number: {user.licenseNumber}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 md:mt-0 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Logout
            </button>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">First Name:</span> {user.name}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  <span className="font-medium">Last Name:</span> {user.lname}
                </p>
              </div>
              <div>
                <p className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  <span className="font-medium">Role:</span> Doctor
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  <span className="font-medium">License Number:</span> {user.licenseNumber}
                </p>
              </div>
            </div>
            {/* Additional sections can be added here */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
