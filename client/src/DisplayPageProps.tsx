import React from 'react';

export interface DisplayPageProps {
  notificationSettings: {
    notificationCount: number;
    notificationPosition: number;
    notificationDisappearTime: number;
  };

  setNotificationSettings: React.Dispatch<React.SetStateAction<{
    notificationCount: number;
    notificationPosition: number;
    notificationDisappearTime: number;
  }>>;
}
