import React, { useEffect, useState } from "react";
import SideBar from "../Component/Sidebars";
import "../Component/Style.css";
import logo from "../../../assets/shop/logoBlack.png";
import sample1 from "../../../assets/images/samples/5.png";
import { supabase } from "@/constants/supabase";
import OrderCard from "../Component/OrderCard";
import questionEmote from "../../../assets/emote/success.png";
import hmmmEmote from "../../../assets/emote/hmmm.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faTruck,
  faHome,
  faCheckCircle,
  faBoxOpen,
  faBan,
  faStore,
} from "@fortawesome/free-solid-svg-icons";

function Orders({ shopOwnerId }) {
  const [activeTab, setActiveTab] = useState("preparing");
  const [isLoading, setIsLoading] = useState(false);

  const handleFetchOrders = async () => {
    setIsLoading(true);
    await fetchOrdersForMerchant();
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
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
    preparing: [],
    toprepare: [],
    ship: [],
    receive: [],
    shipped: [],
    cancelled: [],
    completed: [],
    refunded: [],
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

      // Update the orders query to explicitly join with shop_Product
      const { data: ordersData, error: orderError } = await supabase
        .from("orders")
        .select(`
          id, 
          shop_transaction_id, 
          prod_num, 
          quantity, 
          total_price, 
          final_price, 
          shipping_fee, 
          acc_num, 
          cancellation_reason,
          cancellation_requested_at,
          refund_status,
          order_variation, 
          order_size, 
          shipping_status,
          shipping_postcode,
          shipping_method,
          shipping_addr,
          estimated_delivery,
          payment_method,
          payment_status,
          
          customizable_note,
          shop_Product!inner (
            id,
            item_Name,
            isCustomizable
          ),
          profiles:acc_num (
            full_name,
            mobile,
            profile_picture,
            address
          )
        `)
        .in("prod_num", productIds)
        .order("id", { ascending: true });

      if (orderError) throw orderError;

      // Process orders and categorize them by status
      const categorizedOrders = {
        preparing: [],
        toprepare: [],
        ship: [],
        receive: [],
        shipped: [],
        cancelled: [],
        completed: [],
        refunded: [],
      };

      // Update the enrichedOrder creation in the forEach loop
      ordersData.forEach((order) => {
        const variant =
          typeof order.order_variation === "string"
            ? JSON.parse(order.order_variation)
            : order.order_variation;

        const sizeDetails =
          typeof order.order_size === "string"
            ? JSON.parse(order.order_size)
            : order.order_size;

        const product = order.shop_Product; // Now directly accessing the joined shop_Product

        const enrichedOrder = {
          ...order,
          variantImg: variant?.imagePath || null,
          variantName: variant?.variant_Name || "N/A",
          size: sizeDetails?.size || "N/A",
          price: sizeDetails?.price || null,
          buyerPhone: order.profiles?.mobile,
          productName: product?.item_Name || "Unknown Product",
          buyerName: order.profiles?.full_name || "Unknown Buyer",
          buyerProfilePic: order.profiles?.profile_picture || "default_avatar.jpg",
          buyerAddress: order.profiles?.address || "Address not set",
          isCustomizable: product?.isCustomizable || false, // Get isCustomizable from shop_Product
          customizable_note: order.customizable_note || null,
        };

        // Add to appropriate category based on shipping_status
        if (order.shipping_status === "Preparing") {
          categorizedOrders.preparing.push(enrichedOrder);
        } else if (order.shipping_status === "To prepare") {
          categorizedOrders.toprepare.push(enrichedOrder);
        } else if (order.shipping_status === "To ship") {
          categorizedOrders.ship.push(enrichedOrder);
        } else if (order.shipping_status === "Delivered") {
          categorizedOrders.shipped.push(enrichedOrder);
        } else if (order.shipping_status === "To receive") {
          categorizedOrders.receive.push(enrichedOrder);
        } else if (order.shipping_status === "Cancel") {
          categorizedOrders.cancelled.push(enrichedOrder);
        } else if (order.shipping_status === "Completed") {
          categorizedOrders.completed.push(enrichedOrder);
        } else if (order.shipping_status === "Returned") {
          categorizedOrders.refunded.push(enrichedOrder);
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

  return (
    <div className="h-full w-full bg-slate-300 p-2 ">
      <div className="absolute mx-3 right-0 z-20">
        <SideBar />
      </div>
      <div className="text-2xl md:text-4xl text-custom-purple font-semibold p-2 py-3 md:pl-20    ">
        {" "}
        Manage Orders{" "}
      </div>
      <div className="w-full h-auto px-2 md:px-10 place-items-center ">
        <div className="w-full rounded-md shadow-md mb-20 md:mb-0 h-[550px] bg-slate-100 p-2">
          <div className="w-full oveflow-hidden overflow-y-scroll custom-scrollbar relative h-full bg-slate-200 rounded-sm">
            <div className="w-full z-10 sticky top-0 h-auto pt-2 glass bg-custom-purple rounded-t-md">
              <ul className="flex justify-around place-items-center  text-slate-300 cursor-pointer">
                <li
                  className={activeTab === "preparing" ? "active-tab" : ""}
                  onClick={() => {
                    setActiveTab("preparing");
                    fetchOrdersForMerchant();
                  }}
                >
                  <span className="text-sm md:text-lg">  <FontAwesomeIcon icon={faBoxOpen} />{" "}Preparing</span>
                </li>
                <li
                  className={activeTab === "toprepare" ? "active-tab" : ""}
                  onClick={() => {setActiveTab("toprepare"); fetchOrdersForMerchant(); }}
                > 
                  <span className="text-sm md:text-lg"> <FontAwesomeIcon icon={faStore} />{" "}In shipment</span>
                </li>
                {/* <li
                  className={activeTab === "ship" ? "active-tab" : ""}
                  onClick={() => {setActiveTab("ship"); fetchOrdersForMerchant(); }}
                > 
                  <span className="text-sm md:text-lg"> <FontAwesomeIcon icon={faBox} />{" "}To ship</span>
                </li> */}
                <li
                  className={activeTab === "receive" ? "active-tab" : ""}
                  onClick={() => {setActiveTab("receive"); fetchOrdersForMerchant();}}
                >
                  <span className="text-sm md:text-lg"> <FontAwesomeIcon icon={faTruck} />{" "}To Receive</span>
                </li>
                <li
                  className={activeTab === "shipped" ? "active-tab" : ""}
                  onClick={() => {setActiveTab("shipped"); fetchOrdersForMerchant(); }}
                >
                  <span className="text-sm md:text-lg"> <FontAwesomeIcon icon={faHome} />{" "}Delivered</span>
                </li>
                <li
                  className={activeTab === "completed" ? "active-tab" : ""}
                  onClick={() => {setActiveTab("completed"); fetchOrdersForMerchant(); }}
                >
                  <span className="text-sm md:text-lg"><FontAwesomeIcon icon={faCheckCircle} />{" "}Completed</span>
                </li>
                <li
                  className={activeTab === "cancelled" ? "active-tab" : ""}
                  onClick={() => {setActiveTab("cancelled"); fetchOrdersForMerchant(); }}
                >
                  <span className="text-sm md:text-lg"> <FontAwesomeIcon icon={faBan} />{" "}Cancelled</span>
                </li>
                <li
                  className={activeTab === "refunded" ? "active-tab" : ""}
                  onClick={() => {setActiveTab("refunded"); fetchOrdersForMerchant(); }}
                >
                  <span className="text-sm md:text-lg"> <FontAwesomeIcon icon={faBoxOpen} />{" "}Returned</span>
                </li>
              </ul>
            </div>
            <div className="w-full h-full bg-slate-200 p-4 ">
              {activeTab === "preparing" && (
                <div className="pb-5">
                  <div className="flex justify-between w-full">
                    <div className="flex justify-between mb-4 w-full">
                      <h2 className="text-xl text-custom-purple font-bold">
                        Preparing Orders
                      </h2>
                      <div
                        onClick={isLoading ? null : handleFetchOrders}
                        className={`justify-items-center place-items-center text-sm text-slate-600 cursor-pointer rounded group 
                hover:text-white bg-white hover:bg-custom-purple glass duration-300 ease-in-out h-auto px-2 flex gap-2
                ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        <div className="justify-items-center place-items-center flex">
                          {isLoading ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <box-icon name="refresh"></box-icon>
                          )}
                        </div>
                        {isLoading ? "Refreshing..." : "Refresh"}
                      </div>
                    </div>
                    {/* <div>
                      <button className="text-sm bg-custom-purple rounded p-2 glass text-white font-normal mb-2">
                        Print all Orders
                      </button>
                    </div> */}
                  </div>
                  <div>
                    {orders.preparing.length > 0 ? (
                      orders.preparing.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          refreshOrders={refreshOrders}
                        />
                      ))
                    ) : (
                      <div className="justify-items-center mt-28">
                        <img src={hmmmEmote} className="h-20 " />
                        <div className="text-slate-800">No orders yet.</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {activeTab === "toprepare" && (
                <div className="pb-5">
                  <h2 className="text-xl text-custom-purple font-bold mb-4">
                    In shipment Orders
                  </h2>
                  {orders.toprepare.length > 0 ? (
                    orders.toprepare.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        refreshOrders={refreshOrders}
                      />
                    ))
                  ) : (
                    <div className="justify-items-center mt-28">
                      <img src={hmmmEmote} className="h-20 " />
                      <div className="text-slate-800">No to prepare orders.</div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === "ship" && (
                <div className="pb-5">
                  <h2 className="text-xl text-custom-purple font-bold mb-4">
                    To ship Orders
                  </h2>
                  {orders.ship.length > 0 ? (
                    orders.ship.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        refreshOrders={refreshOrders}
                      />
                    ))
                  ) : (
                    <div className="justify-items-center mt-28">
                      <img src={hmmmEmote} className="h-20 " />
                      <div className="text-slate-800">No ship orders.</div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === "shipped" && (
                <div className="pb-5">
                  <h2 className="text-xl text-custom-purple font-bold mb-4">
                    Orders delivered
                  </h2>
                  {orders.shipped.length > 0 ? (
                    orders.shipped.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        refreshOrders={refreshOrders}
                      />
                    ))
                  ) : (
                    <div className="justify-items-center mt-28">
                      <img src={hmmmEmote} className="h-20 " />
                      <div className="text-slate-800">
                        No orders to deliver.
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === "receive" && (
                <div className="pb-5">
                  <h2 className="text-xl text-custom-purple font-bold mb-4">
                    On transit Orders
                  </h2>
                  {orders.receive.length > 0 ? (
                    orders.receive.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        refreshOrders={refreshOrders}
                      />
                    ))
                  ) : (
                    <div className="justify-items-center mt-28">
                      <img src={hmmmEmote} className="h-20 " />
                      <div className="text-slate-800">
                        No orders to receive.
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === "cancelled" && (
                <div className="pb-5">
                  <h2 className="text-xl text-custom-purple font-bold mb-4">
                    Cancelled Orders
                  </h2>

                  {orders.cancelled.length > 0 ? (
                    orders.cancelled.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        refreshOrders={refreshOrders}
                      />
                    ))
                  ) : (
                    <div className="justify-items-center mt-28">
                      <img src={questionEmote} className="h-20 " />
                      <div className="text-slate-800">
                        No cancelled to deliver.
                      </div>
                    </div>
                  )}
          
                </div>
              )}
              {activeTab === "completed" && (
                <div className="pb-5">
                  <h2 className="text-xl text-custom-purple font-bold mb-4">
                    Completed Orders
                  </h2>
                  {orders.completed.length > 0 ? (
                    orders.completed.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        refreshOrders={refreshOrders}
                      />
                    ))
                  ) : (
                    <div className="justify-items-center mt-28">
                      <img src={hmmmEmote} className="h-20 " />
                      <div className="text-slate-800">No completed orders.</div>
                    </div>
                  )}
                </div>
              )}
               {activeTab === "refunded" && (
                <div className="pb-5">
                  <h2 className="text-xl text-custom-purple font-bold mb-4">
                    Retuned Orders
                  </h2>
                  {orders.refunded.length > 0 ? (
                    orders.refunded.map((order) => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        refreshOrders={refreshOrders}
                      />
                    ))
                  ) : (
                    <div className="justify-items-center mt-28">
                      <img src={questionEmote} className="h-20 " />
                      <div className="text-slate-800">No orders return.</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Alert */}
    </div>
  );
}

export default Orders;
