import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { supabase } from "../../../constants/supabase";
import { v4 as uuidv4 } from "uuid";
import { useAddressFields } from '../../../shared/login/hooks/useAddressFields';

const Address = () => {
  // Existing states
  const [addresses, setAddresses] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);

  // New states for address fields
  const [newAddressData, setNewAddressData] = useState({
    region: '',
    city: '',
    barangay: '',
    exact_location: '',
    postcode: ''
  });

  const [editAddressData, setEditAddressData] = useState({
    region: '',
    city: '',
    barangay: '',
    exact_location: '',
    postcode: ''
  });

  // Use the existing address fields hook
  const {
    addressData,
    selected,
    loading: addressLoading,
    handleRegionChange,
    handleCityChange,
    handleExactLocationChange,
    setSelected
  } = useAddressFields(true, false);

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

  // Modified addAddress function
  const addAddress = async () => {
    if (!userId || !newAddressData.exact_location || !newAddressData.postcode) return;
    setLoading(true);

    // Get the names from the selected options
    const selectedRegion = addressData.regions.find(r => r.code === selected.region)?.name;
    const selectedCity = addressData.cities.find(c => c.code === selected.city)?.name;
    const selectedBarangay = addressData.barangays.find(b => b.code === selected.barangay)?.name;

    const fullAddress = `${selectedBarangay}, ${selectedCity}, ${selectedRegion}`;
    
    const { error } = await supabase.from("addresses").insert([{
      id: uuidv4(),
      user_id: userId,
      region: selectedRegion,
      city: selectedCity,
      barangay: selectedBarangay,
      exact_location: newAddressData.exact_location,
      postcode: newAddressData.postcode,
      full_address: `${newAddressData.exact_location}, ${fullAddress}`,
      is_default_shipping: false
    }]);

    if (error) {
      console.error("Error adding address:", error);
    } else {
      setNewAddressData({
        region: '',
        city: '',
        barangay: '',
        exact_location: '',
        postcode: ''
      });
      fetchAddresses();
    }

    setLoading(false);
    setShowAddModal(false);
  };

  // Modified updateAddress function
  const updateAddress = async () => {
    if (!editAddressId) return;
    setLoading(true);

    // Get the names from the selected options
    const selectedRegion = addressData.regions.find(r => r.code === selected.region)?.name;
    const selectedCity = addressData.cities.find(c => c.code === selected.city)?.name;
    const selectedBarangay = addressData.barangays.find(b => b.code === selected.barangay)?.name;

    const fullAddress = `${selectedBarangay}, ${selectedCity}, ${selectedRegion}`;

    const { error } = await supabase.from("addresses").update({
      region: selectedRegion,
      city: selectedCity,
      barangay: selectedBarangay,
      exact_location: editAddressData.exact_location,
      postcode: editAddressData.postcode,
      full_address: `${editAddressData.exact_location}, ${fullAddress}`
    }).eq("id", editAddressId);

    if (error) {
      console.error("Error updating address:", error);
    } else {
      fetchAddresses();
      setShowEditModal(false);
    }
    setLoading(false);
  };

  const confirmDeleteAddress = (id) => {
    setAddressToDelete(id);
    setShowDeleteModal(true);
  };
  const openEditModal = (address) => {
    setEditAddressId(address.id);
    setEditAddressData({
      region: address.region,
      city: address.city,
      barangay: address.barangay,
      exact_location: address.exact_location,
      postcode: address.postcode
    });
    setShowEditModal(true);
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

  // Update the address modal JSX
  const addressModal = (isEdit = false) => (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white py-2 px-6 rounded-lg shadow-lg w-[500px]">
        <h2 className="text-center font-bold text-lg ">
          {isEdit ? 'Edit Address' : 'Add New Address'}
        </h2>
        <div className="space-y-2">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Region</label>
            <select
              className="mt-1 select select-bordered bg-gray-100 w-full"
              value={selected.region}
              onChange={(e) => handleRegionChange(e.target.value)}
              disabled={addressLoading.regions}
            >
              <option value="">Select Region</option>
              {addressData.regions.map(region => (
                <option key={region.code} value={region.code}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">City/Municipality</label>
            <select
              className="mt-1 select select-bordered bg-gray-100 w-full"
              value={selected.city}
              onChange={(e) => handleCityChange(e.target.value)}
              disabled={!selected.region || addressLoading.cities}
            >
              <option value="">Select City</option>
              {addressData.cities.map(city => (
                <option key={city.code} value={city.code}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Barangay</label>
            <select
              className="mt-1 select select-bordered bg-gray-100 w-full"
              value={selected.barangay}
              onChange={(e) => setSelected(prev => ({ ...prev, barangay: e.target.value }))}
              disabled={!selected.city || addressLoading.barangays}
            >
              <option value="">Select Barangay</option>
              {addressData.barangays.map(barangay => (
                <option key={barangay.code} value={barangay.code}>
                  {barangay.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Exact Location</label>
            <input
              type="text"
              placeholder="Street, Building, Floor, etc."
              className="mt-1 input input-bordered bg-gray-100 w-full"
              value={isEdit ? editAddressData.exact_location : newAddressData.exact_location}
              onChange={(e) => {
                if (isEdit) {
                  setEditAddressData(prev => ({ ...prev, exact_location: e.target.value }));
                } else {
                  setNewAddressData(prev => ({ ...prev, exact_location: e.target.value }));
                }
              }}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Postcode</label>
            <input
              type="text"
              placeholder="Enter Postcode"
              className="mt-1 input input-bordered bg-gray-100 w-full"
              value={isEdit ? editAddressData.postcode : newAddressData.postcode}
              onChange={(e) => {
                if (isEdit) {
                  setEditAddressData(prev => ({ ...prev, postcode: e.target.value }));
                } else {
                  setNewAddressData(prev => ({ ...prev, postcode: e.target.value }));
                }
              }}
            />
          </div>
        </div>

        <div className="flex justify-end mt-2 gap-2">
          <button
            className="btn btn-primary"
            onClick={isEdit ? updateAddress : addAddress}
          >
            {isEdit ? 'Update' : 'Add'} Address
          </button>
          <button
            className="btn"
            onClick={() => isEdit ? setShowEditModal(false) : setShowAddModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-slate-200 flex flex-row h-full overflow-hidden">
      <div className="sticky h-full ">
        <Sidebar />
      </div>
      <div className="px-5 flex-1">
        <div className="p-4 bg-slate-200">
        <div className="flex flex-1 justify-between align-bottom flex-row">

          <h1 className="text-xl font-bold text-gray-800 mb-4">Address Book</h1>
          <button className="text-violet-600 px-4 rounded-lg mb-2 hover:underline" onClick={() => setShowAddModal(true)}>
              Add New Address
          </button>
        </div>


          <div className="bg-gray-100   p-4 rounded-lg shadow">

   
            <h3 className="text-l font-bold text-gray-700">Default Address</h3>


           {loading ? (
            <div className="flex flex-col items-center justify-center">
              <img src="/emote/hmmm.png" alt="Loading..." className="w-32 h-32" />
              <label>Loading...</label>
            </div>
          ) : defaultAddress ? (

            
            <table className="w-full border-1 border-gray-300 bg-white shadow-md rounded-lg mt-2">
              <thead className="shadow-sm  text-gray-500  border-1">
                <tr>
                  <th className="px-3 py-2">Full Address</th>
                  <th className="px-3 py-2">Region</th>
                  <th className="px-3 py-2">City</th>
                  <th className="px-3 py-2">Postcode</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-3 py-2">{defaultAddress.full_address}</td>
                  <td className="px-3 py-2">{defaultAddress.region}</td>
                  <td className="px-3 py-2">{defaultAddress.city}</td>
                  <td className="px-3 py-2">{defaultAddress.postcode}</td>
                </tr>
              </tbody>
            </table>
          ) : <p>No default address set.</p>}
                    </div>


          <div className="divider p-2"></div>
          <div className="bg-gray-100   p-4 rounded-lg shadow">
 
          <h3 className="text-l font-bold text-gray-700">Address</h3>

          {loading ? (
          <div className="flex flex-col justify-center items-center">
            <img src="/emote/hmmm.png" alt="Loading..." className="w-32 h-32" />
            <label>Loading...</label>
          </div>
        ) : (
          <table className="w-full border-1 border-gray-300 bg-white shadow-md rounded-lg mt-2">
              <thead className="shadow-sm  text-gray-500  border-1">
              <tr>
                <th className="px-4 py-2">Full Address</th>
                <th className="px-4 py-2">Region</th>
                <th className="px-4 py-2">City</th>
                <th className="px-4 py-2">Postcode</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {addresses.map((address) => (
                <tr key={address.id} className="border-b">
                  <td className="px-4 py-2">{address.full_address}</td>
                  <td className="px-4 py-2">{address.region}</td>
                  <td className="px-4 py-2">{address.city}</td>
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


          {showAddModal && addressModal()}


          {showEditModal && addressModal(true)}


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
