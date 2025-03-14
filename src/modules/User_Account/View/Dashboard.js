import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { supabase } from "../../../constants/supabase";
import ProfilePictureUploadModal from "../components/ProfilePictureUploadModal";
import { Navigate } from "react-router-dom";
import hmmmEmote from '../../../assets/emote/hmmm.png';  // Add this import at the top

const Account = () => {
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchAddresses();
    fetchRecentOrders();
  }, []);

  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) console.error("Error fetching profile:", error);
      else setProfile(data);
    }
  };

  const fetchAddresses = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      let { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_default_shipping", true)
        .limit(1);

      if (error) {
        console.error("Error fetching addresses:", error);
      } else {
        setAddresses(data || []);
      }
    }
    setLoading(false);
  };

  const fetchRecentOrders = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      let { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_variation,
          order_size,
          shop_Product:prod_num (
            item_Name
          )
        `)
        .eq('acc_num', user.id)
        .order('date_of_order', { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching orders:", error);
      } else {
        setRecentOrders(data || []);
      }
    }
  };

  return (
    <div className="p-4 bg-slate-200 flex flex-row h-full overflow-hidden">
      <div className="sticky h-full">
        <Sidebar />
      </div>

      <div className="flex-1 p-4 px-9">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <i className="fas fa-user-cog mr-3 text-primary-color"></i>
          Manage My Account
        </h1>

        {loading ? (
          <div className="flex mt-36 flex-col h-100 justify-center items-center">
            <img src={hmmmEmote} alt="Loading..." className="w-24 h-24 mb-4 animate-bounce" />
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Profile Card */}
              <div className="bg-white p-6 relative rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-xl"></div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <i className="fas fa-user-circle mr-2 text-primary-color"></i>
                    Personal Profile
                  </h2>
                  <Link
                    to="/account/profile"
                    className="text-primary-color hover:text-primary-color/80 flex items-center group"
                  >
                    <span className="mr-1">Edit</span>
                    <i className="fas fa-chevron-right text-xs transition-transform group-hover:translate-x-1"></i>
                  </Link>
                </div>

                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <img
                      src={profile?.profile_picture || "/default-avatar.png"}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 shadow-md transition-transform group-hover:scale-105"
                      onClick={() => setIsModalOpen(true)}
                    />
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="absolute bottom-0 right-0 bg-primary-color text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <i className="fas fa-camera text-sm"></i>
                    </button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-semibold text-gray-800">
                      {profile?.full_name || "N/A"}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <i className="fas fa-envelope mr-2 text-primary-color/60"></i>
                      {profile?.email || "N/A"}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <i className="fas fa-phone mr-2 text-primary-color/60"></i>
                      {profile?.mobile || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Book Card */}
              <div className="bg-white p-6 rounded-xl relative shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-xl"></div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <i className="fas fa-map-marker-alt mr-2 text-primary-color"></i>
                    Address Book
                  </h2>
                  <Link
                    to="/account/address"
                    className="text-primary-color hover:text-primary-color/80 flex items-center group"
                  >
                    <span className="mr-1">Edit</span>
                    <i className="fas fa-chevron-right text-xs transition-transform group-hover:translate-x-1"></i>
                  </Link>
                </div>

                {addresses.length > 0 ? (
                  <div className="text-gray-700 space-y-3">
                    <div className="flex items-center">
                      <span className="px-2 py-1 bg-primary-color/10 text-primary-color text-sm rounded-md">
                        Default Address
                      </span>
                    </div>
                    <p className="text-gray-800 font-medium">{addresses[0].full_address}</p>
                    <div className="flex gap-2 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded-md">{addresses[0].region}</span>
                      <span className="px-2 py-1 bg-gray-100 rounded-md">{addresses[0].city}</span>
                      <span className="px-2 py-1 bg-gray-100 rounded-md">{addresses[0].postcode}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <i className="fas fa-home text-4xl text-gray-300 mb-3"></i>
                    <p className="text-gray-500 mb-3">No default address set</p>
                    <Link
                      to="/account/address"
                      className="inline-flex items-center text-primary-color hover:text-primary-color/80"
                    >
                      <i className="fas fa-plus mr-2"></i>
                      Add an address
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white p-6 rounded-xl relative shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-xl"></div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <i className="fas fa-shopping-bag mr-2 text-primary-color"></i>
                  Recent Orders
                </h2>
                <Link
                  to="/account/orders"
                  className="text-primary-color hover:text-primary-color/80 flex items-center group"
                >
                  <span className="mr-1">View All</span>
                  <i className="fas fa-chevron-right text-xs transition-transform group-hover:translate-x-1"></i>
                </Link>
              </div>

              {recentOrders.length > 0 ? (
                <div className="overflow-x-auto rounded-lg">
                  <div className="max-h-[400px] overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr className="text-left">
                          <th className="px-6 py-3 text-xs font-semibold text-gray-600 bg-gray-50">Order #</th>
                          <th className="px-6 py-3 text-xs font-semibold text-gray-600 bg-gray-50">Placed On</th>
                          <th className="px-6 py-3 text-xs font-semibold text-gray-600 bg-gray-50">Items</th>
                          <th className="px-6 py-3 text-xs font-semibold text-gray-600 bg-gray-50">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <span className="font-medium text-primary-color">#{order.id}</span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                              {new Date(order.date_of_order).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg overflow-hidden shadow-sm">
                                  <img
                                    src={order.order_variation?.imagePath || "/placeholder.png"}
                                    alt={order.shop_Product?.item_Name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="font-medium text-gray-700">
                                  {order.shop_Product?.item_Name || "Product"}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col">
                                <span className="font-semibold text-gray-800">₱{order.final_price}</span>
                                <span className="text-xs text-gray-500">
                                  {order.quantity} {order.quantity > 1 ? 'items' : 'item'}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <i className="fas fa-shopping-cart text-4xl text-gray-300 mb-3"></i>
                  <p className="text-gray-500 mb-4">No orders yet</p>
                  <Link
                    to="/"
                    className="inline-flex items-center px-4 py-2 bg-primary-color text-white rounded-lg hover:bg-primary-color/90 transition-colors"
                  >
                    <i className="fas fa-store mr-2"></i>
                    Start shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal remains unchanged */}
        {isModalOpen && (
          <ProfilePictureUploadModal
            isOpen={isModalOpen}
            onClose={(newImageUrl) => {
              if (newImageUrl)
                setProfile((prev) => ({
                  ...prev,
                  profile_picture: newImageUrl,
                }));
              setIsModalOpen(false);
            }}
            userId={profile.id}
            currentImage={profile.profile_picture}
          />
        )}
      </div>
    </div>
  );
};

export default Account;
