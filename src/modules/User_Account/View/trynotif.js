import React from 'react';
import { useNotification } from '../../../utils/NotificationContext';

const NotificationDemo = () => {
    const { addNotification } = useNotification();

  const showSuccessNotification = () => {
    addNotification({
      type: 'success',
      title: 'Success',
      message: 'Operation completed successfully!',
    });
  };

  const showErrorNotification = () => {
    addNotification({
      type: 'error',
      title: 'Error',
      message: 'Something went wrong!',
    });
  };

  const showInfoNotification = () => {
    addNotification({
      type: 'info',
      title: 'Information',
      message: 'Here is some useful information.',
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Notification Demo</h1>
      
      <div className="space-y-4">
        <button
          onClick={showSuccessNotification}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mr-4"
        >
          Show Success Notification
        </button>

        <button
          onClick={showErrorNotification}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mr-4"
        >
          Show Error Notification
        </button>

        <button
          onClick={showInfoNotification}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Show Info Notification
        </button>
      </div>

      {/* The notifications will appear automatically through the NotificationProvider */}
    </div>
  );
};

export default NotificationDemo;