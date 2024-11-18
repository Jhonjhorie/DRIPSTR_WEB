import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Controllers
import AdminModeratorController from './modules/AdminModerator/Controller/Admin_Controller';
import AdminSuperController from './modules/AdminSuper/Controller/AdminSuper_Contoller';
import LoginController from './modules/Login/Controller/Login_Controller';
import HomeController from './modules/Home/Home_Controller';
import OrderController from './modules/Order/Controller/Order_Controller';
import ShopController from './modules/Shop_Profile/Controller/Shop_Profile_Controller';
import UserAccountController from './modules/User_Account/Controller/User_Account_Controller';
import ProductsController from './modules/Products/Products_Controller'

// Shared Components
import Navbar from './shared/Navbar';
import SubNavbar from './shared/SubNavbarShop';
import Footer from './shared/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        {/* Navbar */}
        <Navbar />
        <SubNavbar />

        {/* Main Content */}
        <main className="w-auto">
          <Routes>
            {/* Ito yong mga nilalagay sa URL para mapuntahan yong page ex. localhost:3000/Shop */}
            <Route path="/" element={<HomeController />} />
            <Route path="/mall" element={<ProductsController />} />
            <Route path="/cart" element={<OrderController />} />
            <Route path="/login/*" element={<LoginController />} />
            <Route path="/adminmoderator/*" element={<AdminModeratorController />} />
            <Route path="/adminsuper/*" element={<AdminSuperController />} />
            <Route path="/shop/*" element={<ShopController />} />
            <Route path="/useraccount/*" element={<UserAccountController />} />
          </Routes>
         
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
