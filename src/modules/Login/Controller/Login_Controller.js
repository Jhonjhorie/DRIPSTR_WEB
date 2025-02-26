import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Account from "../../User_Account/View/CharacterCreation";
import Auth from '../View/Auth.js';
import ResetPassword from '../View/ResetPassword.js';

  
 
const HomeController = () => {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/account" element={<Account />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
};

export default HomeController;
