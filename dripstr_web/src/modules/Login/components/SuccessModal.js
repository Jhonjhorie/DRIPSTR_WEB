import React from 'react';

const SuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 text-center">
        <div className="flex flex-col items-center justify-center">
          <img 
            src="/emote/success.png" 
            alt="Login Success!" 
            className="w-24 h-24 mb-4" 
          />
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Login Success!
          </h3>
          <p className="text-gray-600 mb-6">
            You have successfully logged in.
          </p>
          <button
            onClick={onClose}
            className="btn btn-primary bg-purple-600 hover:bg-purple-700 border-none"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;