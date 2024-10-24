import React from 'react';
import { User } from 'lucide-react';

const UserProfile = () => {
  return (
    <div className="w-full p-4 bg-white/20 dark:bg-gray-800/20 rounded-lg backdrop-blur-md backdrop-filter border border-white/30 dark:border-gray-700/30 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
        {/* User Icon Section */}
        <div className="flex-shrink-0 w-full sm:w-auto">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100/30 dark:bg-blue-900/30 backdrop-blur-sm flex items-center justify-center border border-blue-200/50 dark:border-blue-800/50">
            <User className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-300" />
          </div>
        </div>

        {/* User Details Section */}
        <div className="flex-1 min-w-0 bg-green-400/20 backdrop-blur-sm p-3 rounded-lg border border-green-200/50 dark:border-green-800/50">
          <h2 className="text-[clamp(1.125rem,3vw,1.875rem)] font-semibold text-gray-900 dark:text-white truncate">
            Sarah Anderson
          </h2>
          <dl className="mt-4 space-y-2 text-[clamp(0.875rem,2vw,1rem)]">
            <div className="flex flex-wrap items-start text-gray-700 dark:text-gray-300">
              <dt className="font-medium mr-2 flex-shrink-0">Gender:</dt>
              <dd className="flex-1 min-w-0 break-all">Non-binary</dd>
            </div>
            <div className="flex flex-wrap items-start text-gray-700 dark:text-gray-300">
              <dt className="font-medium mr-2 flex-shrink-0">Insurance:</dt>
              <dd className="flex-1 min-w-0">UHG</dd>
            </div>
            <div className="flex flex-wrap items-start text-gray-700 dark:text-gray-300">
              <dt className="font-medium mr-2 flex-shrink-0">ID:</dt>
              <dd className="flex-1 min-w-0">002021682</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;