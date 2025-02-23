import React from 'react';
import { Route, Routes } from 'react-router-dom';


import Home from './Home';


const HomeController = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />


     
     </Routes>
  );
};

export default HomeController;
