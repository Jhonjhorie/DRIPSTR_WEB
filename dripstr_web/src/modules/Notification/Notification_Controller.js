import React from 'react';
import { Route, Routes } from 'react-router-dom';


import Notification from './Notification';


const NotificationController = () => {
  return (
    <Routes>
      <Route path="/" element={<Notification />} />
     </Routes>
  );
};

export default NotificationController;
