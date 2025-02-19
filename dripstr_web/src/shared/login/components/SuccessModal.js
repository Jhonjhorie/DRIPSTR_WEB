import React from 'react';

const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center">
        <img 
          src="/emote/success.png" 
          alt="Login Success!" 
          className="w-24 h-24 mb-4"
        />
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Login Success!
        </h2>
        <div className="mt-2">
          <div className="loading-spinner"></div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;