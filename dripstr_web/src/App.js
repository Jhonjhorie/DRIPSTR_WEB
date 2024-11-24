import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Controllers
import AdminController from "./modules/Admin/Controller/Admin_Controller";
import LoginController from "./modules/Login/Controller/Login_Controller";
import OrderController from "./modules/Order/Controller/Order_Controller";
import ShopController from "./modules/Shop_Profile/Controller/Shop_Profile_Controller";
import UserAccountController from "./modules/User_Account/Controller/User_Account_Controller";

// Shared Components
import Navbar from "./shared/Navbar";
import SubNavbar from "./shared/SubNavbarShop";
import Footer from "./shared/Footer";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />
        <SubNavbar />

        {/* Main Content */}
        <main className="flex-grow container mx-auto p-4">
          <Routes>
            {/* Ito yong mga nilalagay sa URL para mapuntahan yong page ex. localhost:3000/Shop */}
            <Route path="/" element={<OrderController />} />
            <Route path="/login/*" element={<LoginController />} />
            <Route path="/admin/*" element={<AdminController />} />
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
