import { useState, useRef, useEffect } from "react";
import { supabase } from "@/constants/supabase";
import { useReactToPrint } from "react-to-print";
import Logo from "../../../assets/logoName.png";
const OrderCard = ({ order, refreshOrders, setOrders }) => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); //Print order report
  const [shopData, setShopData] = useState([]);
  const [isModalOpenToDeliver, setIsModalOpenToDeliver] = useState(false);
  const [isModalOpenToProcess, setIsModalOpenToProcess] = useState(false);
  const [isModalOpenToPrepare, setIsModalOpenToPrepare] = useState(false);
  const [isModalOpenToCancel, setIsModalOpenToCancel] = useState(false);
  const [openDeliveryInfo, setOpenDeliveryInfo] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const { data: userData, error: userError } =
          await supabase.auth.getUser();
        if (userError || !userData.user)
          return console.error("Error or no user:", userError);

        const { data, error } = await supabase
          .from("shop")
          .select("shop_image, shop_name, address")
          .eq("owner_Id", userData.user.id)
          .single();

        if (error)
          return console.error("Error fetching shop image:", error.message);

        if (data) {
          setShopData(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err.message);
      }
    };

    fetchShop();
  }, []);

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
          prevOrders.map((o) =>
            o.id === orderId ? { ...o, order_status: newStatus } : o
          )
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

  //modal for confirmation
  const handleProcess = () => {
    updateOrderStatus(order.id, "To prepare");
    setIsModalOpenToProcess(false);
  };
  const handlePrepare = () => {
    updateOrderStatus(order.id, "To ship");
    setIsModalOpenToPrepare(false);
  };
  const handleConfirm = () => {
    updateOrderStatus(order.id, "To deliver");
    setIsModalOpenToDeliver(false);
  };
  const handleCancel = () => {
    updateOrderStatus(order.id, "Cancelled");
    setIsModalOpenToCancel(false);
  };

  const handleOpenDeliveryInfo = () => {
    console.log("Selected Order Data:", order);

    setSelectedOrder({
      shipping_status: order?.shipping_status ?? "No Status",
      estimated_delivery: order?.estimated_delivery ?? "No Delivery Date",
      shipping_postcode: order?.shipping_postcode ?? "No Postcode",
      shipping_method: order?.shipping_method ?? "No Selected Method",
    });

    setOpenDeliveryInfo(true);
  };

  return (
    <div
      className={`border relative rounded-lg p-4 shadow-md mb-4 ${
        order.order_status === "Cancelled"
          ? "border-red-500 bg-red-100"
          : order.order_status === "Delivered"
          ? "border-green-500 bg-green-100"
          : "bg-white"
      }`}
    >
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

              {order.order_status === "To prepare" && (
                <p className="text-sm text-slate-700">
                  Cancel:{" "}
                  <span className="font-medium">
                    {order.buyerPhone || "N/A"}
                  </span>
                </p>
              )}
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
            <span className="font-medium">₱{order.shipping_fee}</span>
          </p>
          <p className="text-sm text-slate-700">
            Shipping method:{" "}
            <span className="font-medium">{order.shipping_method}</span>
          </p>
          <p className="text-xl font-semibold absolute bottom-0 right-0 text-yellow-600">
            Total: ₱
            {order.final_price || order.total_price + order.shipping_fee}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end mt-4">
        {order.order_status === "To pay" && (
          <button
            className="bg-blue-500 text-sm text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={() => setIsModalOpenToProcess(true)}
            disabled={loading}
          >
            {loading ? "Updating..." : "Mark as to prepare"}
          </button>
        )}
        {order.order_status === "To prepare" && (
          <div className="flex gap-2">
            <button
              className="bg-gray-500 text-sm text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50 ml-2"
              onClick={() => setIsModalOpenToCancel(true)}
              disabled={loading}
            >
              {loading ? "Updating..." : "Cancel order"}
            </button>
            <button
              className="bg-blue-500 text-sm text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              onClick={() => setIsModalOpenToPrepare(true)}
              disabled={loading}
            >
              {loading ? "Updating..." : "Mark as to ship"}
            </button>
          </div>
        )}
        {order.order_status === "To ship" && (
          <div className="flex gap-2">
            <button
              className="bg-green-500 text-sm text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 "
              onClick={() => setIsModalOpen(true)}
            >
              {loading ? "Updating..." : "Print"}
            </button>
            <button
              className="bg-blue-500 text-sm text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              onClick={() => setIsModalOpenToDeliver(true)}
              disabled={loading}
            >
              {loading ? "Updating..." : "Set to deliver"}
            </button>
          </div>
        )}
        {order.order_status === "To deliver" && (
          <button
            className="bg-blue-500 text-sm text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={handleOpenDeliveryInfo}
            disabled={loading}
          >
            {loading ? "Updating..." : "Status"}
          </button>
        )}
        {order.order_status === "Completed" && (
          <button
            className="bg-green-500 text-sm text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 ml-2"
            disabled={loading}
          >
            {loading ? "Updating..." : "Okay"}
          </button>
        )}
      </div>

      {/* Modal Print Report */}
      {isModalOpen && (
        <dialog
          id="print"
          className="fixed inset-0  w-full h-full py-10 bg-black bg-opacity-70 md:flex justify-center items-center z-50"
        >
          <div className="bg-slate-200 p-4 ext-slate-800 rounded shadow-lg w-auto">
            <div
              ref={contentRef}
              className="max-w-md mx-auto bg-white shadow-lg border border-gray-300 px-5 py-4 rounded-lg"
            >
              {/* Header */}
              <div className="text-center border-b pb-4">
                <div className=" h-7 justify-items-center ">
                  <img
                    src={Logo}
                    alt="Product Image"
                    className="h-full w-auto"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Transaction ID:{" "}
                  <span className="font-medium">{order.transaction_id}</span>
                </p>
              </div>

              {/* Product Section */}
              <div className="flex gap-4 mt-4">
                <div className="p-1 rounded-md shadow-md h-36 w-36 bg-slate-800">
                  <img
                    src={order.variantImg || "placeholder.jpg"}
                    alt={order.variantName || "Product Image"}
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-sm text-slate-700">
                    <strong>Product:</strong> {order.productName || "N/A"}
                  </p>
                  <p className="text-sm text-slate-700">
                    <strong>Variant:</strong> {order.variantName || "N/A"}
                  </p>
                  <p className="text-sm text-slate-700">
                    <strong>Size:</strong> {order.size}
                  </p>
                  <p className="text-sm text-slate-700">
                    <strong>Quantity:</strong> {order.quantity}
                  </p>
                  <p className="text-sm text-slate-700">
                    <strong>Price per Item:</strong> ₱
                    {(order.total_price / order.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-slate-700">
                    <strong>Shop:</strong> {shopData?.shop_name || "N/A"}
                  </p>
                  <p className="text-sm text-slate-700">
                    <strong>Address:</strong> {shopData?.address || "N/A"}
                  </p>
                </div>
              </div>

              {/* Shipping Details */}
              <div className="mt-4 border-t pt-4">
                <h3 className="text-md font-semibold text-slate-900">
                  Shipping Details
                </h3>
                <p className="text-sm text-slate-700">
                  <strong>Receiver:</strong> {order.buyerName || "N/A"}
                </p>
                <p className="text-sm text-slate-700">
                  <strong>Address:</strong> {order.buyerAddress || "N/A"}
                </p>
                <p className="text-sm text-slate-700">
                  <strong>Mobile Number:</strong> {order.buyerPhone || "N/A"}
                </p>
              </div>

              {/* Pricing Summary */}
              <div className="mt-4 border-t pt-4">
                <h3 className="text-md font-semibold text-slate-900">
                  Order Summary
                </h3>
                <p className="text-sm text-slate-700">
                  <strong>Subtotal:</strong> ₱{order.total_price.toFixed(2)}
                </p>
                <p className="text-sm text-slate-700">
                  <strong>Shipping Fee:</strong> ₱{order.shipping_fee}
                </p>
                <div className="flex justify-end gap-2 items-center mt-2 font-semibold text-lg">
                  <span className="text-slate-800 text-sm">Total Price:</span>
                  <span className="text-xl text-custom-purple">
                    ₱
                    {(order.total_price + (order.shipping_fee || 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-xs text-gray-500 mt-4 border-t pt-2">
                <p>Thank you for shopping with Dripstr!</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-gray-300 px-4 py-2  text-sm text-slate-900 rounded hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-custom-purple duration-200 text-white text-sm px-4 py-2 rounded hover:bg-primary-color"
                onClick={handlePrint}
              >
                Print Receipt
              </button>
            </div>
          </div>
        </dialog>
      )}

      {isModalOpenToDeliver && (
        <div className="fixed inset-0 flex z-10 items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg text-slate-900 font-semibold">
              Confirm Deliver
            </p>
            <p className="text-sm text-gray-800">
              Are you sure you want to set this order to "To deliver"?
            </p>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 text-sm text-slate-900 rounded hover:bg-gray-400"
                onClick={() => setIsModalOpenToDeliver(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500  text-sm text-slate-900 px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpenToProcess && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg text-slate-900 font-semibold">
              Confirm to ship
            </p>
            <p className="text-sm text-gray-800">
              Are you sure you want to set this order to "To prepare"?
            </p>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-2  text-sm text-slate-900 rounded hover:bg-gray-400"
                onClick={() => setIsModalOpenToProcess(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500  text-sm text-slate-900 px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleProcess}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpenToPrepare && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg text-slate-900 font-semibold">
              Confirm to ship
            </p>
            <p className="text-sm text-gray-800">
              Are you sure you want to set this order to "To ship"?
            </p>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-2  text-sm text-slate-900 rounded hover:bg-gray-400"
                onClick={() => setIsModalOpenToPrepare(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500  text-sm text-slate-900 px-4 py-2 rounded hover:bg-blue-700"
                onClick={handlePrepare}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpenToCancel && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p className="text-lg text-slate-900 font-semibold">
              Confirm to cancel
            </p>
            <p className="text-sm text-gray-800">
              Are you sure you want to cancel this order?
            </p>

            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-300 px-4 py-2  text-sm text-slate-900 rounded hover:bg-gray-400"
                onClick={() => setIsModalOpenToCancel(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500  text-sm text-slate-900 px-4 py-2 rounded hover:bg-blue-700"
                onClick={handleCancel}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {openDeliveryInfo && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50  px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md transform transition-all scale-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Delivery Information
            </h2>

            <div className="space-y-2 bg-slate-200 shadow-md p-2 rounded">
              <p className="text-gray-700 text-sm">
                <strong>Shipping Status:</strong>{" "}
                {selectedOrder.shipping_status || "N/A"}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Shipping Method:</strong>{" "}
                {selectedOrder.shipping_method || "N/A"}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Estimated Delivery:</strong>{" "}
                {selectedOrder.estimated_delivery || "N/A"}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Shipping Postcode:</strong>{" "}
                {selectedOrder.shipping_postcode || "N/A"}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                className="bg-red-500 text-sm text-white px-4 py-2 rounded hover:bg-red-600 transition"
                onClick={() => setOpenDeliveryInfo(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
