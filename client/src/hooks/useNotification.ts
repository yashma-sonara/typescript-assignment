import { useEffect, useState } from 'react';
import { Notification } from '../types';
import { DisplayPageProps } from '../DisplayPageProps';

const useNotificationHandler = ({ notificationSettings, setNotificationSettings }: DisplayPageProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hoveredNotification, setHoveredNotification] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource('http://127.0.0.1:9000/events');

    eventSource.onmessage = (event) => {
      const notification: Notification = JSON.parse(event.data);

      

      // Set timeout to remove the notification after the specified duration
      const timeoutId = setTimeout(() => {
        // Check if the notification is currently being hovered over
        const isHovered = document.getElementById(notification.msg_id)?.matches(':hover');
        if (!isHovered) {
          // Remove the notification only if it's not being hovered over
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
        const newNotifications = [...prevNotifications, notification];
        return newNotifications.slice(Math.max(0, newNotifications.length - notificationSettings.notificationCount));
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

    // Load notifications from localStorage when the component mounts
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    }

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

  const handleClose = (msg_id: string) => {
    // Remove the notification with the given msg_id
    setNotifications((prevNotifications) => prevNotifications.filter((n) => n.msg_id !== msg_id));
  };

  const handleHoverIn = (msg_id: string) => {
    setHoveredNotification(msg_id);
  };

  const handleHoverOut = () => {
    setHoveredNotification(null);
  };

  return { notifications, handleClose, handleHoverIn, handleHoverOut, hoveredNotification };
};

export default useNotificationHandler;
