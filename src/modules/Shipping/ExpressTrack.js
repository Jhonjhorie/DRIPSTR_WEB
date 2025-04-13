import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/constants/supabase";
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
import Navbar from "./Shared/Navbar";

const JntTrack = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTable, setActiveTable] = useState("orders"); // Track active table

  // Fetch order details based on shop_transaction_id or transaction_id
  const fetchOrderDetails = async () => {
    if (!searchQuery) {
      setError("Please enter a tracking ID.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let query;
      if (activeTable === "orders") {
        query = supabase
          .from("orders")
          .select(
            `*,
            user:acc_num (username, full_name, mobile),
            product:prod_num (item_Name, shop_Name)`
          )
          .not("shipping_status", "eq", "cancel")
          .eq("shop_transaction_id", searchQuery);
      } else {
        query = supabase
          .from("merchant_Commission")
          .select(
            `*,
            client:client_Id (username, full_name, mobile),
            merchant:merchantId (shop_name, contact_number, address)`
          )
          .not("status", "eq", "cancel")
          .eq("transaction_id", searchQuery);
      }

      const { data, error } = await query;

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
  const totalPrice = orderDetails.reduce(
    (sum, order) => sum + (order.final_price || order.pricing || 0),
    0
  );

  return (
    <div className="bg-gray-50 min-h-screen">
   <Navbar />

      {/* Search Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Track Your Order</h2>
          <div className="flex items-center w-full max-w-md">
            <input
              type="text"
              placeholder="Enter Tracking ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button
              onClick={fetchOrderDetails}
              className="p-2 bg-red-600 text-white rounded-r-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <FontAwesomeIcon icon={faSearch} />
              )}
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTable("orders")}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeTable === "orders"
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTable("merchant_Commission")}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeTable === "merchant_Commission"
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Commissions
            </button>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      </div>

      {/* Order Details Modal */}
      {orderDetails.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
                <button onClick={closeModal} className="text-gray-600 hover:text-gray-800">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              {/* User Details */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <FontAwesomeIcon icon={faUser} className="text-gray-600" />
                  <span className="font-semibold">Customer:</span>
                  <span>
                    {activeTable === "orders"
                      ? orderDetails[0].user?.username || orderDetails[0].user?.full_name
                      : orderDetails[0].client?.username || orderDetails[0].client?.full_name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faUser} className="text-gray-600" />
                  <span className="font-semibold">Contact:</span>
                  <span>
                    {activeTable === "orders"
                      ? orderDetails[0].user?.mobile
                      : orderDetails[0].client?.mobile}
                  </span>
                </div>
              </div>

              {/* Shipping Details */}
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <FontAwesomeIcon icon={faMapMarker} className="text-gray-600" />
                  <span className="font-semibold">Address:</span>
                  <span>{orderDetails[0].shipping_addr || "N/A"}</span>
                </div>
                {activeTable === "orders" && (
                  <>
                    <div className="flex items-center space-x-2 mb-2">
                      <FontAwesomeIcon icon={faTruck} className="text-gray-600" />
                      <span className="font-semibold">Method:</span>
                      <span>{orderDetails[0].shipping_method}</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <FontAwesomeIcon icon={faClock} className="text-gray-600" />
                      <span className="font-semibold">Estimated Delivery:</span>
                      <span>{orderDetails[0].estimated_delivery || "N/A"}</span>
                    </div>
                  </>
                )}
                <div className="flex items-center space-x-2 mb-2">
                  <FontAwesomeIcon icon={faMoneyBill} className="text-gray-600" />
                  <span className="font-semibold">Total Price:</span>
                  <span>₱{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={faBox} className="text-gray-600" />
                  <span className="font-semibold">Status:</span>
                  <span>
                    {activeTable === "orders"
                      ? orderDetails[0].shipping_status
                      : orderDetails[0].status}
                  </span>
                </div>
              </div>

              {/* Items in the Order */}
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-2">Items in this Order</h3>
                <div className="space-y-2">
                  {orderDetails.map((order, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded-lg">
                      {activeTable === "orders" ? (
                        <>
                          <div className="flex items-center space-x-2 mb-1">
                            <FontAwesomeIcon icon={faShoppingCart} className="text-gray-600" />
                            <span className="font-semibold">Product:</span>
                            <span>
                              {order.product?.item_Name} ({order.product?.shop_Name})
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mb-1">
                            <FontAwesomeIcon icon={faBox} className="text-gray-600" />
                            <span className="font-semibold">Variant:</span>
                            <span>{order.order_variation?.variant_Name}</span>
                          </div>
                          <div className="flex items-center space-x-2 mb-1">
                            <FontAwesomeIcon icon={faBox} className="text-gray-600" />
                            <span className="font-semibold">Size:</span>
                            <span>{order.order_size?.size}</span>
                          </div>
                          <div className="flex items-center space-x-2 mb-1">
                            <FontAwesomeIcon icon={faCalendar} className="text-gray-600" />
                            <span className="font-semibold">Quantity:</span>
                            <span>{order.quantity}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FontAwesomeIcon icon={faMoneyBill} className="text-gray-600" />
                            <span className="font-semibold">Price:</span>
                            <span>₱{order.final_price.toFixed(2)}</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center space-x-2 mb-1">
                            <FontAwesomeIcon icon={faUser} className="text-gray-600" />
                            <span className="font-semibold">Shop:</span>
                            <span>{order.merchant?.shop_name}</span>
                          </div>
                          <div className="flex items-center space-x-2 mb-1">
                            <FontAwesomeIcon icon={faCalendar} className="text-gray-600" />
                            <span className="font-semibold">Description:</span>
                            <span>{order.description}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FontAwesomeIcon icon={faMoneyBill} className="text-gray-600" />
                            <span className="font-semibold">Price:</span>
                            <span>₱{order.pricing.toFixed(2)}</span>
                          </div>
                        </>
                      )}
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