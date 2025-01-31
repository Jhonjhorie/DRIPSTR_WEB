import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { supabase } from "../../../constants/supabase";
import { v4 as uuidv4 } from "uuid";

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [newAddress, setNewAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
  const [editAddress, setEditAddress] = useState("");
  const [editPostcode, setEditPostcode] = useState("");

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchAddresses();
    }
  }, [userId]);

  const fetchUser = async () => {
    setLoading(true);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) console.error("Error fetching user:", error);
    setUserId(user?.id || null);
    setLoading(false);
  };

  const fetchAddresses = async () => {
    if (!userId) return;
    setLoading(true);
    const { data, error } = await supabase.from("addresses").select("*").eq("user_id", userId);
    if (error) {
      console.error("Error fetching addresses:", error);
    } else {
      setDefaultAddress(data.find(addr => addr.is_default_shipping) || null);
      setAddresses(data.filter(addr => !addr.is_default_shipping));
    }
    setLoading(false);
  };


  const addAddress = async () => {
    if (!userId || !newAddress.trim() || !postcode.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("addresses").insert([
      { id: uuidv4(), address: newAddress, postcode, user_id: userId, is_default_shipping: false },
    ]);
    if (error) {
      console.error("Error adding address:", error);
    } else {
      setNewAddress("");
      setPostcode("");
      fetchAddresses();
    }

    setLoading(false);
    setShowAddModal(false)
  };



  const confirmDeleteAddress = (id) => {
    setAddressToDelete(id);
    setShowDeleteModal(true);
  };
  const openEditModal = (address) => {
    setEditAddressId(address.id);
    setEditAddress(address.address);
    setEditPostcode(address.postcode);
    setShowEditModal(true);
  };


  const updateAddress = async () => {
    if (!editAddressId || !editAddress.trim() || !editPostcode.trim()) return;
    setLoading(true);
    const { error } = await supabase.from("addresses").update({
      address: editAddress,
      postcode: editPostcode
    }).eq("id", editAddressId);
    if (error) {
      console.error("Error updating address:", error);
    } else {
      fetchAddresses();
      setShowEditModal(false);
    }
    setLoading(false);
  };




  const deleteAddress = async () => {
    if (!addressToDelete) return;
    setLoading(true);
    const { error } = await supabase.from("addresses").delete().eq("id", addressToDelete);
    if (error) console.error("Error deleting address:", error);
    setShowDeleteModal(false);
    setAddressToDelete(null);
    fetchAddresses();
    setLoading(false);
  };

  const setDefaultAddressHandler = async (id) => {
    if (!userId || defaultAddress?.id === id) return;
    setLoading(true);
    await supabase.from("addresses").update({ is_default_shipping: false }).eq("user_id", userId);
    const { error } = await supabase.from("addresses").update({ is_default_shipping: true }).eq("id", id);
    if (error) console.error("Error setting default address:", error);
    fetchAddresses();
    setLoading(false);
  };

  return (
    <div className="p-4 bg-slate-200 min-h-screen flex flex-row">
      <Sidebar />
      <div className="px-5 flex-1">
        <div className="p-4 bg-slate-200 min-h-screen">
        <div className="flex flex-1 justify-between align-bottom flex-row">

          <h1 className="text-xl font-bold text-gray-800 mb-6">Address Book</h1>
          <button className="bg-violet-600 text-white px-4 rounded-lg mb-2" onClick={() => setShowAddModal(true)}>
              Add New Address
          </button>
        </div>


          <div className="bg-gray-100 p-4 rounded-lg shadow">
            <h3 className="text-l font-bold text-gray-700">Default Address</h3>


           {loading ? (
            <div className="flex flex-col items-center justify-center">
              <img src="/emote/hmmm.png" alt="Loading..." className="w-50 h-50" />
              <label>Loading...</label>
            </div>
          ) : defaultAddress ? (

            
            <table className="w-full  border-1 border-gray-300 bg-white shadow-md rounded-lg mt-4">
              <thead className="bg-violet-500 rounded-lg text-gray-900 border-1 border-gray-300">
                <tr>
                  <th className="px-4 py-2">Address</th>
                  <th className="px-4 py-2">Postcode</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2">{defaultAddress.address}</td>
                  <td className="px-4 py-2">{defaultAddress.postcode}</td>
                </tr>
              </tbody>
            </table>
          ) : <p>No default address set.</p>}
                    </div>


          <div className="divider p-2"></div>
          <div className="bg-gray-100 p-4 rounded-lg shadow">

          <h3 className="text-l font-bold text-gray-900">Addresses</h3>

          {loading ? (
          <div className="flex flex-col justify-center items-center">
            <img src="/emote/hmmm.png" alt="Loading..." className="w-50 h-50" />
            <label>Loading...</label>
          </div>
        ) : (
          <table className="w-full   border-1 border-gray-300 bg-white shadow-md rounded-lg mt-4">
            <thead className="bg-violet-500 rounded-lg text-gray-900 border-1 border-gray-300">
              <tr>
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">Postcode</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map((address) => (
                <tr key={address.id} className="border-b">
                  <td className="px-4 py-2">{address.address}</td>
                  <td className="px-4 py-2">{address.postcode}</td>
                  <td className="px-4 py-2 text-center">
                    <button className=" mr-3 hover:text-green-500" onClick={() => setDefaultAddressHandler(address.id)}> Set Default </button> 
                    <button className=" mr-3 hover:text-yellow-500" onClick={() => openEditModal(address)}>Edit </button>
                    <button className=" hover:text-red-500" onClick={() => confirmDeleteAddress(address.id)} title="Delete this address?"> Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}          </div>


          {showAddModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-center font-bold text-lg">Add Address</h2>
                <div className="flex flex-col mt-4">
                  <label>Address</label>
                  <input
                    type="text"
                    placeholder="Enter Address"
                    className="border rounded-lg text-black p-2 bg-white"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                  />
                </div>
                <div className="flex flex-col mt-2">
                  <label>Post Code</label>
                  <input
                    type="text"
                    placeholder="Enter Postcode"
                    className="border rounded-lg text-black p-2 bg-white"
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={addAddress}>Add Address</button>
                  <button className="bg-gray-300 px-4 py-2 rounded-lg mr-2" onClick={() => setShowAddModal(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}


          {showEditModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-center font-bold text-lg">Edit Address</h2>
                <div className="flex flex-col mt-4">
                  <label>Address</label>
                  <input
                    type="text"
                    className="border rounded-lg text-black p-2 bg-white"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                  />
                </div>
                <div className="flex flex-col mt-2">
                  <label>Post Code</label>
                  <input
                    type="text"
                    className="border rounded-lg text-black p-2 bg-white"
                    value={editPostcode}
                    onChange={(e) => setEditPostcode(e.target.value)}
                  />
                </div>
                <div className="flex justify-end mt-4">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={updateAddress}>Update</button>
                  <button className="bg-gray-300 px-4 py-2 rounded-lg ml-2" onClick={() => setShowEditModal(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}


          {showDeleteModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <img src="/emote/question.png" alt="Warning" className="w-25 h-25 mx-auto" />
                <p className="text-center font-bold">Are you sure?</p>
                <div className="flex justify-center mt-4">
                  <button className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2" onClick={deleteAddress}>Yes</button>
                  <button className="bg-gray-300 px-4 py-2 rounded-lg" onClick={() => setShowDeleteModal(false)}>No</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Address;
