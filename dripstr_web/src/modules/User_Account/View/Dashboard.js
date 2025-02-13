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
    <div className="p-4 bg-slate-200 flex flex-row h-full overflow-hidden">
      <div className="sticky h-full ">  
      <Sidebar />
      </div>
      
      <div className="flex-1 px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage My Account</h1>


        {loading ? (
              <div className="flex flex-col h-auto align-middle justify-center items-center">
                <img src="/emote/hmmm.png" alt="Loading..." className="w-50 h-auto animate-pulse" />
                <span>Loading...</span>
              </div>
            ) : (
<div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


          <div className="bg-white p-6 relative rounded-lg shadow-md">
          <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-md">
              {" "}
            </div>
            <div className="flex justify-between items-center mb-4">

              <h2 className="text-lg font-semibold text-gray-800">Personal Profile</h2>
              <Link to="/account/profile" className="text-blue-600 hover:underline">Edit Profile</Link>
            </div>


              <div className="flex items-center gap-4">
                <img
                  src={profile?.profile_picture || "/default-avatar.png"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-2 border-gray-300 cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                />
                <div>
                  <p className="text-gray-700 font-medium">{profile?.full_name || "N/A"}</p>
                  <p className="text-gray-600">{profile?.email || "N/A"}</p>
                  <p className="text-gray-600">Mobile: {profile?.mobile || "N/A"}</p>
                </div>
              </div>
            
          </div>


          <div className="bg-white p-6 rounded-lg relative shadow-md">
          <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-md">
              {" "}
            </div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Address Book</h2>
              <Link to="/account/address" className="text-blue-600 hover:underline">Edit</Link>
            </div>
            { addresses.length > 0 ? (
              addresses.filter(a => a.is_default_shipping).map((address, index) => (
                <div key={index} className="text-gray-700">
                  <p className="font-semibold">Default Shipping Address</p>
                  <p>{address.address}</p>
                  <p>Postcode: {address.postcode}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No addresses found.</p>
            )}
          </div>
          
        </div>



        <div className="bg-white relative p-6 rounded-lg shadow-md mt-6">
        <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-2 rounded-t-md">
              {" "}
            </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>
          
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-custom-purple glass text-left text-white">
                  <th className="p-2 border">Order #</th>
                  <th className="p-2 border">Placed On</th>
                  <th className="p-2 border">Items</th>
                  <th className="p-2 border">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-100">
                  <td className="p-2 border">12345</td>
                  <td className="p-2 border">2024-10-30</td>
                  <td className="p-2 border">
                    <img src="https://via.placeholder.com/50" alt="Item" className="w-10 h-10 rounded" />
                  </td>
                  <td className="p-2 border">$50.00</td>
                </tr>
              </tbody>
            </table>
            
        </div>
        
        </div> 
        )}



        {/* Modal */}
        {isModalOpen && (
          <ProfilePictureUploadModal
            isOpen={isModalOpen}
            onClose={(newImageUrl) => {
              if (newImageUrl) setProfile(prev => ({ ...prev, profile_picture: newImageUrl }));
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
