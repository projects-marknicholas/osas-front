import React from 'react';
import { GraduationCap } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-blue-600" />
          </div>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">Loading...</h2>
        <p className="text-gray-600 mt-2">Please wait while we prepare your dashboard</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;