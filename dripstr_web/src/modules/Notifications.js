import React, { useState } from "react";
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
    promos: Array.from({ length: 15 }, () => ({
      shopName: getRandomShopName(),
      date: getRandomDate(),
      message: "Exclusive Sale: Up to 50% OFF!",
      imageUrl: "https://via.placeholder.com/80",
    })),
    orders: Array.from({ length: 5 }, () => ({
      shopName: getRandomShopName(),
      date: getRandomDate(),
      message: "Your order is out for delivery!",
      imageUrl: "https://via.placeholder.com/80",
    })),
    services: Array.from({ length: 7 }, () => ({
      shopName: getRandomShopName(),
      date: getRandomDate(),
      message: "New partnership opportunity available.",
      imageUrl: "https://via.placeholder.com/80",
    })),
    vouchers: Array.from({ length: 8 }, () => ({
      shopName: getRandomShopName(),
      date: getRandomDate(),
      message: "Your voucher is about to expire. Redeem now!",
      imageUrl: "https://via.placeholder.com/80",
    })),
  };

  // State to handle category selection
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(10); // Initially show 10 notifications

  // Handle category click
  const categorySort = (category) => {
    setSelectedCategory(category);
    setVisibleCount(10); // Reset the visible count when category changes
  };

  const filteredNotifications = selectedCategory === "all"
    ? [
        ...categories.promos,
        ...categories.orders,
        ...categories.services,
        ...categories.vouchers,
      ]
    : categories[selectedCategory];

  const handleSeeMore = () => {
    setVisibleCount(visibleCount + 10); // Show 10 more notifications on click
  };

  return (
    <div className="flex flex-col p-4 bg-slate-200">
      {/* Header Section */}
      <div className="flex flex-row items-center border-b pb-4">
        <h2 className="text-2xl font-bold text-primary-color flex-initial ml-10">
          Notifications
        </h2>
        <div className="flex flex-row justify-start ml-4 space-x-4 flex-grow">
          {/* All Category Button */}
          <button
            onClick={() => categorySort("all")}
            className={`flex items-center px-4 py-2 text-sm font-bold ${selectedCategory === "all" ? "text-primary-color bg-gray-100" : "text-slate-600"} hover:text-primary-color rounded-lg shadow hover:bg-gray-100 bg-white`}
          >
            <span>All</span>
          </button>

          {/* Promos Category Button */}
          <button
            onClick={() => categorySort("promos")}
            className={`flex items-center px-4 py-2 text-sm font-bold ${selectedCategory === "promos" ? "text-primary-color bg-gray-100" : "text-slate-600"} hover:text-primary-color rounded-lg shadow hover:bg-gray-100 bg-white`}
          >
            <span>Promos</span>
          </button>

          {/* Orders Category Button */}
          <button
            onClick={() => categorySort("orders")}
            className={`flex items-center px-4 py-2 text-sm font-bold ${selectedCategory === "orders" ? "text-primary-color bg-gray-100" : "text-slate-600"} hover:text-primary-color rounded-lg shadow hover:bg-gray-100 bg-white`}
          >
            <span>Orders</span>
          </button>

          {/* Services Category Button */}
          <button
            onClick={() => categorySort("services")}
            className={`flex items-center px-4 py-2 text-sm font-bold ${selectedCategory === "services" ? "text-primary-color bg-gray-100" : "text-slate-600"} hover:text-primary-color rounded-lg shadow hover:bg-gray-100 bg-white`}
          >
            <span>Services</span>
          </button>

          {/* Vouchers Category Button */}
          <button
            onClick={() => categorySort("vouchers")}
            className={`flex items-center px-4 py-2 text-sm font-bold ${selectedCategory === "vouchers" ? "text-primary-color bg-slate-100" : "text-slate-600"} hover:text-primary-color rounded-lg shadow hover:bg-gray-100 bg-white`}
          >
            <span>Voucher Reminder</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.slice(0, visibleCount).map((notif, index) => (
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

      {/* Show More Button */}
      {visibleCount < filteredNotifications.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleSeeMore}
            className="text-primary-color font-semibold hover:underline"
          >
            See More
          </button>
        </div>
      )}
    </div>
  );
};

export default Notification;
