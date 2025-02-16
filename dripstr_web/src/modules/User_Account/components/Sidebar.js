import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCog as faSettings,
  faUser as faPerson,
  faMapMarkerAlt as faLocation,
  faCreditCard,
  faReceipt,
  faTimesCircle as faCloseCircle,
  faStar,
  faHeart,
  faStoreAlt as faStore,
  faUserCircle,
  faSignOutAlt, // Add icon for log out
} from "@fortawesome/free-solid-svg-icons";
import { supabase } from "../../../constants/supabase"; // Ensure this import is correct

// Sidebar Navigation Items
const navItems = [
  { label: "Manage Account", path: "/account/", icon: faSettings },
  { label: "My Profile", path: "/account/profile", icon: faPerson },
  { label: "My Address Book", path: "/account/address", icon: faLocation },
 // { label: "My Payment Options", path: "/account/payment", icon: faCreditCard },
  { label: "My Order", path: "/account/orders", icon: faReceipt },
 // { label: "My Wishlist", path: "/account/wishlist", icon: faHeart },
  { label: "Set up Shop", path: "/account/shop-setup", icon: faStore },
  { label: "Avatar", path: "/account/avatar", icon: faUserCircle },
];

const AccountLayout = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // For programmatic navigation

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser(); // Correct method to check user
      if (!user) {
        // If no user is signed in, redirect to login
        navigate("/login");
      }
    };

    checkUser(); // Check user status
    const handleResize = () => {
      setIsMinimized(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [navigate]);  

  // Logout function
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();  
       navigate("/");  
       window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <div className="flex h-full  bg-gray-100">
      {/* Sidebar */}
      <nav
        className={`bg-white shadow-md h-auto flex flex-col transition-all duration-300 ease-in-out ${
          isMinimized ? "w-16" : "w-64"
        }`}
        onMouseEnter={() => setIsMinimized(false)} // Expand on hover
        onMouseLeave={() => setIsMinimized(window.innerWidth < 768)} // Minimize on hover out
      >
        {/* Sidebar Header */}
        <div
          className={`flex p-4 text-purple-700 font-bold text-xl transition-all ${
            isMinimized ? "opacity-0 invisible" : "opacity-100 visible"
          }`}
        >
          User Account
        </div>
  
        {/* Navigation Items */}
        <ul className="flex-grow space-y-2 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-2 rounded-lg transition-all duration-300 ${
                  location.pathname === item.path
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-700 hover:bg-gray-200 hover:text-purple-500"
                }`}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={`text-xl transition-transform duration-300 ${
                    isMinimized ? "mx-auto" : "mr-3"
                  }`}
                />
                <span
                  className={`whitespace-nowrap transition-all duration-300 ${
                    isMinimized ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
  
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className={`flex items-center p-2 rounded-lg transition-all duration-300 mt-4 px-4 text-gray-700 hover:bg-gray-200 hover:text-purple-500`}
        >
          <FontAwesomeIcon
            icon={faSignOutAlt}
            className={`text-xl transition-transform duration-300 ${
              isMinimized ? "mx-auto" : "mr-3"
            }`}
          />
          <span
            className={`whitespace-nowrap transition-all duration-300 ${
              isMinimized ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
            }`}
          >
            Log Out
          </span>
        </button>
      </nav>
    </div>
  );
  
};

export default AccountLayout;
