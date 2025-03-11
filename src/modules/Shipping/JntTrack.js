import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/constants/supabase"; // Adjust the import path as needed
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faTimes,
  faBox,
  faTruck,
  faMoneyBill,
  faUser,
  faShoppingCart,
  faCalendar,
  faMapMarker,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

const JntTrack = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch order details based on shop_transaction_id
  const fetchOrderDetails = async () => {
    if (!searchQuery) {
      setError("Please enter a tracking ID.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          user:acc_num (username, full_name, mobile),
          product:prod_num (item_Name, shop_Name)
        `)
        .not("shipping_status", "eq", "cancel")
        .eq("shop_transaction_id", searchQuery);

      if (error) throw error;

      if (data && data.length > 0) {
        setOrderDetails(data);
      } else {
        setError("No order found with this tracking ID.");
      }
    } catch (error) {
      console.error("Error fetching order details:", error.message);
      setError("Failed to fetch order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Close the modal
  const closeModal = () => {
    setOrderDetails([]);
    setSearchQuery("");
  };

  // Calculate total price for the order
  const totalPrice = orderDetails.reduce((sum, order) => sum + order.final_price, 0);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <nav className="bg-red-600 shadow-md p-4 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white">J&T Express</h1>
        <ul className="flex space-x-6">
          <li>
            <Link to="/jnt" className="text-black font-semibold hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link to="/jnt/track" className="text-black font-semibold hover:underline">
              Track a Shipment
            </Link>
          </li>
          <li>
            <Link to="/jnt/detailed" className="text-black font-semibold hover:underline">
              Detailed List
            </Link>
          </li>
        </ul>
      </nav>

      {/* Search Section */}
      <div className="container mx-auto mt-20 p-4">
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Track Your Order</h2>
          <div className="flex items-center space-x-2 w-full max-w-md">
            <input
              type="text"
              placeholder="Enter Tracking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full bg-white text-black"
            />
            <button
              onClick={fetchOrderDetails}
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <FontAwesomeIcon icon={faSearch} />
              )}
            </button>
          </div>
          {error && <p className="text-red-600">{error}</p>}
        </div>
      </div>

      {/* Order Details Modal */}
      {orderDetails.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                <button onClick={closeModal} className="btn btn-ghost">
                  <FontAwesomeIcon icon={faTimes} className="text-gray-600" />
                </button>
              </div>

              {/* User Details */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <FontAwesomeIcon icon={faUser} className="text-gray-600" />
                  <span className="font-semibold">Customer:</span>
                  <span>{orderDetails[0].user?.username || orderDetails[0].user?.full_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faUser} className="text-gray-600" />
                  <span className="font-semibold">Contact:</span>
                  <span>{orderDetails[0].user?.mobile}</span>
                </div>
              </div>

              {/* Shipping Details */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <FontAwesomeIcon icon={faMapMarker} className="text-gray-600" />
                  <span className="font-semibold">Address:</span>
                  <span>{orderDetails[0].shipping_addr}</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <FontAwesomeIcon icon={faTruck} className="text-gray-600" />
                  <span className="font-semibold">Method:</span>
                  <span>{orderDetails[0].shipping_method}</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <FontAwesomeIcon icon={faMoneyBill} className="text-gray-600" />
                  <span className="font-semibold">Total Price:</span>
                  <span>₱{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <FontAwesomeIcon icon={faClock} className="text-gray-600" />
                  <span className="font-semibold">Estimated Delivery:</span>
                  <span>{orderDetails[0].estimated_delivery || "N/A"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faBox} className="text-gray-600" />
                  <span className="font-semibold">Status:</span>
                  <span>{orderDetails[0].shipping_status}</span>
                </div>
              </div>

              {/* Items in the Order */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4">Items in this Order</h3>
                <div className="space-y-4">
                  {orderDetails.map((order, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <FontAwesomeIcon icon={faShoppingCart} className="text-gray-600" />
                        <span className="font-semibold">Product:</span>
                        <span>{order.product?.item_Name} ({order.product?.shop_Name})</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <FontAwesomeIcon icon={faBox} className="text-gray-600" />
                        <span className="font-semibold">Variant:</span>
                        <span>{order.order_variation?.variant_Name}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <FontAwesomeIcon icon={faBox} className="text-gray-600" />
                        <span className="font-semibold">Size:</span>
                        <span>{order.order_size?.size}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <FontAwesomeIcon icon={faCalendar} className="text-gray-600" />
                        <span className="font-semibold">Quantity:</span>
                        <span>{order.quantity}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faMoneyBill} className="text-gray-600" />
                        <span className="font-semibold">Price:</span>
                        <span>₱{order.final_price.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JntTrack;