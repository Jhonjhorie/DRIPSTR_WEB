import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/constants/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faBox,
  faCheckCircle,
  faSpinner,
  faUser,
  faShoppingCart,
  faCalendar,
  faMapMarkerAlt,
  faMoneyBillWave,
  faClock,
  faStore,
  faTriangleExclamation,
  faChevronRight,
  faPhoneAlt,
  faBoxOpen,
  faChevronDown,
  faChevronUp,
  faTag,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useNotification } from "../../utils/NotificationContext";
import Navbar from "./Shared/Navbar";

const ExpressDashboard = () => {
  const [groupedOrders, setGroupedOrders] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [activeTable, setActiveTable] = useState("orders");
  const [tabCounts, setTabCounts] = useState({});
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [userBranch, setUserBranch] = useState("");
  const [userSubBranch, setUserSubBranch] = useState("");

  const { addNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication and role
    const adminToken = localStorage.getItem("adminToken");
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("id");
    const username = localStorage.getItem("username");
    const branch = localStorage.getItem("branch");
    const sub_branch = localStorage.getItem("sub_branch");


    if (!adminToken) {
      navigate("/express");
      return;
    }
    setUserId(id)
    setUserRole(role);
    setUsername(username);
    setUserBranch(branch);
    setUserSubBranch(sub_branch);


    if (role === "driver") {
      setActiveTab("To ship");
    } else {
      setActiveTab("To prepare");
    }
  }, [navigate]);

  const fetchTabCounts = async () => {
    try {
      const counts = {};
      const statuses = [
        "To prepare",
        "To ship",
        "To receive",
        "delivered",
        "completed",
        "returning",
        "returned",
      ];
  
      for (const status of statuses) {
        let data = [];
        if (activeTable === "orders") {
          // Get all relevant orders for this status
          let query = supabase
            .from("orders")
            .select(
              `id,
              delivery_driver,
              shipping_status,
              shipBranch:shipping_branch (branch, sub_branch)`
            )
            .eq("shipping_status", status);
  
          // For Driver role, filter by delivery_driver directly in query
          if (userRole === "Driver" && status !== "To prepare" && status !== "To ship") {
            query = query.eq("delivery_driver", userId);
          }
  
          const { data: ordersData, error } = await query;
          if (error) throw error;
  
          // Apply client-side filters for nested fields
          if (userRole === "Main Manager") {
            data = ordersData.filter(
              (order) => order.shipBranch?.branch === userBranch
            );
          } else if (userRole === "Branch Manager") {
            data = ordersData.filter(
              (order) => order.shipBranch?.sub_branch === userSubBranch
            );
          } else if (userRole === "Driver") {
            data = ordersData.filter(
              (order) => order.shipBranch?.branch === userBranch
            );
          } else {
            data = ordersData;
          }
  
          counts[status] = data.length;
        } else {
         
          const { count, error } = await supabase
            .from("merchant_Commission")
            .select("*", { count: "exact", head: true })
            .eq("status", status);
  
          if (error) throw error;
          counts[status] = count || 0;
        }
      }
  
      setTabCounts(counts);
    } catch (error) {
      console.error("Error fetching tab counts:", error.message);
    }
  };

  const fetchOrders = async (status) => {
      try {
        let query;
        if (activeTable === "orders") {
          query = supabase
            .from("orders")
            .select(
              `*,
              user:acc_num (username, full_name, mobile),
              product:prod_num (item_Name, shop:shop_Id (id, shop_name)),
              driver:delivery_driver (username),
              shipBranch:shipping_branch (branch, sub_branch)`
            )
            .eq("shipping_status", status)
            .or(
              `payment_method.neq.Gcash, and(payment_method.eq.Gcash, payment_status.eq.Paid)`
            );
            if (userRole === "Driver" && status === "To prepare") {
              query = query.neq("shipping_status", "To prepare");
            }
      if (userRole === "Driver" && status !== "To prepare" && status !== "To ship") {
        query = query.eq("delivery_driver", userId);
      }

        } else {
          query = supabase
            .from("merchant_Commission")
            .select(
              `*,
              client:client_Id (username, full_name, mobile),
              merchant:merchantId (shop_name, contact_number, address)`
            )
            .eq("status", status);
        }
  
      const { data: ordersData, error: ordersError } = await query.order("created_at", {
      ascending: false,
    });

    if (ordersError) throw ordersError;

    let filteredData = ordersData;

    if (activeTable === "orders") {
      if (userRole === "Main Manager") {
        filteredData = filteredData.filter(
          (order) => order.shipBranch?.branch === userBranch
        );
      } else if (userRole === "Branch Manager") {
        filteredData = filteredData.filter(
          (order) => order.shipBranch?.sub_branch === userSubBranch
        );
      } else if (userRole === "Driver") {
        filteredData = filteredData.filter(
          (order) => order.shipBranch?.branch === userBranch
        );
      }
    }

    const grouped = filteredData.reduce((acc, order) => {
      const transactionId = order.shop_transaction_id || order.transaction_id;
      if (!acc[transactionId]) {
        acc[transactionId] = {
          ...order,
          items: [order],
          total_price: order.final_price || order.pricing,
        };
      } else {
        acc[transactionId].items.push(order);
        acc[transactionId].total_price += order.final_price || order.pricing;
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

  const sendOrderNotification = async (userId, status, orderId) => {
    let notificationData;

    switch (status.toLowerCase()) {
      case "to ship":
        notificationData = {
          type: "info",
          title: "Order Picked Up",
          message: `Order #${orderId} has been picked up and is ready for shipping.`,
        };
        break;
      case "to receive":
        notificationData = {
          type: "info",
          title: "Order Out for Delivery",
          message: `Order #${orderId} is out for delivery.`,
        };
        break;
      case "delivered":
        notificationData = {
          type: "success",
          title: "Order Delivered",
          message: `Order #${orderId} has been delivered successfully.`,
        };
        break;
      case "returning":
        notificationData = {
          type: "warning",
          title: "Order Returning",
          message: `Order #${orderId} is being returned.`,
        };
        break;
      case "returned":
        notificationData = {
          type: "info",
          title: "Order Returned",
          message: `Order #${orderId} has been returned.`,
        };
        break;
      default:
        notificationData = {
          type: "info",
          title: "Order Status Updated",
          message: `Order #${orderId} status has been updated to ${status}.`,
        };
    }

    await addNotification(notificationData);
  };

  const updateShippingStatus = async (transactionId, newStatus) => {
    try {
      const table = activeTable === "orders" ? "orders" : "merchant_Commission";
      const statusField =
        activeTable === "orders" ? "shipping_status" : "status";

      // Prepare the update object
      const updateData = { [statusField]: newStatus };
      
      // Add delivery_driver if conditions are met
      if (activeTable === "orders" && userRole === "Driver" && newStatus === "To receive") {
        updateData.delivery_driver = userId;
      }

      const { error } = await supabase
        .from(table)
        .update(updateData)
        .eq(
          activeTable === "orders" ? "shop_transaction_id" : "transaction_id",
          transactionId
        );

      if (error) throw error;

      if (activeTable === "orders") {
        const { data: orderData } = await supabase
          .from("orders")
          .select("acc_num")
          .eq("shop_transaction_id", transactionId)
          .single();

        if (orderData?.acc_num) {
          await sendOrderNotification(
            orderData.acc_num,
            newStatus,
            transactionId
          );
        }
      }

      await fetchOrders(activeTab);
      await fetchTabCounts();
    } catch (error) {
      console.error("Error updating shipping status:", error.message);
      addNotification({
        type: "error",
        title: "Update Failed",
        message: "Failed to update order status. Please try again.",
      });
    }
  };

  useEffect(() => {
    if (activeTab) {
      fetchOrders(activeTab);
      fetchTabCounts();
    }
  }, [activeTab, activeTable]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("username");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    navigate("/express");
  };

  const getRoleTabs = () => {
    const allTabs = [
      { label: "To Prepare", value: "To prepare", icon: faBoxOpen },
      { label: "To Ship", value: "To ship", icon: faBox },
      { label: "To Receive", value: "To receive", icon: faTruck },
      { label: "Delivered", value: "Delivered", icon: faStore },
      { label: "Completed", value: "Completed", icon: faCheckCircle },
      { label: "Returning", value: "Returning", icon: faTriangleExclamation },
      { label: "Returned", value: "Returned", icon: faBoxOpen },
    ];

    if (userRole === "Driver") {
      return allTabs.filter((tab) =>
        [
          "To ship",
          "To receive",
          "Delivered",
          "Returning",
          "Returned",
        ].includes(tab.value)
      );
    }
    return allTabs;
  };

  const getNextStatus = (currentStatus) => {
    // For managers, only allow updating from "To prepare"
    if (userRole === "Main Manager" || userRole === "Branch Manager") {
      if (currentStatus === "To prepare") {
        return { nextStatus: "To ship", buttonLabel: "Picked up" };
      }
      return null;
    }

    // For drivers
    if (userRole === "Driver") {
      switch (currentStatus) {
        case "To ship":
          return { nextStatus: "To receive", buttonLabel: "To Deliver" };
        case "To receive":
          return [
            { nextStatus: "Delivered", buttonLabel: "Delivered" },
            { nextStatus: "To ship", buttonLabel: "Failed" },
          ];
        case "Returning":
          return { nextStatus: "Returned", buttonLabel: "Returned" };
        default:
          return null;
      }
    }

    return null;
  };

  const toggleOrderExpansion = (transactionId) => {
    if (expandedOrder === transactionId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(transactionId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "To prepare":
        return "bg-blue-100 text-blue-800";
      case "To ship":
        return "bg-purple-100 text-purple-800";
      case "To receive":
        return "bg-amber-100 text-amber-800";
      case "delivered":
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "completed":
      case "Completed":
        return "bg-green-100 text-green-800";
      case "returning":
      case "Returning":
        return "bg-orange-100 text-orange-800";
      case "returned":
      case "Returned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-purple-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className=" text-md sm:text-xl font-bold">Dripstr Express</h1>
            {userRole && (
              <span className="ml-1 sm:ml-3 px-1 sm:px-2 py-1 text-xs bg-purple-800 rounded-full">
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="text-xs sm:text-sm  text-white flex gap-2 items-center">
              {" "}
              <FontAwesomeIcon icon={faUser} className="" />{" "}
              <span className=" font-bold "> {username}</span>{" "}
              <div className="bg-white h-5 rounded w-1"></div>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center text-sm bg-purple-700 hover:bg-purple-800 px-3 py-1 rounded"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" />
              <span className="hidden sm:inline-block">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Selection Tabs */}
      <div className="container mx-auto px-2 py-3">
        <div className="flex rounded-lg overflow-hidden shadow-sm mb-4">
          <button
            onClick={() => setActiveTable("orders")}
            className={`flex-1 py-2 text-center text-sm font-medium transition-colors 
              ${
                activeTable === "orders"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTable("merchant_Commission")}
            className={`flex-1 py-2 text-center text-sm font-medium transition-colors
              ${
                activeTable === "merchant_Commission"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            Commissions
          </button>
        </div>
      </div>

      {/* Status Tabs - Horizontal Scrolling */}
      <div className="container mx-auto px-2">
        <div className="overflow-x-auto flex space-x-2 pb-2 scrollbar-hide">
          {getRoleTabs().map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-3 py-2 whitespace-nowrap rounded-md text-xs font-medium flex items-center transition-colors
                ${
                  activeTab === tab.value
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              <FontAwesomeIcon icon={tab.icon} className="mr-1" />
              {tab.label}
              {tabCounts[tab.value] > 0 && (
                <span
                  className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                    activeTab === tab.value
                      ? "bg-white text-purple-600"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  {tabCounts[tab.value]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="py-3">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <FontAwesomeIcon
                icon={faSpinner}
                className="fa-spin text-2xl text-purple-600"
              />
            </div>
          ) : Object.values(groupedOrders).length > 0 ? (
            <div className="space-y-3">
              {Object.values(groupedOrders).map((group) => {
                const transactionId =
                  group.shop_transaction_id || group.transaction_id;
                const pricing = group.payment || group.pricing;
                const nextStatus = getNextStatus(
                  group.shipping_status || group.status
                );
                const isExpanded = expandedOrder === transactionId;
                const statusText = group.shipping_status || group.status;
                const statusColorClass = getStatusColor(statusText);

                return (
                  <div
                    key={transactionId}
                    className="bg-white rounded-lg shadow-sm overflow-hidden transition-all"
                  >
                    {/* Order Header - Always visible */}
                    <div
                      className="p-3 cursor-pointer"
                      onClick={() => toggleOrderExpansion(transactionId)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-500">
                              {activeTable === "orders"
                                ? "Order"
                                : "Commission"}
                            </span>
                            <span className="font-bold">{transactionId}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${statusColorClass}`}
                            >
                              {statusText}
                            </span>
                          </div>
                        </div>
                        {group.driver?.username && (
  <div className="flex items-center">
    <span   className={`text-sm px-2 py-0.5 rounded-full bg-purple-300`}>Driver: <span className="font-bold">{group.driver.username}</span></span>
  </div>
)}
                       
                        <div className="flex items-center">
                          <span className="text-sm mr-2">
                            {new Date(group.created_at).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                          <FontAwesomeIcon
                            icon={isExpanded ? faChevronUp : faChevronDown}
                            className="text-gray-400"
                          />
                        </div>
                      </div>

                      <div className="mt-2 flex items-center">
                        <FontAwesomeIcon
                          icon={faUser}
                          className="text-gray-400 mr-2"
                        />
                        <span className="text-sm">
                          {group.user?.username ||
                            group.client?.username ||
                            group.user?.full_name ||
                            group.client?.full_name}
                        </span>
                      </div>

                      {!isExpanded && (
                        <div className="mt-1 flex justify-between items-center text-sm">
                          <div className="flex items-center">
                            <FontAwesomeIcon
                              icon={faBox}
                              className="text-gray-400 mr-2"
                            />
                            <span>{group.items.length} item(s)</span>
                          </div>
                          <div className="font-bold">
                            {activeTable === "orders"
                              ? `₱${group.total_price.toFixed(2)}`
                              : `₱${group.items
                                  .reduce(
                                    (total, item) =>
                                      total + (item.pricing || 0),
                                    0
                                  )
                                  .toFixed(2)}`}
                          </div>
                        </div>
                      )}

                      {!isExpanded && nextStatus && (
                        <div className="mt-3 flex justify-end space-x-2">
                          {Array.isArray(nextStatus) ? (
                            nextStatus.map((status) => (
                              <button
                                key={status.nextStatus}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateShippingStatus(
                                    transactionId,
                                    status.nextStatus
                                  );
                                }}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                                  status.buttonLabel === "Failed"
                                    ? "bg-gray-200 text-gray-700"
                                    : "bg-purple-600 text-white"
                                }`}
                              >
                                {status.buttonLabel}
                              </button>
                            ))
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateShippingStatus(
                                  transactionId,
                                  nextStatus.nextStatus
                                );
                              }}
                              className="px-3 py-1.5 rounded-md text-xs font-medium bg-purple-600 text-white"
                            >
                              {nextStatus.buttonLabel}
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-3 pb-3 border-t border-gray-100">
                        {/* Customer Info */}
                        <div className="py-2 space-y-1">
                          <h3 className="text-xs uppercase text-gray-500 font-bold mb-1">
                            Customer Information
                          </h3>

                          <div className="flex">
                            <FontAwesomeIcon
                              icon={faPhoneAlt}
                              className="text-gray-400 mt-1 mr-2 w-4"
                            />
                            <span className="text-sm">
                              {group.user?.mobile ||
                                group.client?.mobile ||
                                "N/A"}
                            </span>
                          </div>

                          <div className="flex">
                            <FontAwesomeIcon
                              icon={faMapMarkerAlt}
                              className="text-gray-400 mt-1 mr-2 w-4"
                            />
                            <span className="text-sm">
                              {group.shipping_addr || "N/A"}
                            </span>
                          </div>
                        </div>

                        {/* Items List */}
                        <div className="py-2">
                          <h3 className="text-xs uppercase text-gray-500 font-bold mb-2">
                            Items
                          </h3>

                          <div className="space-y-2">
                            {group.items.map((item, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 rounded-md p-2 text-sm"
                              >
                                {activeTable === "orders" ? (
                                  <>
                                    <div className="font-medium">
                                      {item.product?.item_Name}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      Shop: {item.product?.shop?.shop_name}
                                    </div>
                                    <div className="flex justify-between items-center mt-1">
                                      <div className="flex items-center">
                                        <FontAwesomeIcon
                                          icon={faTag}
                                          className="text-gray-400 mr-1"
                                        />
                                        <span className="text-xs">
                                          {item.order_variation?.variant_Name ||
                                            "N/A"}
                                        </span>
                                        {item.order_size?.size && (
                                          <span className="text-xs ml-1">
                                            / {item.order_size?.size}
                                          </span>
                                        )}
                                      </div>
                                      <span className="font-medium">
                                        ₱{Number(item.final_price).toFixed(2)}
                                      </span>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="font-medium">
                                      {item.merchant?.shop_name || "Unknown"}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      {item.description}
                                    </div>
                                    <div className="flex justify-between mt-1">
                                      <div className="text-xs text-gray-500">
                                        {item.merchant?.address}
                                      </div>
                                      <span className="font-medium">
                                        ₱{Number(item.pricing).toFixed(2)}
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="py-2 border-t border-gray-100 mt-2">
                          <h3 className="text-xs uppercase text-gray-500 font-bold mb-2">
                            Order Summary
                          </h3>

                          <div className="space-y-1">
                            {activeTable === "orders" && (
                              <>
                                <div className="flex justify-between text-sm">
                                  <div className="flex items-center">
                                    <FontAwesomeIcon
                                      icon={faTruck}
                                      className="text-gray-400 mr-2 w-4"
                                    />
                                    <span>Shipping Method</span>
                                  </div>
                                  <span>{group.shipping_method}</span>
                                </div>

                                <div className="flex justify-between text-sm">
                                  <div className="flex items-center">
                                    <FontAwesomeIcon
                                      icon={faClock}
                                      className="text-gray-400 mr-2 w-4"
                                    />
                                    <span>Est. Delivery</span>
                                  </div>
                                  <span className="font-bold">
                                    {group.estimated_delivery
                                      ? new Date(
                                          group.estimated_delivery
                                        ).toLocaleDateString("en-US", {
                                          month: "long",
                                          day: "2-digit",
                                          year: "numeric",
                                        })
                                      : "N/A"}
                                  </span>
                                </div>

                                <div className="flex justify-between text-sm font-bold mt-2">
                                  <span>Total</span>
                                  <span>₱{group.total_price.toFixed(2)}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {nextStatus && (
                          <div className="mt-3 flex justify-end space-x-2">
                            {Array.isArray(nextStatus) ? (
                              nextStatus.map((status) => (
                                <button
                                  key={status.nextStatus}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateShippingStatus(
                                      transactionId,
                                      status.nextStatus
                                    );
                                  }}
                                  className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                                    status.buttonLabel === "Failed"
                                      ? "bg-gray-200 text-gray-700"
                                      : "bg-purple-600 text-white"
                                  }`}
                                >
                                  {status.buttonLabel}
                                </button>
                              ))
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateShippingStatus(
                                    transactionId,
                                    nextStatus.nextStatus
                                  );
                                }}
                                className="px-3 py-1.5 rounded-md text-xs font-medium bg-purple-600 text-white"
                              >
                                {nextStatus.buttonLabel}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-gray-400 mb-3">
                <FontAwesomeIcon icon={faBox} className="text-5xl" />
              </div>
              <p className="text-gray-600">
                No {activeTable === "orders" ? "orders" : "commissions"} found.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-4 border-t border-gray-200 mt-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} Dripstr Express. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ExpressDashboard;
