import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { supabase } from "../../../constants/supabase";

const Account = () => {
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchProfile();
    fetchAddresses();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();

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
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      let { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id);

      if (error) console.error("Error fetching addresses:", error);
      else setAddresses(data);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 bg-slate-200 min-h-screen flex flex-row">

    <Sidebar />
    <div className="p-4 px-9 flex-1 ">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Manage My Account</h1>
      </div>

      {/* Profile Section */}
      <div className="flex flex-row gap-4 justify-between mb-6">
        {/* Personal Profile */}
        <div className="bg-gray-100 p-4 flex-1 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Personal Profile</h2>
            <Link to="/account/profile" className="text-indigo-600">
              Edit Profile
            </Link>
          </div>

                  {loading ? (
          <div className="flex flex-col justify-center items-center">
            <img src="/emote/hmmm.png" alt="Loading..." className="w-20 h-20" />
            <label>Loading...</label>
          </div>
        ) : (
          <>
          <div className="flex items-center gap-4">
            <img
              src="https://via.placeholder.com/80"
              alt="Avatar"
              className="w-20 h-20 rounded-full bg-gray-300"
            />
            <div>
                <p className="text-gray-600">{profile?.full_name || "N/A"}</p>
                <p className="text-gray-600">{profile?.email || "N/A"}</p>
                <p className="text-gray-600">Mobile: {profile?.mobile || "N/A"}</p>
            </div>
          </div>
          <div className="mt-4 text-right">
            <button className="btn btn-primary">Edit Avatar</button>
          </div>
          </>
        )}
        </div>

          {/* Address Book Section */}
          <div className="bg-gray-100 p-4 flex-1 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Address Book</h2>
              <Link to="/account/address" className="text-indigo-600">Edit</Link>
            </div>
            {loading ? (
          <div className="flex flex-col justify-center items-center">
            <img src="/emote/hmmm.png" alt="Loading..." className="w-20 h-20" />
            <label>Loading...</label>
          </div>
        ) : (
            <div className="grid grid-cols-2 gap-4">
            {addresses.length > 0 ? (
              addresses
                .filter((address) => address.is_default_shipping) // Filter for the default shipping address
                .map((address, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-600">
                      Default Shipping Address
                    </h3>
                    <p className="text-gray-600">{address.address}</p>
                    <p className="text-gray-600">Postcode: {address.postcode}</p>
                  </div>
                ))
            ) : (
              <p className="text-gray-600">No addresses found.</p>
            )}
            </div>       
           )}

          </div>


        </div>

      {/* Recent Orders Section */}
      <div className="bg-gray-100 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
        {loading ? (
          <div className="flex flex-col justify-center items-center">
            <img src="/emote/hmmm.png" alt="Loading..." className="w-25 h-25" />
            <label>Loading...</label>
          </div>
        ) : (
          <table className="table table-auto w-full">
            <thead>
              <tr className="bg-gray-200">
                <th>Order #</th>
                <th>Placed On</th>
                <th>Items</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover">
                <td>12345</td>
                <td>2024-10-30</td>
                <td>
                  <img
                    src="https://via.placeholder.com/50"
                    alt="Item"
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td>$50.00</td>
              </tr>
              <tr className="hover">
                <td>67890</td>
                <td>2024-11-01</td>
                <td>
                  <img
                    src="https://via.placeholder.com/50"
                    alt="Item"
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td>$75.00</td>
              </tr>
            </tbody>
          </table>
                     )}

        </div>
      </div>
    </div>
    </div>
  );
};

export default Account;
