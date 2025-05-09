import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

// Controllers
import AdminController from "./modules/Admin/Controller/Admin_Controller";
import LoginController from "./modules/Login/Controller/Login_Controller";
import HomeController from "./modules/Home/Home_Controller";
import OrderController from "./modules/Order/Controller/Order_Controller";
import ShopController from "./modules/Shop_Profile/Controller/Shop_Profile_Controller";
import ProductController from "./modules/Products/Products_Controller";
import UserAccountController from "./modules/User_Account/Controller/User_Account_Controller";
import ArtistController from "./modules/ArtistPage/Controller/Artists_Controller";
import Search from "./modules/Products/Search";
import GuestHome from "./modules/Home/GuestHome";
import Mall from "./modules/Products/Mall";
import JntController from "./modules/Shipping/Controller/Express_Controller";

// Data
import useUserProfile from "@/shared/mulletCheck";
import AboutUs from "./modules/Home/AboutUs";

// Shared Components
import Header from './shared/Header';
import Sidebar from './shared/SideBar';
import Notifications from './modules/Notification/Notification_Controller';
import Reminder from './modules/Messaging/View/Reminder';

// Notification Context
import { NotificationProvider } from './utils/NotificationContext';
import { Toaster } from 'react-hot-toast';

// Password Reset
import ResetPassword from './shared/login/ResetPassword';

import AccountSetup from './modules/Login/View/AccountSetup';
import Chat from "./modules/Messaging/Chat";
import DownloadStudioP from "./modules/Home/dlStudio";

function AppContent() {
  const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();
  const location = useLocation();

  // Add account-setup to the routes that shouldn't show header/sidebar
  const isJnt = location.pathname === "/express" || location.pathname === "/express/dashboard" || location.pathname === "/express/track" || location.pathname === "/download_studio" || location.pathname === "/express/detailed";
  const isAccountSetup = location.pathname === "/account-setup";
  const hideHeaderAndSidebar = isJnt || isAccountSetup;

  return (
    <NotificationProvider>
      <Toaster />

      <div className="flex flex-col bg-slate-50 h-screen w-screen overflow-x-hidden custom-scrollbar">
        {/* Navbar (Header) */}
        {!hideHeaderAndSidebar && <Header />}

        {/* Main Layout */}
        <div className="flex flex-1 flex-col sm:flex-row">
          {/* Sidebar */}
          {isLoggedIn && !hideHeaderAndSidebar && (
            <div className="hidden sm:block">
              <Sidebar />
            </div>
          )}
          {isLoggedIn && !hideHeaderAndSidebar && (
            <div className="block sm:hidden fixed bottom-0 w-full z-50">
              <Sidebar />
            </div>
          )}

          {/* Main Content */}
          <main className={`flex-1 ${isLoggedIn && !hideHeaderAndSidebar ? 'sm:ml-8 sm:pl-2' : ''} overflow-y-auto`}>
            <Routes>
              <Route path="/" element={<HomeController />} />
              <Route path="/download_studio" element={<DownloadStudioP />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/express/*" element={<JntController />} />
              <Route path="/guest" element={<GuestHome />} />
              <Route path="/arts/*" element={<ArtistController />} />
              <Route path="/product/*" element={<ProductController />} />
              <Route path="/search" element={<Search />} />
              <Route path="/cart/*" element={<OrderController />} />
              <Route path="/login/*" element={<LoginController />} />
              <Route path="/admin/*" element={<AdminController />} />
              <Route path="/shop/*" element={<ShopController />} />
              <Route path="/account/*" element={<UserAccountController />} />
              <Route path="/notification" element={<Notifications />} />
              <Route path="/reminder" element={<Reminder />} />
              <Route path="/mall" element={<Mall />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/account-setup" element={<AccountSetup />} />
            </Routes>
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;