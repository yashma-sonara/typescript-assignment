import React, { useEffect, useState } from 'react';
import './DisplayPage.css'; 
import Header from '../../components/header';
import { Notification } from '../../types'; 
import { DisplayPageProps } from '../../DisplayPageProps';

const DisplayPage: React.FC<DisplayPageProps> = ({ notificationSettings, setNotificationSettings }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hoveredNotification, setHoveredNotification] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource('http://127.0.0.1:9000/events');

    eventSource.onmessage = (event) => {
      const notification: Notification = JSON.parse(event.data);

      console.log(notificationSettings.notificationCount);
            
      // Set timeout to remove the notification after the specified duration
      const timeoutId = setTimeout(() => {
        // Check if notification is currently being hovered over
        const isHovered = document.getElementById(notification.msg_id)?.matches(':hover');
        if (!isHovered) {
          // Remove notification only if it's not being hovered over
          handleClose(notification.msg_id);
        } else {
          // If it's hovered over, wait and check again later
          const intervalId = setInterval(() => {
            const isHoveredNow = document.getElementById(notification.msg_id)?.matches(':hover');
            if (!isHoveredNow) {
              // Remove the notification if hover is removed
              setTimeout(() => {
                handleClose(notification.msg_id);
              }, notificationSettings.notificationDisappearTime);
              clearInterval(intervalId);
              
            }
          }, 1000); // Check every second
        }
      }, notificationSettings.notificationDisappearTime);

      // Add the new notification to the beginning of the array
      setNotifications((prevNotifications) => {
        // Check if any notifications are being hovered over
        const isAnyHovered = prevNotifications.some((n) => n.msg_id === hoveredNotification);
      
        // If any notification is being hovered over, don't change the position of notifications
        if (isAnyHovered) {
          return [...prevNotifications, notification]; // Add the new notification to the end
        } else {
          // Add the new notification to the beginning while maintaining the max number of notifications
          const newNotifications = [...prevNotifications, notification];
          return newNotifications.slice(Math.max(0, newNotifications.length - notificationSettings.notificationCount));
        }
      });
      


      // Set hover listener for the new notification
      const notificationElement = document.getElementById(notification.msg_id);
      if (notificationElement) {
        notificationElement.addEventListener('mouseenter', () => handleHoverIn(notification.msg_id));
        notificationElement.addEventListener('mouseleave', handleHoverOut);
      }

      // Return cleanup function to remove hover listeners when the notification is removed
      return () => {
        if (notificationElement) {
          notificationElement.removeEventListener('mouseenter', () => handleHoverIn(notification.msg_id));
          notificationElement.removeEventListener('mouseleave', handleHoverOut);
        }
        clearTimeout(timeoutId);
      };
    };
    console.log("notifications displayed:", notifications.length);


    // Load notifications from localStorage when the component mounts
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
      
    }

    // Load notificationsSettings from localStorage when the component mounts
    const storedSettings = localStorage.getItem('notificationSettings');
    if (storedSettings) {
      setNotificationSettings(JSON.parse(storedSettings));
    }

    // Listen for changes in localStorage to keep notifications synchronized
    window.addEventListener('storage', handleStorageChange);

    return () => {
      eventSource.close();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // This effect runs only once on mount

  useEffect(() => {
    // Store notifications in localStorage for synchronization
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    // Store notification settings in local storage whenever they change
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  // Function to handle changes in localStorage
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'notifications' && event.newValue !== null) {
      const updatedNotifications: Notification[] = JSON.parse(event.newValue);
      // Update local state only if the event is triggered by another tab
      if (updatedNotifications !== notifications) {
        setNotifications(updatedNotifications);
      }
    }

    if (event.key === 'notificationSettings' && event.newValue !== null) {
      const updatedSettings = JSON.parse(event.newValue);
      // Update local state only if the event is triggered by another tab
      if (updatedSettings !== notificationSettings) {
        setNotificationSettings(updatedSettings);
      }
    }
  };


  // Remove the notification with the given msg_id
  const handleClose = (msg_id: string) => {
    setNotifications((prevNotifications) => prevNotifications.filter((n) => n.msg_id !== msg_id));
  };

  const handleHoverIn = (msg_id: string) => {
    setHoveredNotification(msg_id);
  };

  const handleHoverOut = () => {
    setHoveredNotification(null);
  };

  const getNotificationPositionStyle = () => {
    switch (notificationSettings.notificationPosition) {
      case 1:
        return 'top-left';
      case 2:
        return 'top-right';
      case 3:
        return 'bottom-left';
      case 4:
        return 'bottom-right';
      default:
        return 'top-left'; // Default to top-left if position is not specified or invalid
    }
  };

  
  return (
    <div className="app-container">
      <Header />
      <div className={`notification-container ${getNotificationPositionStyle()}`}>
        <div className={`notification-inner-container ${getNotificationPositionStyle()}`}>
          
          {notifications.map((notification, index) => (
            <div
              key={notification.msg_id}
              id={notification.msg_id}
              className={`notification ${notification.msg_id === hoveredNotification ? 'hovered' : ''}`}
            >
              <button className="close-btn" onClick={() => handleClose(notification.msg_id)}>X</button>
              <div className="notification-content">
                <p>{notification.msg}</p>
                <small>{new Date(notification.time).toLocaleString()}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DisplayPage;