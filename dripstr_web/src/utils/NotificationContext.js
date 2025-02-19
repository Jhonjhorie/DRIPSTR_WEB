import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '../constants/supabase';
import toast from 'react-hot-toast';

const NotificationContext = createContext();

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return action.payload;
    case 'ADD_NOTIFICATION':
      return [...state, action.payload];
    case 'REMOVE_NOTIFICATION':
      return state.filter((notification) => notification.id !== action.payload);
    case 'CLEAR_ALL':
      return [];
    case 'MARK_ALL_READ':
      return state.map(notification => ({
        ...notification,
        read: true
    }));
    default:
      return state;
  }
};

export const NotificationProvider = ({ children }) => {
    const [notifications, dispatch] = useReducer(notificationReducer, []);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .eq('deleted', false)
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return;
    }

    dispatch({ type: 'SET_NOTIFICATIONS', payload: data });
  };

  const showToast = (type, message) => {
    switch (type) {
      case 'success':
        toast.success(message, {
          duration: 3000,
          position: 'right',
          style: {
            background: '#10B981',
            color: 'white',
          },
        });
        break;
      case 'error':
        toast.error(message, {
          duration: 3000,
          position: 'right',
          style: {
            background: '#EF4444',
            color: 'white',
          },
        });
        break;
      default:
        toast(message, {
          duration: 3000,
          position: 'right',
          icon: 'ℹ️',
        });
    }
  };

  const addNotification = async (notification) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Save to database
    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        user_id: user.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        timestamp: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding notification:', error);
      showToast('error', 'Failed to save notification');
      return;
    }

    // Show toast notification
    showToast(notification.type, notification.message);

    // Update local state
    dispatch({ type: 'ADD_NOTIFICATION', payload: data });
  };

  const markAsRead = async (id) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking notification as read:', error);
      showToast('error', 'Failed to mark as read');
      return;
    }

    dispatch({ 
      type: 'UPDATE_NOTIFICATION', 
      payload: { id, changes: { read: true } } 
    });
    showToast('success', 'Marked as read');
  };

  const removeNotification = async (id) => {
    const { error } = await supabase
      .from('notifications')
      .update({ deleted: true })
      .eq('id', id);

    if (error) {
      console.error('Error deleting notification:', error);
      showToast('error', 'Failed to delete notification');
      return;
    }

    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
    showToast('success', 'Notification deleted');
  };

  const value = {
    notifications,
    dispatch,
    addNotification,
    removeNotification,
    markAsRead,
    fetchNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);