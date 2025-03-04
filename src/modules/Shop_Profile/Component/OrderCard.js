import { useState, useRef } from "react";
import { supabase } from "@/constants/supabase";
import { useReactToPrint } from 'react-to-print';

const OrderCard = ({ order, refreshOrders, setOrders }) => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); //Print order report
  const [selectedOrder, setSelectedOrder] = useState(null);


  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("orders")
        .update({ order_status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      console.log(`Order ${orderId} status updated to ${newStatus}`);

      if (refreshOrders) {
        refreshOrders();
      } else if (setOrders) {
        setOrders((prevOrders) =>
          prevOrders.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error("Error updating order status:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({ contentRef });



  return (
    <div className={`border relative rounded-lg p-4 shadow-md mb-4 ${order.order_status === "Cancelled" ? "border-red-500 bg-red-100" : order.order_status === "Delivered" ? "border-green-500 bg-green-100" : "bg-white"
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
            onClick={() => setIsModalOpen(true)}
          >
            {loading ? "Updating..." : "Mark to deliver"}
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

      {/* Modal Print Report */}
      {isModalOpen && (
        <dialog id="print" className="fixed z-10 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 text-slate-800 rounded shadow-lg w-auto">
            <h2 className="text-lg font-semibold mb-4">Order Details</h2>

            {/* Only wrap the content inside this div for printing */}
            <div ref={contentRef} className="p-4 border border-gray-300">
              <p className="text-xl mb-2 font-semibold text-slate-900">
                Transaction ID:{" "}
                <span className="font-normal text-md ">{order.transaction_id}</span>
              </p>
              <div  className="w-full h-auto flex gap-2">
                <div className="p-1 rounded-md shadow-md h-36 w-40 bg-slate-800">
                  <img
                    src={order.variantImg || "placeholder.jpg"}
                    alt={order.variantName || "Product Image"}
                    className="h-full bg-slate-900 w-full object-cover rounded-md"
                  />
                </div>

                <div className="w-1/2 pt-3 relative h-auto">
                  <p className="text-sm text-slate-700">
                    <strong>Product: </strong>{" "}
                    <span className="font-medium">{order.productName || "N/A"}</span>
                  </p>
                  <p className="text-sm text-slate-700">
                    <strong>Receiver: </strong><span className="font-medium">{order.buyerName || "N/A"}</span>
                  </p>
                  <p className="text-sm text-slate-700">
                    <strong>Address: </strong><span className="font-medium"> {order.buyerAddress || "N/A"}</span>
                  </p>
                  <p className="text-sm text-slate-700">
                    <strong>Mobile number: </strong><span className="font-medium">{order.buyerPhone || "N/A"}</span>
                  </p>
                </div>

                <div className="w-1/2 pt-3 relative h-auto">
                  <p className="text-sm text-slate-700">
                    <strong>Variant:</strong>{" "}
                    <span className="font-medium">{order.variantName || "N/A"}</span>
                  </p>
                  <p className="text-sm text-slate-700">
                    <strong>Size: </strong><span className="font-medium">{order.size}</span>
                  </p>
                  <p className="text-sm text-slate-700">
                    <strong>Quantity: </strong><span className="font-medium">{order.quantity}</span>
                  </p>
                  <p className="text-sm text-slate-700">
                    <strong>Price: </strong><span className="font-medium">₱{order.total_price}</span>
                  </p>
                  <p className="text-sm text-slate-700">
                    <strong>Shipping Fee: {" "}</strong>
                    <span className="font-medium">₱{order.shipping_fee || "N/A"}</span>
                  </p>

                </div>
              </div>

              <div className="mt-2 flex items-center justify-end w-full"><strong className="text-semibold">Total Price: </strong> {" "} <p className="text-xl">₱{order.total_price.toFixed(2)}</p></div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={handlePrint}
              >
                Print Receipt
              </button>
            </div>
          </div>
        </dialog>
      )}


    </div>
  );
};

export default OrderCard;
