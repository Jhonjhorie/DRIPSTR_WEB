import { useState, useRef, useEffect } from "react";
import { supabase } from "@/constants/supabase";
import { useReactToPrint } from "react-to-print";
import Logo from "../../../assets/logoName.png";

const OrderCard = ({ order, refreshOrders, setOrders }) => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Print order report
  const [shopData, setShopData] = useState([]);
  const [isModalOpenToDeliver, setIsModalOpenToDeliver] = useState(false);
  const [isModalOpenToPrepare, setIsModalOpenToPrepare] = useState(false);
  const [isModalOpenToCancel, setIsModalOpenToCancel] = useState(false);
  const [openDeliveryInfo, setOpenDeliveryInfo] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [subBranches, setSubBranches] = useState([]);
  const [selectedSubBranch, setSelectedSubBranch] = useState("");
  const [shopLVM, setShopLVM] = useState("");

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

  useEffect(() => {
    const fetchSubBranchesAndLVM = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData.user) {
          console.error("Error fetching user:", userError);
          return;
        }

        const { data: shopData, error: shopError } = await supabase
          .from("shop")
          .select("lvm")
          .eq("owner_Id", userData.user.id)
          .single();

        if (shopError) {
          console.error("Error fetching shop LVM:", shopError.message);
          return;
        }

        setShopLVM(shopData.lvm);

        // Fetch sub-branches where role is "Main Manager"
        const { data: branches, error: branchError } = await supabase
          .from("express_admins")
          .select("sub_branch")
          .eq("lvm", shopData.lvm)
          .eq("role", "Branch Manager");

        if (branchError) {
          console.error("Error fetching sub-branches:", branchError.message);
          return;
        }

        setSubBranches(branches.map((branch) => branch.sub_branch));
      } catch (err) {
        console.error("Unexpected error:", err.message);
      }
    };

    fetchSubBranchesAndLVM();
  }, []);

  useEffect(() => {
    console.log("Order data:", {
      isCustomizable: order.shop_Product?.isCustomizable,
      customizable_note: order.customizable_note,
      shop_Product: order.shop_Product
    });
  }, [order]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("orders")
        .update({ shipping_status: newStatus })
        .eq("id", orderId);

      if (error) throw error;

      console.log(`Order ${orderId} status updated to ${newStatus}`);

      if (refreshOrders) {
        refreshOrders();
      } else if (setOrders) {
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.id === orderId ? { ...o, shipping_status: newStatus } : o
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

  const handlePrepare = async () => {
    if (!selectedSubBranch) {
      alert("Please select a sub-branch.");
      return;
    }
  
    try {
      // Fetch the ID of the selected sub-branch
      const { data: branchData, error: branchError } = await supabase
        .from("express_admins")
        .select("id")
        .eq("sub_branch", selectedSubBranch)
        .single();
  
      if (branchError) {
        console.error("Error fetching sub-branch ID:", branchError.message);
        return;
      }
  
      const subBranchId = branchData.id;
  
      // Update the order with the sub-branch ID in the shipping_branch column
      const { error: updateError } = await supabase
        .from("orders")
        .update({ shipping_status: "To prepare", shipping_branch: subBranchId })
        .eq("id", order.id);
  
      if (updateError) {
        console.error("Error updating order:", updateError.message);
        return;
      }
  
      console.log(`Order assigned to sub-branch ID: ${subBranchId}`);
      setIsModalOpenToPrepare(false);
  
      // Optionally refresh orders
      if (refreshOrders) {
        refreshOrders();
      }
    } catch (err) {
      console.error("Error preparing order:", err.message);
    }
  };

  const handleConfirm = () => {
    updateOrderStatus(order.id, "To ship");
    setIsModalOpenToDeliver(false);
  };

  const handleCancel = () => {
    updateOrderStatus(order.id, "Cancel");
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
      className={`border relative rounded-lg p-4 shadow-md mb-4  ${order.shipping_status === "Cancel"
          ? "bg-slate-300"
          : order.shipping_status === "Completed"
            ? "bg-slate-300"
            : "bg-white"
        }`}
    >
      <h2 className="text-lg font-bold text-slate-900">Order #{order.id}</h2>
      <div className="w-full md:flex gap-2">
        <div className="w-full h-auto">
          <div className="md:flex gap-4 mt-3">
            <div className="p-1 rounded-md place-self-center shadow-md h-36 w-40 bg-slate-800">
              <img
                src={order.variantImg || "placeholder.jpg"}
                alt={order.variantName || "Product Image"}
                className="h-full bg-slate-900 w-full object-cover rounded-md"
              />
            </div>
            <div className="w-full h-auto mt-2 md:mt-0">
              <p className="text-sm text-custom-purple">
                Product:{" "}
                <span className="font-medium">{order.productName}</span>
              </p>
              <p className="text-sm text-slate-700">
                Transaction ID:{" "}
                <span className="font-medium">{order.shop_transaction_id}</span>
              </p>
              <p className="text-sm text-slate-700">
                Buyer:{" "}
                <span className="font-medium">{order.buyerName || "N/A"}</span>
              </p>
              <p className="text-sm text-slate-700">
                Address:{" "}
                <span className="font-medium">
                  {order.shipping_addr || "N/A"}
                </span>
              </p>
              <p className="text-sm text-slate-700">
                Payment method:{" "}
                <span className="font-medium">
                  {order.payment_method || "N/A"}
                </span>
              </p>
              {order.payment_method === "Gcash" && (
                <div>
                  <p className="text-sm text-slate-700">
                    Is paid:{" "}
                    <span className="font-medium">
                      {order.payment_status || "none"}
                    </span>
                  </p>
                </div>
              )}
              {order.shop_Product?.isCustomizable && (
                <div>
                  <p className="text-sm text-slate-700">
                    Customization Note:{" "}
                    <span className="font-medium">
                      {order.customizable_note || "No customization note provided"}
                    </span>
                  </p>
                </div>
              )}
              {order.shipping_status === "To prepare" && (
                <div>
                  <p className="text-sm text-slate-700">
                    Cancelation reason:{" "}
                    <span
                      className={`font-medium ${order.cancellation_requested_at
                          ? "text-red-500"
                          : "text-slate-700"
                        }`}
                    >
                      {order.cancellation_reason || "none"}
                    </span>
                  </p>
                  <p className="text-sm text-slate-700">
                    Cancelation date:{" "}
                    <span
                      className={`font-medium ${order.cancellation_requested_at
                          ? "text-red-500"
                          : "text-slate-700"
                        }`}
                    >
                      {order.cancellation_requested_at
                        ? new Date(
                          order.cancellation_requested_at
                        ).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                        : "none"}
                    </span>
                  </p>
                </div>
              )}
              {order.shipping_status === "Cancel" && (
                <div>
                  <p className="text-sm text-slate-700">
                    Cancelation reason:{" "}
                    <span
                      className={`font-medium ${order.cancellation_requested_at
                          ? "text-red-500"
                          : "text-slate-700"
                        }`}
                    >
                      {order.cancellation_reason || "none"}
                    </span>
                  </p>
                  <p className="text-sm text-slate-700">
                    Cancelation date:{" "}
                    <span
                      className={`font-medium ${order.cancellation_requested_at
                          ? "text-red-500"
                          : "text-slate-700"
                        }`}
                    >
                      {order.cancellation_requested_at
                        ? new Date(
                          order.cancellation_requested_at
                        ).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                        : "none"}
                    </span>
                  </p>
                </div>
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
            Price: <span className="font-medium">₱ {order.total_price}</span>
          </p>
          <p className="text-sm text-slate-700">
            Shipping Fee:{" "}
            <span className="font-medium">₱{order.shipping_fee}</span>
          </p>
          <p className="text-sm text-slate-700">
            Shipping method:{" "}
            <span className="font-medium">{order.shipping_method}</span>
          </p>
          <p className="text-xl font-semibold md:absolute bottom-0 right-0 text-yellow-600">
            Total: ₱{order.total_price}
          </p>
        </div>
      </div>

      <div className=" mt-4">
        {order.shipping_status === "Preparing" && (
          <div className="flex gap-2 w-full justify-between">
            <div>
              <button
                className="bg-gray-500 text-sm text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50 ml-2"
                onClick={() => setIsModalOpenToCancel(true)}
                disabled={loading}
              >
                {loading ? "Updating..." : "Cancel order"}
              </button>
            </div>

            <div className="flex gap-2">
              <button
                className="bg-green-500 text-sm text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 "
                onClick={() => setIsModalOpen(true)}
              >
                {loading ? "Updating..." : "Print"}
              </button>
              <button
                className="bg-blue-500 text-sm text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                onClick={() => setIsModalOpenToPrepare(true)}
                disabled={loading}
              >
                {loading ? "Updating..." : "Mark as Ready to Deliver"}
              </button>
            </div>
          </div>
        )}
        {order.shipping_status === "To receive" && (
          <button
            className="bg-blue-500 text-sm text-white justify-end px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={handleOpenDeliveryInfo}
            disabled={loading}
          >
            {loading ? "Updating..." : "Status"}
          </button>
        )}
      </div>

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
                  <span className="font-medium">{order.shop_transaction_id}</span>
                </p>
              </div>

              <div className="flex gap-4 mt-4">
                <div className="flex-1">
                  <p className="text-sm text-slate-800">
                    <strong>Product:</strong> {order.productName || "N/A"}
                  </p>
                  <p className="text-sm text-slate-800">
                    <strong>Variant:</strong> {order.variantName || "N/A"}
                  </p>
                  <p className="text-sm text-slate-800">
                    <strong>Size:</strong> {order.size}
                  </p>
                  <p className="text-sm text-slate-800">
                    <strong>Quantity:</strong> {order.quantity}
                  </p>
                  <p className="text-sm text-slate-800">
                    <strong>Price per Item:</strong> ₱
                    {(order.total_price / order.quantity).toFixed(2)}
                  </p>
                  <p className="text-sm text-slate-800">
                    <strong>Shop:</strong> {shopData?.shop_name || "N/A"}
                  </p>
                  <p className="text-sm text-slate-800">
                    <strong>Address:</strong> {shopData?.address || "N/A"}
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t pt-4">
                <h3 className="text-md font-semibold text-slate-900">
                  Shipping Details
                </h3>
                <p className="text-sm text-slate-800">
                  <strong>Receiver:</strong> {order.buyerName || "N/A"}
                </p>
                <p className="text-sm text-slate-800">
                  <strong>Address:</strong>{" "}
                  {order.shipping_addr + ", " + order.shipping_postcode ||
                    "N/A"}
                </p>
                <p className="text-sm text-slate-800">
                  <strong>Mobile number:</strong> {order.buyerPhone || "N/A"}
                </p>
              </div>

              <div className="mt-4 border-t pt-4">
                <h3 className="text-md font-semibold text-slate-900">
                  Order Summary
                </h3>
                <p className="text-sm text-slate-800">
                  <strong>Subtotal:</strong> ₱{order.total_price.toFixed(2)}
                </p>
                <p className="text-sm text-slate-800">
                  <strong>Shipping fee:</strong> ₱{order.shipping_fee}
                </p>
                <p className="text-sm text-slate-800">
                  <strong>Shipping method:</strong> {order.shipping_method}
                </p>
                <div className="flex justify-end gap-2 items-center mt-2 font-semibold text-lg">
                  <span className="text-slate-800 text-sm">Total Price:</span>
                  <span className="text-xl text-custom-purple">
                    ₱
                    {(order.total_price + (order.shipping_fee || 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="text-center text-xs text-gray-500 mt-4 border-t pt-2">
                <p>Thank you for shopping with Dripstr!</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="hover:bg-gray-500 px-4 py-2 text-white text-sm rounded bg-gray-600"
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
              Confirm Deliver Order{" "}
              <span className="text-custom-purple">
                {order.productName || "N/A"}
              </span>
            </p>
            <p className="text-sm text-gray-800">
              Are you sure you want to set this order to "To deliver"?
            </p>

            <div className="mt-4 flex justify-between space-x-2">
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

      {isModalOpenToPrepare && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg text-slate-900 font-semibold">
              Assign Branch for Order{" "}
              <span className="text-custom-purple">{order.productName || "N/A"}</span>
            </p>
            <p className="text-sm text-gray-800">
              Select a branch to assign this order for delivery.
            </p>

            <div className="mt-4">
              <label htmlFor="sub-branch" className="block text-sm font-medium text-gray-700">
                Select a Dripstr express branches near you 
              </label>
              <select
  id="sub-branch"
  className="mt-1 block w-full bg-white p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
  value={selectedSubBranch}
  onChange={(e) => {
    console.log("Selected Sub-Branch:", e.target.value); // Debugging log
    setSelectedSubBranch(e.target.value);
  }}
>
  <option value="">Select a sub-branch</option>
  {subBranches.map((branch, index) => (
    <option key={index} value={branch}>
      {branch}
    </option>
  ))}
</select>
            </div>

            <div className="mt-4 flex justify-between space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 text-sm text-slate-900 rounded hover:bg-gray-400"
                onClick={() => setIsModalOpenToPrepare(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-sm text-white px-4 py-2 rounded hover:bg-blue-700"
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
              Confirm cancel order{" "}
              <span className="text-custom-purple">
                {order.productName || "N/A"}
              </span>
            </p>
            <p className="text-sm text-gray-800">
              Are you sure you want to cancel this order?
            </p>

            <div className="mt-4 flex justify-between space-x-2">
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
