import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { supabase } from "../../../constants/supabase";
import ProfilePictureUploadModal from "../components/ProfilePictureUploadModal";
import { Navigate } from "react-router-dom";
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
      <div className="sticky h-full ">
        <Sidebar />
      </div>

      <div className="flex-1 p-4 px-9">
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          Manage My Account
        </h1>
        {loading ? (
          <div className="flex mt-36 flex-col h-100 justify-center items-center">
            <img src="/emote/hmmm.png" alt="Loading..." className="w-25 h-25" />
            <label>Loading...</label>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 relative rounded-lg shadow-md">
                <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-md">
                  {" "}
                </div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Personal Profile
                  </h2>
                  <Link
                    to="/account/profile"
                    className="text-blue-600 hover:underline"
                  >
                    Edit Profile
                  </Link>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={profile?.profile_picture || "/default-avatar.png"}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-300 cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                  />
                  <div>
                    <p className="text-gray-700 font-medium">
                      {profile?.full_name || "N/A"}
                    </p>
                    <p className="text-gray-600">{profile?.email || "N/A"}</p>
                    <p className="text-gray-600">
                      Mobile: {profile?.mobile || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg relative shadow-md">
                <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-md">
                  {" "}
                </div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Address Book
                  </h2>
                  <Link
                    to="/account/address"
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                </div>
                {addresses.length > 0 ? (
                  <div className="text-gray-700">
                    <p className="font-semibold mb-2">Default Shipping Address</p>
                    <p className="text-sm mb-1">{addresses[0].full_address}</p>
                    <div className="flex gap-2 text-sm text-gray-600">
                      <p>{addresses[0].region},</p>
                      <p>{addresses[0].city}</p>
                      <p>{addresses[0].postcode}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-600 flex flex-col items-center py-4">
                    <p className="mb-2">No default address set</p>
                    <Link
                      to="/account/address"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Add an address
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white relative p-6 rounded-lg shadow-md mt-6">
              <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-2 rounded-t-md">
                {" "}
              </div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
                <Link
                  to="/account/orders"
                  className="text-blue-600 hover:underline text-sm"
                >
                  View All Orders
                </Link>
              </div>

              {recentOrders.length > 0 ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-custom-purple text-left text-gray-100">
                      <th className="px-4 py-2 rounded-tl-lg">Order #</th>
                      <th className="px-4 py-2">Placed On</th>
                      <th className="px-4 py-2">Items</th>
                      <th className="px-4 py-2 rounded-tr-lg">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 border-b">
                        <td className="px-4 py-3">#{order.id}</td>
                        <td className="px-4 py-3">
                          {new Date(order.date_of_order).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={order.order_variation?.imagePath || "/placeholder.png"}
                              alt={order.shop_Product?.item_Name}
                              className="w-10 h-10 rounded object-cover"
                            />
                            <span className="text-sm text-gray-600">
                              {order.shop_Product?.item_Name || "Product"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium">₱{order.final_price}</span>
                          <span className="text-xs text-gray-500 ml-1">
                            ({order.quantity} items)
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No orders yet</p>
                  <Link
                    to="/"
                    className="text-blue-600 hover:underline text-sm block mt-2"
                  >
                    Start shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal */}
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
