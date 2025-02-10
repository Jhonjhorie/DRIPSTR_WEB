import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Cart from '../View/Cart';
import Order from '../View/Order.JS';

const CartController = () => {
  return (
    <Routes>
      <Route path="/" element={<Cart />} />
      <Route path="/order" element={<Order />} />

    </Routes>
  );
};

export default CartController;
