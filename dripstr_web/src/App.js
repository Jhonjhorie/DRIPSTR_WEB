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
import Product from './modules/Products/Product'


// Shared Components
import Header from './shared/Header';
import Sidebar from './shared/SideBar';
import Notifications from './modules/Notifications';

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen w-screen overflow-x-hidden custom-scrollbar">
        {/* Navbar (Header) */}
        <Header />

        {/* Main Layout */}
        <div className="flex flex-1 flex-col sm:flex-row">
          {/* Sidebar */}
          <div className="hidden sm:block">
            <Sidebar />
          </div>
          {/* Sidebar for mobile */}
          <div className="block sm:hidden fixed bottom-0 w-full z-50">
            <Sidebar />
          </div>

          {/* Main Content */}
          <main className="flex-1 sm:ml-8 sm:pl-2 overflow-y-auto">
            <Routes>
              <Route path="/" element={<HomeController />} />
              <Route path="/mall/*" element={<ProductsController />} />
              <Route path="/product/*" element={<Product />} />
              <Route path="/cart/*" element={<OrderController />} />
              <Route path="/login/*" element={<LoginController />} />
              <Route path="/adminmoderator/*" element={<AdminModeratorController />} />
              <Route path="/adminsuper/*" element={<AdminSuperController />} />
              <Route path="/shop/*" element={<ShopController />} />
              <Route path="/account/*" element={<UserAccountController />} />
              <Route path="/notification" element={<Notifications />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
