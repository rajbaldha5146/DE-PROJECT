import React from 'react';

const LoadingSpinner = ({ fullScreen, small, white }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"></div>
          <div className="mt-4 text-center text-primary-600 font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  const sizeClasses = small ? 'h-5 w-5' : 'h-8 w-8';
  const borderColor = white ? 'border-white/30 border-t-white' : 'border-primary-200 border-t-primary-600';

  return (
    <div className="flex items-center justify-center">
      <div 
        className={`rounded-full border-2 ${borderColor} animate-spin ${sizeClasses}`}
        role="status"
        aria-label="loading"
      ></div>
      {!small && <span className="ml-2 text-gray-700">Loading...</span>}
    </div>
  );
};

export default LoadingSpinner; 