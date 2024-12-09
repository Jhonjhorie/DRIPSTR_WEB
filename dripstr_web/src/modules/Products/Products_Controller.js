import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Product from './Product';
import Search from './Search';

const HomeController = () => {
  return (
    <Routes>
       <Route path="/*" element={<Product />} />
      <Route path="/search" element={<Search />} />
     </Routes>
  );
};

export default HomeController;
