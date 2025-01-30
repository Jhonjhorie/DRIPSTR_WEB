import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Product from './Product';
import Search from './Search';
import PlaceOrder from './PlaceOrder';


const HomeController = () => {
  return (
    <Routes>
       <Route path="/product/*" element={<Product />} />
       <Route path="/placeOrder/*" element={<PlaceOrder />} />
      <Route path="/search" element={<Search />} />
     </Routes>
  );
};

export default HomeController;
