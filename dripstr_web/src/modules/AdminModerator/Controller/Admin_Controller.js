import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Admin from '../View/Admin';
  
const AdminController = () => {
  return (
    <Routes>
      <Route path="/" element={<Admin />} />
      </Routes>
  );
};

export default AdminController;