import React from 'react';
import { Route, Routes } from 'react-router-dom';


import Mall from './Mall';


const HomeController = () => {
  return (
    <Routes>
      <Route path="/" element={<Mall />} />
     </Routes>
  );
};

export default HomeController;
