import { useState } from "react";
import { supabase } from "@/constants/supabase";

const OrderCard = ({ order, refreshOrders, setOrders }) => {
  const [loading, setLoading] = useState(false);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ order_status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      console.log("Order status updated successfully.");

      if (refreshOrders) {
        refreshOrders();
      }
    } catch (err) {
      console.error("Error updating order status:", err.message);
    }
  };

  return (
    <div className={`border relative rounded-lg p-4 shadow-md mb-4 ${
      order.order_status === "Cancelled" ? "border-red-500 bg-red-100" :  order.order_status === "Delivered" ? "border-green-500 bg-green-100" : "bg-white"
    }`}>
      <div className="w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1.5 rounded-t-md"></div>
      <h2 className="text-lg font-bold text-slate-900">Order #{order.id}</h2>
      <div className="w-full flex gap-2">
        {/* Product Details */}
        <div className="w-full h-auto">
          <div className="flex gap-4 mt-3">
            <div className="p-1 rounded-md shadow-md h-36 w-40 bg-slate-800">
              <img
                src={order.variantImg || "placeholder.jpg"}
                alt={order.variantName || "Product Image"}
                className="h-full bg-slate-900 w-full object-cover rounded-md"
              />
            </div>
            <div className="w-full h-auto">
              <p className="text-sm text-custom-purple">
                Product:{" "}
                <span className="font-medium">{order.productName}</span>
              </p>
              <p className="text-sm text-slate-700">
                Transaction ID:{" "}
                <span className="font-medium">{order.transaction_id}</span>
              </p>
              <p className="text-sm text-slate-700">
                Buyer:{" "}
                <span className="font-medium">{order.buyerName || "N/A"}</span>
              </p>
              <p className="text-sm text-slate-700">
                Address:{" "}
                <span className="font-medium">
                  {order.buyerAddress || "N/A"}
                </span>
              </p>
              <p className="text-sm text-slate-700">
                Phone:{" "}
                <span className="font-medium">{order.buyerPhone || "N/A"}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="w-1/2 pt-3 relative h-auto">
          <p className="text-sm text-slate-700">
            Variant:{" "}
            <span className="font-medium">{order.variantName || "N/A"}</span>
          </p>
          <p className="text-sm text-slate-700">
            Size: <span className="font-medium">{order.size}</span>
          </p>
          <p className="text-sm text-slate-700">
            Quantity: <span className="font-medium">{order.quantity}</span>
          </p>
          <p className="text-sm text-slate-700">
            Price: <span className="font-medium">₱{order.total_price}</span>
          </p>
          <p className="text-sm text-slate-700">
            Shipping Fee:{" "}
            <span className="font-medium">₱{order.shipping_fee || "N/A"}</span>
          </p>

          <p className="text-2xl font-semibold absolute bottom-0 right-0 text-yellow-600">
            Total: ₱
            {order.final_price || order.total_price + order.shipping_fee}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end mt-4">
        {order.order_status === "To pay" && (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={() => updateOrderStatus(order.id, "To ship")}
            disabled={loading}
          >
            {loading ? "Updating..." : "Mark as To Ship"}
          </button>
        )}
        {order.order_status === "To ship" && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 ml-2"
            onClick={() => updateOrderStatus(order.id, "Shipped")}
            disabled={loading}
          >
            {loading ? "Updating..." : "Mark as Shipped"}
          </button>
        )}
        {order.order_status === "Shipped" && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 ml-2"
            onClick={() => updateOrderStatus(order.id, "Delivered")}
            disabled={loading}
          >
            {loading ? "Updating..." : "Delivered"}
          </button>
        )}
        {order.order_status === "Cancelled" && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 ml-2"
            onClick={() => updateOrderStatus(order.id, "Cancelled")}
            disabled={loading}
          >
            {loading ? "Updating..." : "Cancel"}
          </button>
        )}
        {order.order_status === "Completed" && (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 ml-2"
            disabled={loading}
          >
            {loading ? "Updating..." : "Okay"}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;
