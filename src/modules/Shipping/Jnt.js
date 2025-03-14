import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/constants/supabase"; // Adjust the import path as needed
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faBox,
  faCheckCircle,
  faSpinner,
  faUser,
  faShoppingCart,
  faCalendar,
  faMapMarker,
  faMoneyBill,
  faClock,
  faStore,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

const Jnt = () => {
  const [groupedOrders, setGroupedOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("To prepare"); // Default tab

  // Fetch orders with user and product details from Supabase
  const fetchOrders = async (status) => {
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select(
          `*,
          user:acc_num (username, full_name, mobile),
          product:prod_num (item_Name, shop_Name)`
        )
        .eq("shipping_status", status) // Fetch orders for the selected status
        .order("created_at", { ascending: false });

      if (ordersError) throw ordersError;

      // Group orders by shop_transaction_id
      const grouped = ordersData.reduce((acc, order) => {
        const transactionId = order.shop_transaction_id;
        if (!acc[transactionId]) {
          acc[transactionId] = {
            ...order,
            items: [order],
            total_price: order.final_price,
          };
        } else {
          acc[transactionId].items.push(order);
          acc[transactionId].total_price += order.final_price;
        }
        return acc;
      }, {});

      setGroupedOrders(grouped);
    } catch (error) {
      console.error("Error fetching orders:", error.message);
    } finally {
      setLoading(false);
    }
  };

  // Update shipping status for all items in a grouped order
  const updateShippingStatus = async (transactionId, newStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ shipping_status: newStatus })
        .eq("shop_transaction_id", transactionId);

      if (error) throw error;

      // Refetch orders to update the UI
      await fetchOrders(activeTab);
    } catch (error) {
      console.error("Error updating shipping status:", error.message);
    }
  };

  // Fetch orders when the active tab changes
  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);

  // Tabs for different order statuses
  const tabs = [
    { label: "To Prepare", value: "To prepare" },
    { label: "To Ship", value: "To ship" },
    { label: "To Receive", value: "To receive" },
    { label: "Completed", value: "completed" },
    { label: "Returning", value: "returning" },
    { label: "Returned", value: "returned" },
  ];

  // Determine the next status and button label based on the current status
  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case "To prepare":
        return { nextStatus: "To ship", buttonLabel: "Picked up Item" };
      case "To ship":
        return { nextStatus: "To receive", buttonLabel: "To Deliver" };
      case "To receive":
        return [
          { nextStatus: "delivered", buttonLabel: "Delivered" },
          { nextStatus: "To re-deliver", buttonLabel: "Failed Delivery" },
        ];
      case "returning":
        return { nextStatus: "returned", buttonLabel: "Returned" };
      default:
        return null;
    }
  };

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

      {/* Tabs */}
      <div className="container mx-auto p-6">
        <div role="tablist" className="flex space-x-4 mb-6 overflow-x-auto tabs tabs-lift ">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-lg ${
                activeTab === tab.value
                  ? "bg-red-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FontAwesomeIcon icon={faSpinner} className="fa-spin text-4xl text-red-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(groupedOrders).map((group) => {
              const nextStatus = getNextStatus(group.shipping_status);

              return (
                <div
                  key={group.shop_transaction_id}
                  className="card bg-white shadow-lg rounded-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="card-body p-6">
                    {/* Order ID and Status */}
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="card-title text-2xl font-bold">
                        Order: {group.shop_transaction_id}
                      </h2>
                      <div className="flex items-center space-x-2">
                        {Array.isArray(nextStatus) ? (
                          nextStatus.map((status) => (
                            <button
                              key={status.nextStatus}
                              onClick={() =>
                                updateShippingStatus(group.shop_transaction_id, status.nextStatus)
                              }
                              className="btn btn-sm btn-primary"
                            >
                              {status.buttonLabel}
                            </button>
                          ))
                        ) : nextStatus ? (
                          <button
                            onClick={() =>
                              updateShippingStatus(group.shop_transaction_id, nextStatus.nextStatus)
                            }
                            className="btn btn-sm btn-primary"
                          >
                            {nextStatus.buttonLabel}
                          </button>
                        ) : null}
                      </div>
                    </div>

                    {/* User Details */}
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <FontAwesomeIcon icon={faUser} className="text-gray-600" />
                        <span className="font-semibold">Customer:</span>
                        <span>{group.user?.username || group.user?.full_name}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <FontAwesomeIcon icon={faMapMarker} className="text-gray-600" />
                        <span className="font-semibold">Address:</span>
                        <span>{group.shipping_addr}</span>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="mb-4">
                      <h3 className="text-lg font-bold mb-2">Items:</h3>
                      <div className="space-y-4">
                        {group.items.map((item, index) => (
                          <div key={index} className="card bg-base-200 shadow-sm">
                            <div className="card-body p-4">
                              <div className="flex items-center space-x-2">
                                <FontAwesomeIcon icon={faShoppingCart} className="text-gray-600" />
                                <span className="font-semibold">Product:</span>
                                <span>{item.product?.item_Name}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <FontAwesomeIcon icon={faStore} className="text-gray-600" />
                                <span className="font-semibold">Shop:</span>
                                <span>{item.product?.shop_Name}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <FontAwesomeIcon icon={faBox} className="text-gray-600" />
                                <span className="font-semibold">Variant:</span>
                                <span>{item.order_variation?.variant_Name}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <FontAwesomeIcon icon={faBox} className="text-gray-600" />
                                <span className="font-semibold">Size:</span>
                                <span>{item.order_size?.size}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <FontAwesomeIcon icon={faMoneyBill} className="text-gray-600" />
                                <span className="font-semibold">Price:</span>
                                <span>₱{item.final_price.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <FontAwesomeIcon icon={faCalendar} className="text-gray-600" />
                        <span className="font-semibold">Order Date:</span>
                        <span>{new Date(group.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <FontAwesomeIcon icon={faTruck} className="text-gray-600" />
                        <span className="font-semibold">Method:</span>
                        <span>{group.shipping_method}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <FontAwesomeIcon icon={faMoneyBill} className="text-gray-600" />
                        <span className="font-semibold">Total Price:</span>
                        <span>₱{group.total_price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <FontAwesomeIcon icon={faClock} className="text-gray-600" />
                        <span className="font-semibold">Estimated Delivery:</span>
                        <span>{group.estimated_delivery || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jnt;