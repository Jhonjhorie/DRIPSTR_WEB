import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../../constants/supabase";
import useUserProfile from "@/shared/mulletCheck.js";

const Orders = () => {
  const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();
  const [selectedTab, setSelectedTab] = useState("All");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const tabs = ["All", "To Ship", "To Receive", "Completed", "Refund"];

  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state || {}; // Retrieve the passed product details

  const getOrderCounts = () => {
    const counts = {
      "To Ship": orders.filter(order => order.order_status === "Processing").length,
      "To Receive": orders.filter(order => order.order_status === "Shipped").length,
      "Completed": orders.filter(order => order.order_status === "Delivered").length,
      "Refund": orders.filter(order => 
        order.order_status === "Refund Requested" || 
        order.order_status === "Refund Approved" || 
        order.order_status === "Refund Rejected"
      ).length
    };
    return counts;
  };

  const handlePayment = (order) => {
    // TODO: Implement payment logic
    console.log('Processing payment for order:', order);
    // Navigate to payment page or show payment modal
  };

  const getFilteredOrders = () => {
    let filtered = [...orders];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.id.toString().includes(searchQuery) ||
        order.order_status.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    // Filter by tab
    switch (selectedTab) {
      case "To Ship":
        return filtered.filter(order => order.order_status === "Processing");
      case "To Receive":
        return filtered.filter(order => order.order_status === "Shipped");
      case "Completed":
        return filtered.filter(order => order.order_status === "Delivered");
      case "Refund":
        return filtered.filter(order => order.order_status === "Refund Requested" || order.order_status === "Refund Approved" || order.order_status === "Refund Rejected");
      default:
        return filtered;
    }
  };

  useEffect(() => {
    if (profile?.id) {
      const fetchOrders = async () => {
        try {
          const { data, error } = await supabase
            .from('orders')
            .select(`
              *,
              order_variation,
              order_size
            `)
            .eq('acc_num', profile.id)
            .order('date_of_order', { ascending: false });
  
          if (error) {
            throw error;
          }
  
          setOrders(data);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchOrders();
    }
  }, [profile]); // Add profile as a dependency

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'Pending Admin':
        return 'Pending';
      default:
        return status;
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 bg-slate-200 flex flex-row h-full overflow-hidden">
      <div className="sticky h-full">
        <Sidebar />
      </div>

      <div className="px-5 flex-1 flex flex-col">
        <div className="p-4 bg-slate-200 flex-1">
          <h1 className="text-xl font-bold text-gray-800 mb-6">My Orders</h1>
          
          {/* Navigation Tabs */}
          <div className="tabs mb-1 border-b border-gray-300 flex flex-row justify-around">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 text-gray-700 font-medium relative ${
                  selectedTab === tab
                    ? "text-purple-600 border-b-4 border-purple-600"
                    : "hover:text-black"
                }`}
              >
                {tab} {tab !== "All" && `(${getOrderCounts()[tab] || 0})`}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="group relative flex items-center bg-gray-50 rounded-md my-2">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="flex flex-col mt-16 align-middle justify-center items-center">
              <img src="/emote/hmmm.png" alt="Loading..." className="w-50 h-auto animate-pulse" />
              <span>Loading...</span>
            </div>
          ) : getFilteredOrders().length > 0 ? (
            getFilteredOrders().map((order) => (
              <div key={order.id} className="bg-white rounded-lg p-4 mb-4 shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-bold text-gray-800">
                    Order #{order.id}
                  </h2>
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.order_status === "Processing" ? "bg-yellow-100 text-yellow-800" :
                      order.order_status === "Shipped" ? "bg-blue-100 text-blue-800" :
                      order.order_status === "Refund Requested" ? "bg-orange-100 text-orange-800" :
                      order.order_status === "Refund Approved" ? "bg-green-100 text-green-800" :
                      order.order_status === "Refund Rejected" ? "bg-red-100 text-red-800" :
                      order.order_status === "Cancelled" ? "bg-gray-100 text-gray-800" :
                      order.order_status === "Pending Admin" ? "bg-yellow-100 text-yellow-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {order.payment_method === "COD" ? 
                        `${getStatusDisplay(order.order_status)} (COD)` : 
                        `${getStatusDisplay(order.order_status)} (${order.payment_method})`}
                    </span>
                    <span className="text-sm text-gray-500 mt-1">
                      {new Date(order.date_of_order).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <img
                    src={order.order_variation?.imagePath || "/placeholder.png"}
                    alt="Product"
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium mb-1">
                      Product #{order.prod_num}
                    </p>
                    <p className="text-gray-500 text-sm mb-1">
                      Quantity: {order.quantity} × ₱{order.total_price/order.quantity}
                    </p>
                    <p className="text-gray-500 text-sm mb-1">
                      Size: {order.order_size?.size || "N/A"}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <div>
                        <p className="text-gray-500 text-sm">
                          Payment: {order.payment_method}
                          {order.payment_method !== 'COD' && order.isPaid && 
                            <span className="ml-2 text-green-600">(Paid)</span>
                          }
                        </p>
                        <p className="text-purple-600 font-bold">
                          Total: ₱{order.final_price}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {order.order_status === "Processing" && (
                          <button 
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowCancelModal(true);
                            }}
                          >
                            Cancel Order
                          </button>
                        )}
                        {order.order_status === "Delivered" && 
                          !order.order_status.includes("Refund") && ( // Add this check
                          <button 
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowRefundModal(true);
                            }}
                          >
                            Request Refund
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col mt-36 align-middle justify-center items-center">
              <img src="/emote/sad.png" alt="No orders" className="w-32 h-32 mb-4" />
              <p className="text-gray-500">No orders found</p>
            </div>
          )}
        </div>
      </div>
      {showRefundModal && (
        <RefundModal
          isOpen={showRefundModal}
          onClose={() => {
            setShowRefundModal(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
        />
      )}
      {showCancelModal && (
        <CancelOrderModal
          isOpen={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
        />
      )}
    </div>
  );
};

const RefundModal = ({ isOpen, onClose, order }) => {
  const [refundReason, setRefundReason] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Only JPG, PNG and WEBP images are allowed');
    }
    
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB');
    }
  };

  const handleImageUpload = async (e) => {
    try {
      setUploading(true);
      setError('');
      
      const files = Array.from(e.target.files);
      
      // Validate number of files
      if (files.length > 5) {
        throw new Error('Maximum 5 images allowed');
      }
      
      // Validate all files first
      files.forEach(validateFile);

      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `refund-images/${order.id}/${fileName}`;

        // Compress image before upload if needed
        let fileToUpload = file;
        if (file.size > 1024 * 1024) { // If larger than 1MB
          // Add image compression logic here if needed
        }

        const { error: uploadError, data } = await supabase.storage
          .from('refunds')
          .upload(filePath, fileToUpload, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('refunds')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Limit total number of images
      const newImages = [...images, ...uploadedUrls].slice(0, 5);
      setImages(newImages);
      
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || 'Error uploading images. Please try again.');
    } finally {
      setUploading(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleRemoveImage = async (urlToRemove, index) => {
    try {
      // Extract path from URL
      const path = urlToRemove.split('/').slice(-2).join('/');
      
      const { error } = await supabase.storage
        .from('refunds')
        .remove([`refund-images/${path}`]);

      if (error) throw error;

      setImages(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error removing image:', error);
      setError('Failed to remove image. Please try again.');
    }
  };

  const handleSubmitRefund = async () => {
    if (!refundReason.trim()) {
      setError('Please provide a reason for the refund request');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { error: supabaseError } = await supabase
        .from('orders')
        .update({
          order_status: 'Refund Requested',
          refund_reason: refundReason,
          refund_requested_at: new Date().toISOString(),
          refund_status: 'Pending',
          refund_images: images
        })
        .eq('id', order.id);

      if (supabaseError) throw supabaseError;
      
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error requesting refund:', error);
      setError('Failed to submit refund request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[500px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Request Refund</h2>
        <p className="text-gray-600 mb-4">Order #{order.id}</p>
        
        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        <textarea
          className="w-full h-32 p-2 border rounded-lg mb-4"
          placeholder="Please explain why you want to request a refund..."
          value={refundReason}
          onChange={(e) => setRefundReason(e.target.value)}
          disabled={isSubmitting}
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Images (Optional - Max 5 images, 5MB each)
          </label>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
            disabled={isSubmitting || uploading || images.length >= 5}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-50 file:text-purple-700
              hover:file:bg-purple-100
              disabled:opacity-50"
          />
          {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
          
          {images.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {images.map((url, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={url} 
                    alt={`Refund evidence ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveImage(url, index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1
                      opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={isSubmitting}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {images.length}/5 images uploaded
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            onClick={handleSubmitRefund}
            disabled={!refundReason.trim() || isSubmitting || uploading}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </div>
    </div>
  );
};

const CancelOrderModal = ({ isOpen, onClose, order }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason for cancellation');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { error: supabaseError } = await supabase
        .from('orders')
        .update({
          order_status: 'Cancelled',
          cancellation_reason: reason,
          cancellation_requested_at: new Date().toISOString(),
          cancellation_status: 'Approved'
        })
        .eq('id', order.id);

      if (supabaseError) throw supabaseError;
      
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error cancelling order:', error);
      setError('Failed to cancel order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[500px]">
        <h2 className="text-xl font-bold mb-4">Cancel Order</h2>
        <p className="text-gray-600 mb-4">Order #{order.id}</p>
        
        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        <textarea
          className="w-full h-32 p-2 border rounded-lg mb-4"
          placeholder="Please explain why you want to cancel this order..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={isSubmitting}
        />

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Back
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={!reason.trim() || isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Cancel Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;