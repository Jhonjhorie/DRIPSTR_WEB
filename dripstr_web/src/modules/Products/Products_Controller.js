import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Order from '../Order/View/Order.JS';



const HomeController = () => {
  return (
    <Routes>
      <Route path="/" element={<Order />} />
     </Routes>
  );
};

export default HomeController;
