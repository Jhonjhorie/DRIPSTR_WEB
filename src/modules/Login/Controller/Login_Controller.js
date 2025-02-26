import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Account from "../../User_Account/View/CharacterCreation";
import Auth from '../View/Auth.js';
  
 
const HomeController = () => {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/account" element={<Account />} />
    </Routes>
  );
};

export default HomeController;
