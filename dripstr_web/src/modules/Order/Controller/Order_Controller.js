import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Cart from '../View/Cart';

const CartController = () => {
  return (
    <Routes>
      <Route path="/" element={<Cart />} />
    </Routes>
  );
};

export default CartController;
