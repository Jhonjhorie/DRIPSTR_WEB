import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
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
} from "@fortawesome/free-solid-svg-icons";

// Sidebar Navigation Items
const navItems = [
  { label: "Manage Account", path: "/account/", icon: faSettings },
  { label: "My Profile", path: "/account/profile", icon: faPerson },
  { label: "My Address Book", path: "/account/address", icon: faLocation },
  { label: "My Payment Options", path: "/account/payment", icon: faCreditCard },
  { label: "My Order", path: "/account/orders", icon: faReceipt },
  { label: "My Wishlist", path: "/account/wishlist", icon: faHeart },
  { label: "Set up Shop", path: "/account/shop-setup", icon: faStore },
  { label: "Avatar", path: "/account/Cc", icon: faUserCircle },
];

 /*{ label: "My Cancellations", path: "/account/cancellations", icon: faCloseCircle },
  { label: "My Reviews", path: "/account/reviews", icon: faStar },*/

const AccountLayout = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const location = useLocation();

  // Automatically minimize sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      setIsMinimized(window.innerWidth < 768); // Adjust breakpoint as needed
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <nav
        className={`bg-white shadow-md h-screen flex flex-col transition-all duration-300 ease-in-out ${
          isMinimized ? "w-16" : "w-64"
        }`}
        onMouseEnter={() => setIsMinimized(false)} // Expand on hover
        onMouseLeave={() => setIsMinimized(window.innerWidth < 768)} // Minimize on hover out
      >
        {/* Sidebar Header */}
        <div
          className={`flex p-4 text-purple-700 font-bold text-xl transition-all   ${
            isMinimized ? "opacity-0 invisible " : "opacity-100 visible"
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

 
      </nav>

 
    </div>
  );
};

export default AccountLayout;
