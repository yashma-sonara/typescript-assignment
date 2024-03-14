import React, { useState, useEffect } from 'react';
import Header from '../../components/header';
import './SettingsPage.css';

interface SettingsPageProps {
  setNotificationSettings: React.Dispatch<React.SetStateAction<{
    notificationCount: number;
    notificationPosition: number;
    notificationDisappearTime: number;
  }>>;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ setNotificationSettings }) => {
  const [notificationCount, setNotificationCount] = useState<number>(5);
  const [notificationPosition, setNotificationPosition] = useState<number>(1);
  const [notificationDisappearTime, setNotificationDisappearTime] = useState<number>(5000);

  useEffect(() => {
    // Retrieve notification settings from local storage
    const storedSettings = localStorage.getItem('notificationSettings');
    if (storedSettings) {
      const settings = JSON.parse(storedSettings);
      setNotificationCount(settings.notificationCount);
      setNotificationPosition(settings.notificationPosition);
      setNotificationDisappearTime(settings.notificationDisappearTime);
    }
  }, []);
  const handleNotificationCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationCount(Number(event.target.value));
  };

  const handleNotificationPositionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNotificationPosition(Number(event.target.value));
  };

  const handleNotificationDisappearTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationDisappearTime(Number(event.target.value));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const settings = {
      notificationCount,
      notificationPosition,
      notificationDisappearTime
    };
    
    // Update notification settings in local storage
    localStorage.setItem('notificationSettings', JSON.stringify(settings));

    // Update notification settings in parent component
    setNotificationSettings(settings);
  };

  return (
    <div>
      <Header />
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label className='text'>
              Notification Count:
              <input type="number" value={notificationCount} onChange={handleNotificationCountChange} />
            </label>
          </div>
          <div className="input-container">
            <label className='text'>
              Notification Position:
              <select value={notificationPosition} onChange={handleNotificationPositionChange}>
                <option value={1}>Top Left</option>
                <option value={2}>Top Right</option>
                <option value={3}>Bottom Left</option>
                <option value={4}>Bottom Right</option>
              </select>
            </label>
          </div>
          <div className="input-container">
            <label className='text'>
              Notification Disappear Time (milliseconds):
              <input type="number" value={notificationDisappearTime} onChange={handleNotificationDisappearTimeChange} />
            </label>
          </div>
          <button type="submit">Apply Settings</button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
