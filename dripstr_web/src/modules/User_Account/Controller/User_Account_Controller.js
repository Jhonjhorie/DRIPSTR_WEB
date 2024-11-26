import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Dashboard from '../View/Dashboard';  
import Profile from '../View/Profile';  
import AddressBook from '../View/Address';  
import PaymentOptions from '../View/Payment';  
import Orders from '../View/Orders';  
import Cancellations from '../View/Cancellations';  
import Reviews from '../View/Reviews';  
import Wishlist from '../View/Wishlist';  
import ShopSetup from '../View/ShopSetup';  
import Avatar from '../View/Avatar';  
import SetupShop from '../../Shop_Profile/View/Login';

const UserController = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/address" element={<AddressBook />} />
      <Route path="/payment" element={<PaymentOptions />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/cancellations" element={<Cancellations />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/shop-setup" element={<ShopSetup />} />
      <Route path="/avatar" element={<Avatar />} />
      <Route path="/ShopSetup" element={<SetupShop />} />
    </Routes>
  );
};

export default UserController;
