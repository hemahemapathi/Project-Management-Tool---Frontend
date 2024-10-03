import React, { createContext, useState, useEffect } from 'react';
import { filterExpiredNotifications } from '../services/notificationService.js';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((currentNotifications) => 
        filterExpiredNotifications(currentNotifications)
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addNotification = (notification) => {
    setNotifications((currentNotifications) => [...currentNotifications, notification]);
  };

  const removeNotification = (id) => {
    setNotifications((currentNotifications) => 
      currentNotifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
