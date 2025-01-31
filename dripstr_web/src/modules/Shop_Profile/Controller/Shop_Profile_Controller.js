import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Merchant from '../View/Login';
import Artist from '../View/ArtistCreate';
import MerchantDashboard from '../View/MerchantDashboard';
import MerchantFollowers from '../View/Followers';
import MerchantNotifications from '../View/Notifications';
import MerchantProducts from '../View/Products';
import MerchantOrders from '../View/Orders';
import Shop_profile from '../View/Shop_profile';
import MerchantMessages from '../View/Messages';
import MerchantVouchers from '../View/Vouchers';
import ArtistDashboard from '../View/Artist/ArtistDashboard';
import ArtistAccount from '../View/Artist/ArtistAccount';
import ArtistOrders from '../View/Artist/ArtistOrders';
import ArtistAddArts from '../View/Artist/AddArt';
import AddItem  from '../View/AddItem';


const ShopProfileController = () => {
  return (
    <Routes>
      <Route path="/MerchantCreate" element={<Merchant />} />
      <Route path="/ArtistCreate" element={<Artist />} />
      <Route path="/MerchantDashboard" element={<MerchantDashboard />} />
      <Route path="/MerchantNotifications" element={<MerchantNotifications />} />
      <Route path="/MerchantMessages" element={<MerchantMessages />} />
      <Route path="/MerchantProducts" element={<MerchantProducts />} />
      <Route path="/MerchantFollowers" element={<MerchantFollowers />} />
      <Route path="/MerchantOrders" element={<MerchantOrders />} />
      <Route path="/Shop_profile" element={<Shop_profile />} />
      <Route path="/MerchantVouchers" element={<MerchantVouchers />} />
      <Route path="/AddItem" element={<AddItem />} />
      <Route path="/Artist/ArtistDashboard" element={<ArtistDashboard />} />
      <Route path="/Artist/ArtistAddArts" element={<ArtistAddArts />} />
      <Route path="/Artist/ArtistAccount" element={<ArtistAccount />} />
      <Route path="/Artist/ArtistOrders" element={<ArtistOrders />} />
        
    </Routes>
  );
};

export default ShopProfileController;
