import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faCheckCircle, 
    faExclamationCircle, 
    faInfoCircle, 
    faEllipsisVertical,
    faTrash,
    faCheck
  } from '@fortawesome/free-solid-svg-icons';
import { useNotification } from '../../../utils/NotificationContext';

const NotificationItem = ({ notification }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { id, type, message, title, timestamp, read } = notification;
    const { markAsRead, removeNotification } = useNotification();
  
    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsDropdownOpen(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
  
    const handleMarkAsRead = async () => {
        await markAsRead(id);
        setIsDropdownOpen(false);
      };
    
      const handleDelete = async () => {
        await removeNotification(id);
        setIsDropdownOpen(false);
      };
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />;
      case 'error':
        return <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500" />;
      default:
        return <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500" />;
    }
  };

  return (
    <div className={`flex items-center p-4 mb-4 rounded-lg shadow-md ${read ? 'bg-gray-50' : 'bg-white'}`}>
      <div className="flex-shrink-0">{getIcon()}</div>
      <div className="ml-3 flex-1">
        <h4 className={`text-sm font-medium ${read ? 'text-gray-600' : 'text-gray-900'}`}>
          {title}
        </h4>
        <p className="text-sm text-gray-500">{message}</p>
        <span className="text-xs text-gray-400">
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      </div>
      
      {/* Dropdown Menu */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="ml-4 text-gray-400 hover:text-gray-500"
        >
          <FontAwesomeIcon icon={faEllipsisVertical} />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1">
              {!read && (
                <button
                  onClick={handleMarkAsRead}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FontAwesomeIcon icon={faCheck} className="mr-2" />
                  Mark as Read
                </button>
              )}
              <button
                onClick={handleDelete}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                Delete Notification
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;