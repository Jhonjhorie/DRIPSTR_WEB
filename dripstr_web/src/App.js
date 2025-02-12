import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Controllers
import AdminController from './modules/Admin/Controller/Admin_Controller';
import LoginController from './modules/Login/Controller/Login_Controller';
import HomeController from './modules/Home/Home_Controller';
import OrderController from './modules/Order/Controller/Order_Controller';
import ShopController from './modules/Shop_Profile/Controller/Shop_Profile_Controller';
import UserAccountController from './modules/User_Account/Controller/User_Account_Controller';
import ProductsController from './modules/Products/Products_Controller';
import ArtistController from './modules/ArtistPage/Controller/Artists_Controller';
import Product from './modules/Products/Product';
import Search from './modules/Products/Search';
import PlaceOrder from "./modules/Products/PlaceOrder";


// Shared Components
import Header from './shared/Header';
import Sidebar from './shared/SideBar';
import Notifications from './modules/Notification/Notification_Controller';
import Reminder from './modules/Messaging/View/Reminder';

// Main App Component
function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin") || location.pathname.startsWith("/Admin");

  return (
    <div className="flex flex-col h-screen w-screen overflow-x-hidden custom-scrollbar">
      {/* Navbar (Header) */}
      {!isAdmin && <Header />}

      {/* Main Layout */}
      <div className="flex flex-1 flex-col sm:flex-row">
        {/* Sidebar */}
        <div className="hidden sm:block">
          {!isAdmin && <Sidebar />}
        </div>

        {/* Sidebar for mobile */}
        <div className="block sm:hidden fixed bottom-0 w-full z-50">
          {!isAdmin && <Sidebar />}
        </div>

        {/* Main Content */}
        <main className={`flex-1 ${!isAdmin ? "sm:ml-8 sm:pl-2":"" } overflow-y-auto`}>
          <Routes>
            <Route path="/" element={<HomeController />} />
            <Route path="/mall/*" element={<ProductsController />} />
            <Route path="/arts/*" element={<ArtistController />} />
            <Route path="/product/*" element={<Product />} />
              <Route path="/placeOrder/*" element={<PlaceOrder />} />
            <Route path="/search" element={<Search />} />
            <Route path="/cart/*" element={<OrderController />} />
            <Route path="/login/*" element={<LoginController />} />
            <Route path="/admin/*" element={<AdminController />} />
            <Route path="/shop/*" element={<ShopController />} />
            <Route path="/account/*" element={<UserAccountController />} />
            <Route path="/notification" element={<Notifications />} />
            <Route path="/reminder" element={<Reminder />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// Wrapper Component
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
