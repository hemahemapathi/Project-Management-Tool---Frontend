import React from 'react';
import { useNotifications } from '../../hooks/useNotification';

const Notification = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div key={notification.id} className={`notification ${notification.type}`}>
          <p>{notification.message}</p>
          <button onClick={() => removeNotification(notification.id)}>Dismiss</button>
        </div>
      ))}
    </div>
  );
};

export default Notification;
