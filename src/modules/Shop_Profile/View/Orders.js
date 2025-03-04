import React, { useEffect, useState } from "react";
import SideBar from "../Component/Sidebars";
import "../Component/Style.css";
import logo from "../../../assets/shop/logoBlack.png";
import sample1 from "../../../assets/images/samples/5.png";
import { supabase } from "@/constants/supabase";
import OrderCard from "../Component/OrderCard";
import questionEmote from "../../../assets/emote/success.png"

function Orders({ shopOwnerId }) {
  const [activeTab, setActiveTab] = useState("new-orders");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [isModalOpen4, setIsModalOpen4] = useState(false);
  const [isModalOpen5, setIsModalOpen5] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const handlePrepare = () => {
    setIsModalOpen2(true);
  };
  const handleDeliver = () => {
    setIsModalOpen3(true);
  };
  const handleCancelled = () => {
    setIsModalOpen4(true);
  };
  const handleCompleted = () => {
    setIsModalOpen5(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsModalOpen2(false);
    setIsModalOpen3(false);
    setIsModalOpen4(false);
    setIsModalOpen5(false);
    setSelectedOrder(null);
  };

  useEffect(() => {
    const fetchUserProfileAndShop = async () => {
      try {
        // Get current authenticated user
        const { data: userData, error: authError } =
          await supabase.auth.getUser();
        if (authError) {
          console.error("Auth Error:", authError.message);
          return;
        }

        const user = userData?.user;
        if (!user) {
          console.error("No user is signed in.");
          return;
        }

        // Fetch the shop owned by the current user
        const { data: shops, error: shopError } = await supabase
          .from("shop")
          .select("id")
          .eq("owner_Id", user.id);

        if (shopError) throw shopError;

        if (shops?.length > 0) {
          const shopId = shops[0].id;

          // Fetch only product IDs
          const { data: products, error: productError } = await supabase
            .from("shop_Product")
            .select("id")
            .eq("shop_Id", shopId);

          if (productError) throw productError;

          // Console log only the product IDs
          console.log(
            "Product IDs:",
            products.map((p) => p.id)
          );
        } else {
          console.error("No shop found for the current user.");
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchUserProfileAndShop();
  }, []);

  //setting order status
  const [orders, setOrders] = useState({
    newOrders: [],
    preparing: [],
    ship: [],
    shipped: [],
    cancelled: [],
    completed: [],
  });
  const fetchOrdersForMerchant = async () => {
    try {
      const { data: userData, error: authError } =
        await supabase.auth.getUser();
      if (authError) {
        console.error("Auth Error:", authError.message);
        return;
      }

      const user = userData?.user;
      if (!user) {
        console.error("No user is signed in.");
        return;
      }

      // Fetch the shop owned by the merchant
      const { data: shops, error: shopError } = await supabase
        .from("shop")
        .select("id")
        .eq("owner_Id", user.id);

      if (shopError) throw shopError;
      if (!shops || shops.length === 0) {
        console.error("No shop found for this user.");
        return;
      }

      const shopId = shops[0].id;

      // Fetch product IDs from the shop
      const { data: products, error: productError } = await supabase
        .from("shop_Product")
        .select("id, item_Name")
        .eq("shop_Id", shopId);

      if (productError) throw productError;
      if (!products || products.length === 0) {
        console.error("No products found for this shop.");
        return;
      }

      const productIds = products.map((p) => p.id);

      // Fetch orders with buyer details
      const { data: ordersData, error: orderError } = await supabase
        .from("orders")
        .select(
          `
          id, 
          transaction_id, 
          order_status, 
          prod_num, 
          quantity, 
          total_price, 
          final_price, 
          shipping_fee, 
          acc_num, 
          order_variation, 
          order_size, 
          shipping_status,
          shipping_postcode,
          shipping_method,
          estimated_delivery,
          profiles:acc_num (full_name, mobile, profile_picture, address)
          `
        )
        .in("prod_num", productIds);

      if (orderError) throw orderError;

      // Process orders and categorize them by status
      const categorizedOrders = {
        newOrders: [],
        preparing: [],
        ship: [],
        shipped: [],
        cancelled: [],
        completed: [],
      };

      ordersData.forEach((order) => {
        const variant =
          typeof order.order_variation === "string"
            ? JSON.parse(order.order_variation)
            : order.order_variation;

        const sizeDetails =
          typeof order.order_size === "string"
            ? JSON.parse(order.order_size)
            : order.order_size;

        const product = products.find((p) => p.id === order.prod_num);

        const enrichedOrder = {
          ...order,
          variantImg: variant?.imagePath || null,
          variantName: variant?.variant_Name || "N/A",
          size: sizeDetails?.size || "N/A",
          price: sizeDetails?.price || null,
          buyerPhone: order.profiles?.mobile,
          productName: product ? product.item_Name : "Unknown Product",
          buyerName: order.profiles?.full_name || "Unknown Buyer",
          buyerProfilePic:
            order.profiles?.profile_picture || "default_avatar.jpg",
          buyerAddress: order.profiles?.address || "Address not set",
        };

        if (order.order_status === "To pay") {
          categorizedOrders.newOrders.push(enrichedOrder);
        } else if (order.order_status === "To prepare") {
          categorizedOrders.preparing.push(enrichedOrder);
        } else if (order.order_status === "To ship") {
          categorizedOrders.ship.push(enrichedOrder);
        } else if (order.order_status === "To deliver") {
          categorizedOrders.shipped.push(enrichedOrder);
        } else if (order.order_status === "Cancelled") {
          categorizedOrders.cancelled.push(enrichedOrder);
        } else if (order.order_status === "Delivered") {
          categorizedOrders.completed.push(enrichedOrder);
        }
      });

      setOrders(categorizedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error.message);
    }
  };

  const refreshOrders = () => {
    fetchOrdersForMerchant();
  };

  // Fetch orders when the component mounts
  useEffect(() => {
    fetchOrdersForMerchant();
  }, []);

  const Name = "Jane Doe";
  const Address = "54 Barangay Bagong Silangyatas, Quezon City ";
  const Phone = "09295374051";

  return (
    <div className="h-full w-full bg-slate-300 p-2 ">
      <div className="absolute mx-3 right-0 z-20">
        <SideBar />
      </div>
      <div className="text-2xl md:text-4xl text-custom-purple font-semibold p-2 py-3 md:pl-20    ">
        {" "}
        Manage Orders{" "}
      </div>
      <div className="w-full h-auto px-2 md:px-20 place-items-center ">
        <div className="w-full rounded-md shadow-md mb-20 md:mb-0 h-[550px] bg-slate-100 p-2">
          <div className="w-full oveflow-hidden overflow-y-scroll custom-scrollbar relative h-full bg-slate-200 rounded-sm">
            <div className="w-full z-10 sticky top-0 h-auto pt-2 glass bg-custom-purple rounded-t-md">
              <ul className="flex justify-around place-items-center  text-slate-300 cursor-pointer">
                <li
                  className={activeTab === "new-orders" ? "active-tab" : ""}
                  onClick={() => setActiveTab("new-orders")}
                >
                  <span className="text-sm md:text-lg">New Orders</span>
                </li>
                <li
                  className={activeTab === "preparing" ? "active-tab" : ""}
                  onClick={() => setActiveTab("preparing")}
                >
                  <span className="text-sm md:text-lg">Preparing</span>
                </li>
                <li
                  className={activeTab === "ship" ? "active-tab" : ""}
                  onClick={() => setActiveTab("ship")}
                >
                  <span className="text-sm md:text-lg">To ship</span>
                </li>
                <li
                  className={activeTab === "shipped" ? "active-tab" : ""}
                  onClick={() => setActiveTab("shipped")}
                >
                  <span className="text-sm md:text-lg">To Deliver</span>
                </li>
                <li
                  className={activeTab === "cancelled" ? "active-tab" : ""}
                  onClick={() => setActiveTab("cancelled")}
                >
                  <span className="text-sm md:text-lg">Cancelled</span>
                </li>
                <li
                  className={activeTab === "completed" ? "active-tab" : ""}
                  onClick={() => setActiveTab("completed")}
                >
                  <span className="text-sm md:text-lg">Completed</span>
                </li>
              </ul>
            </div>
            <div className="w-full h-full bg-slate-200 p-4 ">
              {activeTab === "new-orders" && (
                <div>
                  <h2 className="text-xl text-custom-purple font-bold mb-4">
                    New Orders
                  </h2>
                  {orders.newOrders.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      refreshOrders={fetchOrdersForMerchant}
                    />
                  ))}
                </div>
              )}

              {activeTab === "preparing" && (
                <div>
                  <div className="flex justify-between">
                    <div>
                      <h2 className="text-xl text-custom-purple font-bold mb-4">
                        Preparing Orders
                      </h2>
                    </div>
                    {/* <div>
                      <button className="text-sm bg-custom-purple rounded p-2 glass text-white font-normal mb-2">
                        Print all Orders
                      </button>
                    </div> */}
                  </div>
                  <div>
                    {orders.preparing.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        refreshOrders={refreshOrders}
                      />
                    ))}
                  </div>
                </div>
              )}
              {activeTab === "ship" && (
                <div>
                  <h2 className="text-xl text-custom-purple font-bold mb-4">
                    On transit Orders
                  </h2>
                  {orders.ship.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      refreshOrders={refreshOrders}
                    />
                  ))}
                </div>
              )}
              {activeTab === "shipped" && (
                <div>
                  <h2 className="text-xl text-custom-purple font-bold mb-4">
                    On transit Orders
                  </h2>
                  {orders.shipped.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      refreshOrders={refreshOrders}
                    />
                  ))}
                </div>
              )}
              {activeTab === "cancelled" && (
                <div>
                  <h2 className="text-xl text-custom-purple font-bold mb-4">
                    Cancelled Orders
                  </h2>
                  {orders.cancelled.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      refreshOrders={refreshOrders}
                    />
                  ))}
                </div>
              )}
              {activeTab === "completed" && (
                <div>
                  <h2 className="text-xl text-custom-purple font-bold mb-4">
                    Completed Orders
                  </h2>
                  {orders.completed.map((order) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      refreshOrders={refreshOrders}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alert */}
 
      {/* TO DELIVER */}
      {isModalOpen2 && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 ">
          <div className="bg-white rounded-lg p-5 w-full md:w-1/2 lg:w-1/2 m-2 md:m-0 auto">
            <h2 className="font-medium text-slate-800 py-2  ">
              <span className="font-bold text-[20px] md:text-2xl">
                Order Information
              </span>
            </h2>
            <div className="h-auto w-full bg-slate-200 relative rounded-md shadow-sm mb-2 p-2 md:flex gap-2">
              <div className="z-0 h-20 w-20 blur-sm justify-end bottom-0 right-0 absolute">
                <img
                  src={logo}
                  alt="Shop Logo"
                  className="drop-shadow-custom h-full w-full object-cover rounded-md"
                  sizes="100%"
                />
              </div>
              <div className="w-1/3 h-full bg-slate-100">
                <img
                  src={sample1}
                  alt="Shop Logo"
                  className="drop-shadow-custom h-full w-full object-cover rounded-md"
                  sizes="100%"
                />
              </div>
              <div className="w-full md:w-2/3 h-auto  p-2 relative ">
                <div className=" flex w-full  justify-between place-items-center ">
                  <div className=" text-lg md:text-3xl font-bold text-slate-950  ">
                    Viscount Black
                  </div>
                  <div className=" text-xl font-semibold text-slate-950  ">
                    ID: 10
                  </div>
                </div>
                <a className="text-sm text-custom-purple font-semibold ">
                  Name: <span className="text-slate-900"> {Name} </span>{" "}
                </a>{" "}
                <br />
                <a className="text-sm text-custom-purple font-semibold ">
                  Address: <span className="text-slate-900"> {Address} </span>{" "}
                </a>{" "}
                <br />
                <a className="text-sm text-custom-purple font-semibold ">
                  Phone number:{" "}
                  <span className="text-slate-900"> {Phone} </span>{" "}
                </a>
                <div className="text-custom-purple text-sm font-semibold">
                  Variant:{" "}
                  <span className="text-sm text-slate-800"> Blue </span>
                </div>
                <div className="text-custom-purple text-sm font-semibold">
                  Size: <span className="text-sm text-slate-800"> XL </span>
                </div>
                <div className="text-custom-purple text-sm font-semibold">
                  Vouchers:{" "}
                  <span className="text-sm text-slate-800"> 20% off </span>
                </div>
                <div className="text-custom-purple text-sm font-semibold">
                  Item Price:{" "}
                  <span className="text-sm text-slate-800"> ₱140 </span>
                </div>
                <div className="text-custom-purple text-sm font-semibold">
                  Delivery fee:{" "}
                  <span className="text-sm text-slate-800"> ₱30 </span>
                </div>
                <div className="text-custom-purple text-sm font-semibold">
                  Changed mind Reason:{" "}
                  <span className="text-sm text-slate-800">
                    {" "}
                    Mistakenly order{" "}
                  </span>
                </div>
                <div className="text-xl font-semibold right-2  text-slate-900 bottom-0 absolute">
                  PRICE: <span className="text-yellow-600 text-3xl"> ₱150</span>{" "}
                </div>
              </div>
            </div>
            <div className="flex justify-between w-full">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <div className=" flex gap-2 md:gap-4">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                  onClick={handleCloseModal}
                >
                  SHIP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* OTW */}
      {isModalOpen3 && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 ">
          <div className="bg-white rounded-lg p-5 w-full md:w-1/2 lg:w-1/2 m-2 md:m-0 auto">
            <h2 className="font-medium text-slate-800 py-2  ">
              <span className="font-bold text-[20px] md:text-2xl">
                Order Information
              </span>
            </h2>
            <div className="h-auto w-full bg-slate-200 relative rounded-md shadow-sm mb-2 p-2 md:flex gap-2">
              <div className="z-0 h-20 w-20 blur-sm justify-end bottom-0 right-0 absolute">
                <img
                  src={logo}
                  alt="Shop Logo"
                  className="drop-shadow-custom h-full w-full object-cover rounded-md"
                  sizes="100%"
                />
              </div>
              <div className="w-1/3 h-full bg-slate-100">
                <img
                  src={sample1}
                  alt="Shop Logo"
                  className="drop-shadow-custom h-full w-full object-cover rounded-md"
                  sizes="100%"
                />
              </div>
              <div className="w-full md:w-2/3 h-auto  p-2 relative ">
                <div className=" flex w-full  justify-between place-items-center ">
                  <div className=" text-lg md:text-3xl font-bold text-slate-950  ">
                    Viscount Black
                  </div>
                  <div className=" text-xl font-semibold text-slate-950  ">
                    ID: 10
                  </div>
                </div>
                <a className="text-sm text-custom-purple font-semibold ">
                  Name: <span className="text-slate-900"> {Name} </span>{" "}
                </a>{" "}
                <br />
                <a className="text-sm text-custom-purple font-semibold ">
                  Address: <span className="text-slate-900"> {Address} </span>{" "}
                </a>{" "}
                <br />
                <a className="text-sm text-custom-purple font-semibold ">
                  Phone number:{" "}
                  <span className="text-slate-900"> {Phone} </span>{" "}
                </a>
                <div className="text-custom-purple text-sm font-semibold">
                  Variant:{" "}
                  <span className="text-sm text-slate-800"> Blue </span>
                </div>
                <div className="text-custom-purple text-sm font-semibold">
                  Size: <span className="text-sm text-slate-800"> XL </span>
                </div>
                <div className="text-custom-purple text-sm font-semibold">
                  Vouchers:{" "}
                  <span className="text-sm text-slate-800"> 20% off </span>
                </div>
                <div className="text-custom-purple text-sm font-semibold">
                  Item Price:{" "}
                  <span className="text-sm text-slate-800"> ₱140 </span>
                </div>
                <div className="text-custom-purple text-sm font-semibold">
                  Delivery fee:{" "}
                  <span className="text-sm text-slate-800"> ₱30 </span>
                </div>
                <div className="text-custom-purple text-sm font-semibold">
                  Status:{" "}
                  <span className="text-sm text-slate-800"> In Transit </span>
                </div>
                <div className="text-xl font-semibold right-2  text-slate-900 bottom-0 absolute">
                  PRICE: <span className="text-yellow-600 text-3xl"> ₱150</span>{" "}
                </div>
              </div>
            </div>
            <div className="flex justify-between w-full">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button className="bg-green-500 cursor-not-allowed text-white px-4 py-2 rounded hover:bg-green-700">
                Completed
              </button>
            </div>
          </div>
        </div>
      )}
      {/* CANCELLED */}
      {isModalOpen4 && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 ">
          <div className="bg-white rounded-lg p-5 w-full md:w-1/2 lg:w-1/2 m-2 md:m-0 auto">
            <h2 className="font-medium text-slate-800 py-2  ">
              <span className="font-bold text-[20px] md:text-2xl">
                Order Cancelled
              </span>
            </h2>
            <div className="h-auto w-full bg-slate-200 relative rounded-md shadow-sm mb-2 p-2 md:flex gap-2">
              <div className="z-0 h-20 w-20 blur-sm justify-end bottom-0 right-0 absolute">
                <img
                  src={logo}
                  alt="Shop Logo"
                  className="drop-shadow-custom h-full w-full object-cover rounded-md"
                  sizes="100%"
                />
              </div>
              <div className="w-1/3 h-full bg-slate-100">
                <img
                  src={sample1}
                  alt="Shop Logo"
                  className="drop-shadow-custom h-full w-full object-cover rounded-md"
                  sizes="100%"
                />
              </div>
              <div className="w-full md:w-2/3 h-auto  p-2 relative ">
                <div className=" flex w-full  justify-between place-items-center ">
                  <div className=" text-lg md:text-3xl font-bold text-slate-950  ">
                    Viscount Black
                  </div>
                  <div className=" text-xl font-semibold text-slate-950  ">
                    ID: 10
                  </div>
                </div>
                <a className="text-sm text-custom-purple font-semibold ">
                  Name: <span className="text-slate-900"> {Name} </span>{" "}
                </a>{" "}
                <br />
                <a className="text-sm text-custom-purple font-semibold ">
                  Address: <span className="text-slate-900"> {Address} </span>{" "}
                </a>{" "}
                <br />
                <a className="text-sm text-custom-purple font-semibold ">
                  Phone number:{" "}
                  <span className="text-slate-900"> {Phone} </span>{" "}
                </a>
                <div className="text-custom-purple text-sm font-semibold">
                  Variant:{" "}
                  <span className="text-sm text-slate-800"> Blue </span>
                </div>
                <div className="text-custom-purple text-sm font-semibold">
                  Size: <span className="text-sm text-slate-800"> XL </span>
                </div>
                <div className="text-custom-purple text-sm font-semibold">
                  Vouchers:{" "}
                  <span className="text-sm text-slate-800"> 20% off </span>
                </div>
                <div className="text-custom-purple text-sm font-semibold">
                  Item Price:{" "}
                  <span className="text-sm text-slate-800"> ₱140 </span>
                </div>
                <div className="text-custom-purple text-sm font-semibold">
                  Delivery fee:{" "}
                  <span className="text-sm text-slate-800"> ₱30 </span>
                </div>
                <div className="text-xl font-semibold right-2  text-slate-900 bottom-0 absolute">
                  PRICE: <span className="text-yellow-600 text-3xl"> ₱150</span>{" "}
                </div>
              </div>
            </div>
            <div className="flex justify-between w-full">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* COMPLETED */}
      {isModalOpen5 && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 ">
          <div className="bg-white rounded-lg p-5 w-full md:w-1/2 lg:w-1/2 m-2 md:m-0 auto">
            <h2 className="font-medium text-slate-800 py-2  ">
              <span className="font-bold text-[20px] md:text-2xl">
                Order Completed
              </span>
            </h2>
            <div className="h-auto w-full bg-slate-200 relative rounded-md shadow-sm mb-2 p-2 md:flex gap-2">
              <div className="z-0 h-20 w-20 blur-sm justify-end bottom-0 right-0 absolute">
                <img
                  src={logo}
                  alt="Shop Logo"
                  className="drop-shadow-custom h-full w-full object-cover rounded-md"
                  sizes="100%"
                />
              </div>
              <div className="w-1/3 h-full bg-slate-100">
                <img
                  src={sample1}
                  alt="Shop Logo"
                  className="drop-shadow-custom h-full w-full object-cover rounded-md"
                  sizes="100%"
                />
              </div>
              <div className="w-full md:w-2/3 h-auto  p-2 relative ">
                <div className=" flex w-full  justify-between place-items-center ">
                  <div className=" text-lg md:text-3xl font-bold text-slate-950  ">
                    Viscount Black
                  </div>
                  <div className=" text-xl font-semibold text-slate-950  ">
                    ID: 10
                  </div>
                </div>
                <a className="text-sm text-custom-purple font-semibold ">
                  Name: <span className="text-slate-900"> {Name} </span>{" "}
                </a>{" "}
                <br />
                <a className="text-sm text-custom-purple font-semibold ">
                  Address: <span className="text-slate-900"> {Address} </span>{" "}
                </a>{" "}
                <br />
                <a className="text-sm text-custom-purple font-semibold ">
                  Phone number:{" "}
                  <span className="text-slate-900"> {Phone} </span>{" "}
                </a>
                <div className="text-custom-purple text-sm font-semibold">
                  Variant:{" "}
                  <span className="text-sm text-slate-800"> Blue </span>
                </div>
                <div className="text-custom-purple text-sm font-semibold">
                  Size: <span className="text-sm text-slate-800"> XL </span>
                </div>
                <div className="text-custom-purple text-sm font-semibold">
                  Vouchers:{" "}
                  <span className="text-sm text-slate-800"> 20% off </span>
                </div>
                <div className="text-custom-purple text-sm font-semibold">
                  Item Price:{" "}
                  <span className="text-sm text-slate-800"> ₱140 </span>
                </div>
                <div className="text-custom-purple text-sm font-semibold">
                  Delivery fee:{" "}
                  <span className="text-sm text-slate-800"> ₱30 </span>
                </div>
                <div className="text-xl font-semibold right-2  text-slate-900 bottom-0 absolute">
                  PRICE: <span className="text-yellow-600 text-3xl"> ₱150</span>{" "}
                </div>
              </div>
            </div>
            <div className="flex justify-between w-full">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
