import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { supabase } from "../../../constants/supabase";
import { v4 as uuidv4 } from "uuid";
import { useAddressFields } from '../../../shared/login/hooks/useAddressFields';
import hmmmEmote from '../../../assets/emote/hmmm.png';   

const getLVMCategory = (region) => {
  const luzonRegions = [
    'Ilocos Region',
    'Cagayan Valley',
    'Central Luzon',
    'CALABARZON',
    'MIMAROPA Region',
    'Bicol Region',
    'NCR',
    'CAR'
  ];

  const visayasRegions = [
    'Western Visayas',
    'Central Visayas',
    'Eastern Visayas'
  ];

  const mindanaoRegions = [
    'Zamboanga Peninsula',
    'Northern Mindanao',
    'Davao Region',
    'SOCCSKSARGEN',
    'Caraga',
    'BARMM'
  ];

  if (luzonRegions.includes(region)) return 'Luzon';
  if (visayasRegions.includes(region)) return 'Visayas';
  if (mindanaoRegions.includes(region)) return 'Mindanao';
  return null;
};

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);

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

  const addAddress = async () => {
    if (!userId || !newAddressData.exact_location || !newAddressData.postcode) return;
    setLoading(true);

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
      is_default_shipping: false,
      lvm: getLVMCategory(selectedRegion)
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

  const updateAddress = async () => {
    if (!editAddressId) return;
    setLoading(true);

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
      full_address: `${editAddressData.exact_location}, ${fullAddress}`,
      lvm: getLVMCategory(selectedRegion)
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
            <label className="text-sm font-medium text-gray-700">Zip Code</label>
            <input
              type="text"
              placeholder="Enter Zip Code"
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
      <div className="sticky h-full">
        <Sidebar />
      </div>

      <div className="flex-1 p-4 px-9">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <i className="fas fa-map-marker-alt mr-3 text-primary-color"></i>
            Address Book
          </h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 text-primary-color hover:text-primary-color/80 transition-colors"
          >
            <i className="fas fa-plus"></i>
            <span>Add New Address</span>
          </button>
        </div>

        {loading ? (
          <div className="flex mt-36 flex-col h-100 justify-center items-center">
            <img src={hmmmEmote} alt="Loading..." className="w-24 h-24 mb-4 animate-bounce" />
            <p className="mt-4 text-gray-600">Loading your addresses...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl relative shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-xl"></div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-star mr-2 text-primary-color"></i>
                Default Address
              </h2>

              {defaultAddress ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-600 text-left">Full Address</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-600 text-left">Region</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-600 text-left">City</th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-600 text-left">Zip Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-100">
                        <td className="px-6 py-4 text-gray-800">{defaultAddress.full_address}</td>
                        <td className="px-6 py-4 text-gray-600">{defaultAddress.region}</td>
                        <td className="px-6 py-4 text-gray-600">{defaultAddress.city}</td>
                        <td className="px-6 py-4 text-gray-600">{defaultAddress.postcode}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <i className="fas fa-home text-4xl text-gray-300 mb-3"></i>
                  <p className="text-gray-500">No default address set</p>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl relative shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-xl"></div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-list mr-2 text-primary-color"></i>
                Other Addresses
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-600 text-left">Full Address</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-600 text-left">Region</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-600 text-left">City</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-600 text-left">Zip Code</th>
                      <th className="px-6 py-3 text-xs font-semibold text-gray-600 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {addresses.map((address) => (
                      <tr key={address.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 text-gray-800">{address.full_address}</td>
                        <td className="px-6 py-4 text-gray-600">{address.region}</td>
                        <td className="px-6 py-4 text-gray-600">{address.city}</td>
                        <td className="px-6 py-4 text-gray-600">{address.postcode}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => setDefaultAddressHandler(address.id)}
                              className="text-blue-600 hover:text-blue-700 transition-colors"
                              title="Set as Default"
                            >
                              <i className="fas fa-star"></i>
                            </button>
                            <button
                              onClick={() => openEditModal(address)}
                              className="text-yellow-600 hover:text-yellow-700 transition-colors"
                              title="Edit"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => confirmDeleteAddress(address.id)}
                              className="text-red-600 hover:text-red-700 transition-colors"
                              title="Delete"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {showAddModal && addressModal()}
        {showEditModal && addressModal(true)}
        {showDeleteModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full mx-4">
              <img src="/emote/question.png" alt="Warning" className="w-24 h-24 mx-auto mb-4" />
              <p className="text-center text-lg font-semibold mb-6">Are you sure you want to delete this address?</p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  onClick={deleteAddress}
                >
                  Yes, Delete
                </button>
                <button
                  className="px-6 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Address;
