// App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NotificationPage1 from "./pages/DisplayPage/DisplayPage";
import NotificationPage2 from "./pages/SettingsPage/SettingsPage";
import DisplayPage from './pages/DisplayPage/DisplayPage';
import SettingsPage from './pages/SettingsPage/SettingsPage';

const App: React.FC = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    notificationCount: 5,
    notificationPosition: 1,
    notificationDisappearTime: 5000
  });

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<DisplayPage notificationSettings={notificationSettings} setNotificationSettings={setNotificationSettings}/>}
        />
        
        <Route
          path="/page2"
          element={<SettingsPage setNotificationSettings={setNotificationSettings} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
