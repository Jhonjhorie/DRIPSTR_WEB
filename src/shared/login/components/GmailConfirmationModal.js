import React from 'react';

const GmailConfirmationModal = ({ isOpen, onClose, email }) => {
  const openGmail = () => {
    window.open('https://mail.google.com', '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl relative w-[400px]">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
        >
          &times;
        </button>

        <div className="text-center">
          <i className="fas fa-envelope-open-text text-4xl text-purple-600 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Verify Your Email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a verification link to:<br/>
            <span className="font-semibold">{email}</span>
          </p>
          <button
            onClick={openGmail}
            className="btn btn-primary w-full bg-purple-600 hover:bg-purple-700 border-none mb-4"
          >
            Open Gmail
          </button>
          <p className="text-sm text-gray-500">
            Please check your email and click the verification link to complete your registration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GmailConfirmationModal;