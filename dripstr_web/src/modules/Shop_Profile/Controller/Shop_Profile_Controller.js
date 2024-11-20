import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Merchant from '../View/Login';
import Artist from '../View/ArtistCreate';
import MerchantDashboard from '../View/MerchantDashboard';
import MerchantFollowers from '../View/Followers';
import MerchantNotifications from '../View/Notifications';
import MerchantProducts from '../View/Products';

const ShopProfileController = () => {
  return (
    <Routes>
      <Route path="/MerchantCreate" element={<Merchant />} />
      <Route path="/ArtistCreate" element={<Artist />} />
      <Route path="/MerchantDashboard" element={<MerchantDashboard />} />
      <Route path="/MerchantNotifications" element={<MerchantNotifications />} />
      <Route path="/MerchantProducts" element={<MerchantProducts />} />
      <Route path="/MerchantFollowers" element={<MerchantFollowers />} />
     
    </Routes>
  );
};

export default ShopProfileController;
