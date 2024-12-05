import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBox, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";

const Notification = () => {
  // Helper functions for randomization
  const getRandomDate = () => {
    const today = new Date();
    const randomDays = Math.floor(Math.random() * 30); // Random date within the past 30 days
    const randomDate = new Date(today.setDate(today.getDate() - randomDays));
    return randomDate.toLocaleDateString();
  };

  const getRandomShopName = () => {
    const shops = [
      "Joli's Shop",
      "Timmie's Hub",
      "The Gift Box",
      "Quilies's Store",
      "Happy Deals",
    ];
    return shops[Math.floor(Math.random() * shops.length)];
  };

  // Categories of notifications
  const categories = {
    promos: Array.from({ length: 3 }, () => ({
      shopName: getRandomShopName(),
      date: getRandomDate(),
      message: "Exclusive Sale: Up to 50% OFF!",
      imageUrl: "https://via.placeholder.com/80",
    })),
    orders: Array.from({ length: 3 }, () => ({
      shopName: getRandomShopName(),
      date: getRandomDate(),
      message: "Your order is out for delivery!",
      imageUrl: "https://via.placeholder.com/80",
    })),
    services: Array.from({ length: 3 }, () => ({
      shopName: getRandomShopName(),
      date: getRandomDate(),
      message: "New partnership opportunity available.",
      imageUrl: "https://via.placeholder.com/80",
    })),
    vouchers: Array.from({ length: 3 }, () => ({
      shopName: getRandomShopName(),
      date: getRandomDate(),
      message: "Your voucher is about to expire. Redeem now!",
      imageUrl: "https://via.placeholder.com/80",
    })),
  };

  // Combine all categories into one array for display
  const notifications = [
    ...categories.promos,
    ...categories.orders,
    ...categories.services,
    ...categories.vouchers,
  ];

  return (
    <div className="flex flex-col p-4 bg-slate-200">
      {/* Header Section */}
      <div className="flex flex-row items-center border-b pb-4">
        <h2 className="text-2xl font-bold text-primary-color flex-initial ml-10">
          Notifications
        </h2>
        <div className="flex flex-row justify-start ml-4 space-x-4 flex-grow">
          <Link
            className="flex items-center bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:text-primary-color rounded-lg shadow hover:bg-slate-100">
            All
          </Link>
          <Link
            className="flex items-center bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:text-primary-color rounded-lg shadow hover:bg-gray-100">
            Promos
          </Link>
          <Link
            className="flex items-center bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:text-primary-color rounded-lg shadow hover:bg-gray-100" >
            Orders
          </Link>
          <Link
            className="flex items-center bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:text-primary-color rounded-lg shadow hover:bg-gray-100">
            Services
          </Link>
          <Link
            to="/vouchers"
            className="flex items-center bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:text-primary-color rounded-lg shadow hover:bg-gray-100">
            Voucher Reminder
          </Link>
        </div>
      </div>

      {/* Notifications List */}
      {notifications.map((notif, index) => (
        <Link
          to="/details"
          key={index}
          className="flex items-center bg-white p-4 mb-4 rounded-lg shadow hover:text-primary-color hover:bg-gray-100 ml-10"
        >
          <img
            src={notif.imageUrl}
            alt={`Notification ${index + 1}`}
            className="w-20 h-20 rounded"
          />
          <div className="flex-1 ml-4">
            <h3 className="text-lg font-semibold flex justify-between">
              <span>{notif.shopName}</span>
              <span className="text-sm text-gray-500">{notif.date}</span>
            </h3>
            <p className="text-gray-600">{notif.message}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Notification;
