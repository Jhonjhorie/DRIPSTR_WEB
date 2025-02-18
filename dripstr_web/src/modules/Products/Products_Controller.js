import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Product from './Product';
import Search from './Search';
import PlaceOrder from './PlaceOrder';
import ShopPage from './ShopPage';

const ProductController = () => {
  return (
    <Routes>
       <Route path="/*" element={<Product />} />
       <Route path="/merchant-shop/*" element={<ShopPage />} />
       <Route path="/placeOrder/*" element={<PlaceOrder />} />
     </Routes>
  );
};

export default ProductController;
