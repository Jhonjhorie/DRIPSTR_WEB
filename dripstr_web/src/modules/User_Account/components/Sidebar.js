import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  { label: "My Cancellations", path: "/account/cancellations", icon: faCloseCircle },
  { label: "My Reviews", path: "/account/reviews", icon: faStar },
  { label: "My Wishlist and Followed Shop", path: "/account/wishlist", icon: faHeart },
  { label: "Set up Shop", path: "/account/shop-setup", icon: faStore },
  { label: "Avatar", path: "/account/avatar", icon: faUserCircle },
];

const AccountLayout = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  // Handle window resizing to toggle minimized state
  useEffect(() => {
    const handleResize = () => {
      setIsMinimized(window.innerWidth < 640); // Minimize sidebar on smaller screens
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <nav
        className={`bg-white shadow-md p-4 h-full transition-all duration-300 ${
          isMinimized ? "w-16" : "w-64"
        }`}
        onMouseEnter={() => setIsMinimized(false)}
        onMouseLeave={() => setIsMinimized(window.innerWidth < 768)}
      >
        <h2
          className={`text-xl font-bold text-purple-700 mb-6 transition-opacity ${
            isMinimized ? "opacity-0 w-0 overflow-hidden hidden" : "opacity-100 display block"
          }`}
        >
          User Account
        </h2>
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="flex items-center space-x-3 text-gray-700 hover:text-purple-500"
              >
                <FontAwesomeIcon icon={item.icon} className={`text-xl ${
                    isMinimized ? "flex justify-evenly py-1" : ""
                  }`} />
                <span
                  className={`transition-opacity ${
                    isMinimized ? "opacity-0 w-0 overflow-hidden hidden" : "opacity-100 display block"
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
