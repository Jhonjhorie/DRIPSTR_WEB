import React from 'react';

const ResetPasswordConfirmationModal = ({ isOpen, onClose, email }) => {
  if (!isOpen) return null;

  const handleGmailRedirect = () => {
    window.open('https://mail.google.com', '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <img 
          src="/emote/success.png" 
          alt="Success" 
          className="w-24 h-24 mx-auto mb-4"
        />
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Check Your Email
        </h2>
        
        <p className="text-gray-600 mb-6">
          We've sent password reset instructions to:
          <br />
          <span className="font-semibold text-purple-600">{email}</span>
        </p>

        <div className="space-y-4">
          <button
            onClick={handleGmailRedirect}
            className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
          >
            <img 
              src="/assets/gmail-icon.png" 
              alt="Gmail" 
              className="w-5 h-5 mr-2"
            />
            Open Gmail
          </button>

          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Didn't receive the email? Check your spam folder or try again.
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordConfirmationModal;