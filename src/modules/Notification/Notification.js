import React, { useState, useEffect } from 'react';
import { useNotification } from '../../utils/NotificationContext';
import NotificationItem from './components/NotificationItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faBell, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/constants/supabase';

const Notification = () => {
  const { notifications, setNotifications, fetchUnreadCount } = useNotification();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Add markAllAsRead function outside useEffect
  const markAllAsRead = async () => {
    try {
      setLoading(true);
      const unreadNotifications = notifications.filter(n => !n.read);
      
      if (unreadNotifications.length === 0) {
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', unreadNotifications.map(n => n.id));

      if (error) throw error;

      // Update local state
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      // Update global unread count
      await fetchUnreadCount();

      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update the useEffect to run only once when component mounts
  useEffect(() => {
    const markAllAsRead = async () => {
      try {
        const unreadNotifications = notifications.filter(n => !n.read);
        
        if (unreadNotifications.length === 0) return;

        const { error } = await supabase
          .from('notifications')
          .update({ read: true })
          .in('id', unreadNotifications.map(n => n.id));

        if (error) throw error;

        // Update local state
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        // Update global unread count
        await fetchUnreadCount();
      } catch (error) {
        console.error('Error marking notifications as read:', error);
      }
    };

    // Run immediately when component mounts
    if (notifications.length > 0) {
      markAllAsRead();
    }
  }, []); // Empty dependency array to run only once

  // Delete all notifications
  const deleteAllNotifications = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('notifications')
        .update({ deleted: true })
        .in('id', notifications.map(n => n.id));

      if (error) throw error;

      setNotifications([]);
      await fetchUnreadCount();
    } catch (error) {
      console.error('Error deleting notifications:', error);
    } finally {
      setLoading(false);
    }
  };

// Handle notification click
const handleNotificationClick = (notification) => {
  if (notification.message && notification.message.includes('Order')) {
    navigate('/account/orders');
  }
};

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={markAllAsRead}
            disabled={loading || notifications.every(n => n.read)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2
              ${loading || notifications.every(n => n.read)
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
          >
            <FontAwesomeIcon icon={faCheck} />
            Mark all as read
          </button>
          <button
            onClick={deleteAllNotifications}
            disabled={loading || notifications.length === 0}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2
              ${loading || notifications.length === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
          >
            <FontAwesomeIcon icon={faTrash} />
            Clear all
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faBell} className="text-4xl text-gray-300 mb-3" />
            <p className="text-gray-500">No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={() => handleNotificationClick(notification)}
              onUpdate={(updatedNotification) => {
                setNotifications(notifications.map(n => 
                  n.id === updatedNotification.id ? updatedNotification : n
                ));
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;