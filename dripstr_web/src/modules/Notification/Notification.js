import React from 'react';
import { useNotification } from '../../utils/NotificationContext';
import NotificationItem from './components/NotificationItem';

const Notification = () => {
  const { notifications } = useNotification();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Notifications</h2>
      </div>
      
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No notifications</p>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;