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
import Header from './shared/Header';
import Sidebar from './shared/SideBar';

function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        {/* Navbar (Header) */}
        <Header />
        {/* SideBar */}
        <div className="flex absolute bottom-0 left-0 h-screen w-full overflow-x-hidden">
          <Sidebar />
          {/* Main Content */}
          <div>
          <main className="flex-1 absolute w-screen top-0 left-0  sm:min-h-[87.6vh] min-h-[40vh] bg-slate-900 mt-16 sm:mt-20 md:mt-24">
            <Routes>
              <Route path="/" element={<HomeController />} />
              <Route path="/mall/*" element={<ProductsController />} />
              <Route path="/cart/*" element={<OrderController />} />
              <Route path="/login/*" element={<LoginController />} />
              <Route path="/adminmoderator/*" element={<AdminModeratorController />} />
              <Route path="/adminsuper/*" element={<AdminSuperController />} />
              <Route path="/shop/*" element={<ShopController />} />
              <Route path="/useraccount/*" element={<UserAccountController />} />
            </Routes>
          </main>
          </div>
        </div>
      </div>
    </Router>
  );  
}

export default App;
