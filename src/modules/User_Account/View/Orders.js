import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../../constants/supabase";
import useUserProfile from "@/shared/mulletCheck.js";
import Toast from '../../../shared/alerts';

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
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [showReviewModal, setShowReviewModal] = useState(false);

  const tabs = ["All", "Verifying", "To Ship", "To Receive", "To Review", "Returns & Cancellations"];

  const location = useLocation();
  const navigate = useNavigate();
  const { item } = location.state || {}; // Retrieve the passed product details

  // Fix the getOrderCounts function
  const getOrderCounts = () => {
    const counts = {
      "To Ship": orders.filter(order =>         
        (order.shipping_status === "To ship" || 
        order.shipping_status === "preparing" ||
        order.shipping_status === "To prepare") &&
        order.payment_status !== 'Pending to Admin'
      ).length,
      "To Receive": orders.filter(order => 
        order.shipping_status === 'To deliver' || 
        order.shipping_status === 'To receive'
      ).length,
      "Verifying": orders.filter(order => 
        order.payment_method !== "COD" && 
        order.payment_status === "Pending to Admin"
      ).length,
      "To Review": orders.filter(order =>
        // Show delivered or completed orders that haven't been reviewed yet
        ((order.shipping_status === "delivered" || 
        order.shipping_status === "Delivered" || 
        order.shipping_status === "complete" || 
        order.shipping_status === "Complete"|| 
        order.shipping_status === "Completed"
      ) && 
        order.refund_status !== "Approved" && 
        order.refund_status !== "Requested")
      ).length,
      "Returns & Cancellations": orders.filter(order => 
        order.shipping_status === "cancel" || 
        order.refund_status !== "Not Requested"
      ).length
    };
    return counts;
  };

  const getFilteredOrders = () => {
    let filtered = [...orders];
    
    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.id.toString().includes(searchQuery) ||
        order.shipping_status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.payment_status?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    switch (selectedTab) {
      case "To Ship":
        return filtered.filter(order => 
          (order.shipping_status === "To ship" || 
            order.shipping_status === "preparing" ||
            order.shipping_status === "To prepare") &&
            order.payment_status !== 'Pending to Admin'

        );
      case "To Receive":
        return filtered.filter(order => 
          order.shipping_status === 'To deliver' || 
          order.shipping_status === 'To receive'
        );
      case "Verifying":
        return filtered.filter(order => 
          order.payment_method !== "COD" && 
          order.payment_status === "Pending to Admin"
        );
        // Fix the getFilteredOrders function case for Completed

      case "To Review":
        return filtered.filter(order => 
          // Show both delivered and completed orders that need reviews
          ((order.shipping_status === "delivered" || 
            order.shipping_status === "Delivered"|| 
            order.shipping_status === "complete"|| 
            order.shipping_status === "Complete" ||
            order.shipping_status === "Completed") && 
          order.refund_status !== "Approved" && 
          order.refund_status !== "Requested")
        );
      case "Returns & Cancellations":
        return filtered.filter(order => 
          (order.shipping_status === "cancel" || 
          order.refund_status !== "Not Requested") 
        );
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
              order_size,
              shop_Product:prod_num (
                item_Name
              )
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

  const getStatusDisplay = (order) => {
    if (order.payment_method !== "COD" && order.payment_status === "Pending to Admin") {
      return "Verifying Payment";
    }
    
    if (order.refund_status === "Requested") {
      return "Refund Requested";
    }
    if (order.refund_status === "Approved") {
      return "Refunded";
    }
    if (order.shipping_status === "cancel") {
      return "Cancelled";
    }

    switch (order.shipping_status) {
      case "preparing":
      case "To prepare":
      case "To ship":
        return "To Ship";
      case "To deliver":
        return "To Receive";
      case "delivered":
      case "Delivered":
        return "Delivered";
      case "Completed":
        return "Completed";
      default:
        return order.shipping_status;
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const handleViewProduct = (order) => {
    const productData = {
      id: order.prod_num,
      item_Name: order.shop_Product?.item_Name,
      item_Variant: [{
        variant_Name: order.order_variation?.variant_Name,
        imagePath: order.order_variation?.imagePath,
        sizes: [{
          size: order.order_size?.size,
          price: order.total_price/order.quantity,
          qty: order.quantity
        }]
      }],
      shop: {
        shop_Name: order.shop_name,
        shop_Id: order.shop_id
      }
    };
  
    navigate(`/product/${productData.item_Name}`, {
      state: { item: productData }
    });
  };

  // Add this new function in the Orders component
  const handleMarkAsComplete = async (orderId) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          shipping_status: 'Completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
  
      if (error) throw error;
  
      showToast('Order marked as completed');
      // Refresh orders list
      setTimeout(() => {
        window.location.reload();
      }, 1500);
  
    } catch (error) {
      console.error('Error marking order as complete:', error);
      showToast('Failed to mark order as complete', 'error');
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

      <div className="flex-1 p-4 px-9">
        {/* Fixed Header Section */}
        <div className="flex-none">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <i className="fas fa-shopping-bag mr-3 text-primary-color"></i>
          My Orders
        </h1>          
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
              className="w-full pl-10 pr-4 py-2 rounded-md border bg-white border-gray-200 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Scrollable Orders List */}
        <div className="flex-1 overflow-y-auto pr-2">
          {loading ? (
            <div className="flex flex-col mt-16 align-middle justify-center items-center">
              <img src="/emote/hmmm.png" alt="Loading..." className="w-50 h-auto animate-pulse" />
              <span>Loading...</span>
            </div>
          ) : getFilteredOrders().length > 0 ? (
            getFilteredOrders().map((order) => (
              <div 
                key={order.id} 
                className="bg-white rounded-lg p-4 mb-4 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer 
                  group relative hover:scale-[1.01] hover:border-primary-color hover:border"
                onClick={() => handleViewProduct(order)}
              >
                 <div className="absolute inset-0 bg-primary-color/0 group-hover:bg-primary-color/5 transition-colors duration-300 rounded-lg pointer-events-none" />
                 
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <h2 className="text-lg font-bold text-gray-800">
                      Order #{order.id}
                    </h2>
                    {order.transaction_id && (
                      <span className="text-sm text-gray-500">
                        Transaction ID: {order.shop_transaction_id}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.refund_status === "requested" || order.refund_status === "Requested" ? 
                      "bg-orange-100 text-orange-800" :
                      order.refund_status === "approved" || order.refund_status === "Approved" ? 
                      "bg-green-100 text-green-800" :
                      order.shipping_status === "cancel" || order.shipping_status === "Cancel" ? 
                      "bg-gray-100 text-gray-800" :
                      (order.shipping_status === "preparing" || order.shipping_status === "To repare") 
                      && order.payment_method !== "COD" ? 
                        "bg-purple-100 text-purple-800" :
                      order.shipping_status === "to ship" || order.shipping_status === "To ship" ?
                       "bg-yellow-100 text-yellow-800" :
                      order.shipping_status === "to deliver" || order.shipping_status === "To deliver" ?
                       "bg-blue-100 text-blue-800" :
                      order.shipping_status === "delivered" || order.shipping_status === "Delivered" ? 
                        "bg-yellow-100 text-yellow-800" :
                      order.shipping_status === "complete" || order.shipping_status === "Complete" ? 
                        "bg-green-100 text-green-800" :
                      "bg-gray-100 text-gray-800"
                    }`}>
                      {getStatusDisplay(order)}
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
                      {order.shop_Product?.item_Name || `Product #${order.prod_num}`}
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
                          {((order.payment_method !== 'COD' && order.isPaid) || (order.payment_status === "Paid")) && 
                            <span className="ml-2 text-green-600">(Paid)</span>
                          }
                        </p>
                        <p className="text-purple-600 font-bold">
                          Total: ₱{order.final_price}
                        </p>
                      </div>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        {/* Cancel Button */}
                        {order.shipping_status !== "delivered" && 
                          order.shipping_status !== "complete" && 
                          order.shipping_status !== "To deliver" && 
                          order.shipping_status !== "cancel" &&
                          order.shipping_status !== 'To receive' &&
                          (
                          <button 
                            className="text-gray-600 hover:text-red-600 px-4 py-2 rounded-md border border-gray-300 
                            hover:border-red-200 transition-all duration-300 text-sm font-medium bg-white 
                            hover:bg-red-50 flex items-center gap-2"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowCancelModal(true);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel Order
                          </button>
                        )}

                        {/* Refund Button */}
                        {(order.payment_status === "Paid" && 
                          (order.shipping_status === "delivered" || order.shipping_status === "Delivered")) && order.refund_status === "Not Requested" && (
                          <button 
                            className="text-gray-600 hover:text-orange-600 px-4 py-2 rounded-md border border-gray-300 
                            hover:border-orange-200 transition-all duration-300 text-sm font-medium bg-white 
                            hover:bg-orange-50 flex items-center gap-2"
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowRefundModal(true);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m4 0l3 3m0 0l3-3m-3 3v-6" />
                            </svg>
                            Request Refund
                          </button>
                        )}

                        {/* Add this before the Review Button */}
                        {(order.shipping_status === "delivered" || order.shipping_status === "Delivered") && (
                          <button 
                            className="text-gray-600 hover:text-green-600 px-4 py-2 rounded-md border border-gray-300 
                              hover:border-green-200 transition-all duration-300 text-sm font-medium bg-white 
                              hover:bg-green-50 flex items-center gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsComplete(order.id);
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Mark as Complete
                          </button>
                        )}

                        {/* Review Button */}
                        {(order.shipping_status === "delivered" || order.shipping_status === "Delivered" || order.shipping_status === "complete") && (
                          order.is_reviewed ? (
                            <div className="flex items-center text-green-600">
                              <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                              <span className="text-sm">Reviewed</span>
                            </div>
                          ) : (
                            <button 
                              className="bg-primary-color text-white px-4 py-2 rounded-md hover:bg-primary-color/90"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(order);
                                setShowReviewModal(true);
                              }}
                            >
                              Write Review
                            </button>
                          )
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
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
      {showRefundModal && (
        <RefundModal
          isOpen={showRefundModal}
          onClose={() => {
            setShowRefundModal(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          showToast={showToast} // Add this prop
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
          showToast={showToast} // Add this prop
        />
      )}
      {showReviewModal && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          showToast={showToast}
        />
      )}
    </div>
  );
};

const RefundModal = ({ isOpen, onClose, order, showToast }) => {
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
          refund_reason: refundReason,
          refund_requested_at: new Date().toISOString(),
          refund_status: 'Requested',
          refund_images: images,
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);
  
      if (supabaseError) throw supabaseError;
      
      onClose();
      showToast('Refund request submitted successfully');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
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
          className="w-full h-32 p-2 border rounded-lg mb-4 bg-white"
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

const CancelOrderModal = ({ isOpen, onClose, order, showToast }) => {
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
          shipping_status: 'cancel',
          cancellation_reason: reason,
          cancellation_requested_at: new Date().toISOString(),
          cancellation_status: 'Requested'
        })
        .eq('id', order.id);

      if (supabaseError) throw supabaseError;
      
      onClose();
      showToast('Cancellation request submitted successfully');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
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
          className="w-full h-32 p-2 border rounded-lg mb-4 bg-white"
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
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
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

const ReviewModal = ({ isOpen, onClose, order, showToast }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    try {
      setUploading(true);
      setError('');
      
      const files = Array.from(e.target.files);
      if (files.length > 3) {
        throw new Error('Maximum 3 images allowed');
      }

      const uploadPromises = files.map(async (file) => {
        if (file.size > 2 * 1024 * 1024) {
          throw new Error('Image size should be less than 2MB');
        }
        
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `review-images/${order.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('reviews')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get the full path including bucket name
        const imagePath = `review-images/${order.id}/${fileName}`;
        return imagePath; // Store the path instead of the public URL
      });

      const uploadedPaths = await Promise.all(uploadPromises);
      setImages([...images, ...uploadedPaths].slice(0, 3));
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      setError('Please write a review');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Insert review with image paths array
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          product_id: order.prod_num,
          user_id: order.acc_num,
          order_id: order.id,
          rating,
          comment: comment.trim(),
          images: images, // This will now be an array of storage paths
          variant_name: order.order_variation?.variant_Name,
          size: order.order_size?.size
        });

      if (reviewError) throw reviewError;

      // Mark order as reviewed AND set shipping status to complete
      const { error: orderError } = await supabase
        .from('orders')
        .update({ 
          is_reviewed: true,
          shipping_status: 'complete',
          updated_at: new Date().toISOString()
        })
        .eq('id', order.id);

      if (orderError) throw orderError;

      // Update product rating
      const { data: reviews } = await supabase
        .from('reviews')
        .select('rating')
        .eq('product_id', order.prod_num);

      const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

      const { error: updateError } = await supabase
        .from('shop_Product')
        .update({ item_Rating: avgRating })
        .eq('id', order.prod_num);

      if (updateError) throw updateError;

      onClose();
      showToast('Review submitted and order marked as completed');
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-[500px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Write a Review</h2>
        <p className="text-gray-600 mb-4">
          {order.shop_Product?.item_Name} - {order.order_variation?.variant_Name}
        </p>

        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="text-2xl focus:outline-none"
              >
                <FontAwesomeIcon 
                  icon={star <= rating ? faStarSolid : faStarRegular}
                  className={star <= rating ? "text-yellow-400" : "text-gray-300"}
                />
              </button>
            ))}
          </div>
        </div>

        <textarea
          className="w-full h-32 p-2 border rounded-lg mb-4 bg-white"
          placeholder="Write your review here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={isSubmitting}
        />

        <div className="mb-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isSubmitting || uploading || images.length >= 3}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-purple-50 file:text-purple-700
              hover:file:bg-purple-100"
          />
          {images.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {images.map((path, index) => (
                <img 
                  key={index}
                  src={`${supabase.storage.from('reviews').getPublicUrl(path).data.publicUrl}`}
                  alt={`Review ${index + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
              ))}
            </div>
          )}
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
            className="px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-primary-color/90 disabled:opacity-50"
            onClick={handleSubmitReview}
            disabled={!comment.trim() || isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;