import React, { useEffect } from 'react';

const Toast = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getAlertConfig = (type) => {
    switch (type) {
      case 'success':
        return {
          class: 'alert-success',
          image: '/emote/happy.png'
        };
      case 'error':
        return {
          class: 'alert-error',
          image: '/emote/sad.png'
        };
      case 'warning':
        return {
          class: 'alert-warning',
          image: '/emote/hmmm.png'
        };
      default:
        return {
          class: 'alert-info',
          image: '/emote/think.png'
        };
    }
  };

  const config = getAlertConfig(type);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center animate-fadeIn relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <img 
          src={config.image} 
          alt={type} 
          className="w-24 h-24 mb-4"
        />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          {message}
        </h2>
      </div>
    </div>
  );
};

export default Toast;