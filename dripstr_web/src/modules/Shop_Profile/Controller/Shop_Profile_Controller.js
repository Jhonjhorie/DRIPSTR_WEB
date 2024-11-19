import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Merchant from '../View/Login';
import Artist from '../View/ArtistCreate';
import MerchantDashboard from '../View/MerchantDashboard';
  
const ShopProfileController = () => {
  return (
    <Routes>
      <Route path="/MerchantCreate" element={<Merchant />} />
      <Route path="/ArtistCreate" element={<Artist />} />
      <Route path="/MerchantDashboard" element={<MerchantDashboard />} />
    </Routes>
  );
};

export default ShopProfileController;
