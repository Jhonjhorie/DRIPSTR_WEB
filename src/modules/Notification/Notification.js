import React, { useState, useEffect } from 'react';
import { useNotification } from '../../utils/NotificationContext';
import NotificationItem from './components/NotificationItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTrash, faBell, faSync } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '@/constants/supabase';

const Notification = () => {
  const { notifications, setNotifications, unreadCount, fetchUnreadCount } = useNotification();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      setLoading(true);
      const unreadNotifications = notifications.filter(n => !n.read);
      
      if (unreadNotifications.length === 0) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', unreadNotifications.map(n => n.id));

      if (error) throw error;

      setNotifications(notifications.map(n => ({ ...n, read: true })));
      await fetchUnreadCount(); // Refresh the global unread count
    } catch (error) {
      console.error('Error marking notifications as read:', error);
    } finally {
      setLoading(false);
    }
  };

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
      await fetchUnreadCount(); // Refresh the unread count
    } catch (error) {
      console.error('Error deleting notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh notifications
  const refreshNotifications = async () => {
    try {
      setRefreshing(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('deleted', false)
        .order('timestamp', { ascending: false });

      if (error) throw error;
      
      setNotifications(data);
      await fetchUnreadCount(); // Refresh the global unread count
    } catch (error) {
      console.error('Error refreshing notifications:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs animate-pulse">
              {unreadCount} new
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={refreshNotifications}
            disabled={refreshing}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2
              ${refreshing 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
          >
            <FontAwesomeIcon 
              icon={faSync} 
              className={`${refreshing ? 'animate-spin' : ''}`}
            />
            Refresh
          </button>

          <button
            onClick={markAllAsRead}
            disabled={loading || unreadCount === 0}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2
              ${loading || unreadCount === 0 
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