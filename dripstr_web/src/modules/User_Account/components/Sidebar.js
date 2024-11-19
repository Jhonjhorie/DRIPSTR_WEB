import React from "react";
import { Routes, Route, Link, Outlet } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
} from '@fortawesome/free-solid-svg-icons';


// Sidebar Navigation Items
const navItems = [
  { label: "Manage Account", path: "/useraccount/", icon: faSettings },
  { label: "My Profile", path: "/useraccount/profile", icon: faPerson },
  { label: "My Address Book", path: "/useraccount/address", icon: faLocation },
  { label: "My Payment Options", path: "/useraccount/payment", icon: faCreditCard },
  { label: "My Order", path: "/useraccount/orders", icon: faReceipt },
  { label: "My Cancellations", path: "/useraccount/cancellations", icon: faCloseCircle },
  { label: "My Reviews", path: "/useraccount/reviews", icon: faStar },
  { label: "My Wishlist and Followed Shop", path: "/useraccount/wishlist", icon: faHeart },
  { label: "Set up Shop", path: "/useraccount/shop-setup", icon: faStore },
  { label: "Avatar", path: "/useraccount/avatar", icon: faUserCircle },
];

const AccountLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <nav className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold text-purple-700 mb-6">User Account</h2>
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="flex items-center space-x-3 text-gray-700 hover:text-purple-500"
              >
                <FontAwesomeIcon icon={item.icon} className="text-xl" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
 
    </div>
  );
};

export default AccountLayout;
