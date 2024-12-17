import React, { useState, useEffect } from "react";
import SideBar from "../Component/Sidebars";
import { useNavigate } from "react-router-dom";
import blackLogo from "../../../assets/logoWhite.png";
import { blockInvalidChar } from "../Hooks/ValidNumberInput";
import { supabase } from "../../../constants/supabase";

function Vouchers() {
  const navigate = useNavigate();
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteVoucher, setDelVoucher] = useState(false);
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [selectedShopId, setSelectedShopId] = useState(null);
  const [vouchLabel, setVouchLabel] = useState("");
  const [vouchLimit, setVouchLimit] = useState("");
  const [vouchLimit2, setVouchLimit2] = useState("");
  const [showAlert, setShowAlert] = React.useState(false); // Alert
  const [showAlertNull, setShowAlertNull] = React.useState(false); // Alert
  const [showAlertDel, setShowAlertDel] = React.useState(false); // Alert Delete
  const [showNoSelectedVoucher, setShowNoSelDelVocuher] = React.useState(false); // Alert Delete
  const [editVoucher, setEditVoucher] = useState(false);

  //Get the user Shop Data
  useEffect(() => {
    // Fetch the current user profile and shop data
    const fetchUserProfileAndShop = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (user) {
        console.log("Current user:", user);

        // Fetch shop data for the current user
        const { data: shops, error: shopError } = await supabase
          .from("shop")
          .select("shop_name, id") // Specify fields if needed
          .eq("owner_Id", user.id); // Assuming the 'shop' table has 'owner_Id' to link it to the user

        if (shopError) {
          setError(shopError.message);
        } else if (shops && shops.length > 0) {
          const shop = shops[0]; // Since there's only one shop, select the first one
          setShopData(shop); // Store the single shop data
          setSelectedShopId(shop.id); // Automatically set the selected shop ID
          console.log("Shop Name:", shop.shop_name);
          console.log("Shop ID:", shop.id);
        } else {
          console.log("No shop found for the current user.");
          setError("No shop found for the current user.");
        }
      } else {
        console.log("No user is signed in");
        setError("No user is signed in");
      }
      setLoading(false); // Stop the loading state once fetching is done
    };

    fetchUserProfileAndShop();
  }, []);

  // Onsubmit new shop Vouchers
  const handleCreateVoucher = async () => {
    if (!selectedShopId) {
      console.error("No shop selected");
      setError("Please select a shop to create a voucher for.");
      return;
    }
    if (!vouchLimit.trim() || !vouchLimit2.trim() || !vouchLabel.trim()) {
      console.error("Field Required");
      setShowAlertNull(true);
      setTimeout(() => {
        setShowAlertNull(false);
      }, 3000);
      return; // Do not proceed if the phone number is empty
    }
    console.log("Creating voucher for Shop ID:", selectedShopId);
    setLoading(true);

    try {
      // Fetch existing vouchers
      const { data: shopData, error: fetchError } = await supabase
        .from("shop")
        .select("shop_Vouchers")
        .eq("id", selectedShopId)
        .single();

      if (fetchError) {
        console.error("Error fetching shop vouchers:", fetchError);
        setError(fetchError.message);
        return;
      }

      const existingVouchers = shopData?.shop_Vouchers || []; // Default to an empty array

      // Add the new voucher
      const newVoucher = {
        id: Date.now(), // Unique ID (use a better unique ID in production)
        label: vouchLabel,
        items_off: vouchLimit,
        min_spend: vouchLimit2,
      };
      const updatedVouchers = [...existingVouchers, newVoucher];

      // Update the shop_Vouchers column
      const { error: updateError } = await supabase
        .from("shop")
        .update({ shop_Vouchers: updatedVouchers })
        .eq("id", selectedShopId);

      if (updateError) {
        console.error("Error updating vouchers:", updateError);
        setError(updateError.message);
      } else {
        console.log("Voucher created successfully");
        setVouchLabel("");
        setVouchLimit("");
        setVouchLimit2("");
        fetchVouchers(); // Refresh vouchers
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch the current shop Vouchers
  const fetchVouchers = async () => {
    if (!selectedShopId) return;

    try {
      const { data: shopData, error } = await supabase
        .from("shop")
        .select("shop_Vouchers")
        .eq("id", selectedShopId)
        .single();

      if (error) {
        console.error("Error fetching vouchers:", error);
        setError(error.message);
      } else {
        const vouchers = shopData?.shop_Vouchers || [];
        setVouchers(vouchers);
        console.log("Fetched vouchers:", vouchers);
      }
    } catch (error) {
      console.error("Unexpected error fetching vouchers:", error);
    }
  };

  // Fetch vouchers on selectedShopId change
  useEffect(() => {
    fetchVouchers();
  }, [selectedShopId]);

  const handleCheckboxChange = (voucher) => {
    if (selectedVouchers.includes(voucher)) {
      setSelectedVouchers(selectedVouchers.filter((v) => v.id !== voucher.id));
    } else {
      setSelectedVouchers([...selectedVouchers, voucher]);
    }
    console.log("Selected Vouchers:", selectedVouchers); // Log the selected vouchers
  };

  const handleDeleteVouchers = async () => {
    try {
      // Fetch the current vouchers from the shop table
      const { data: shopData, error: fetchError } = await supabase
        .from("shop")
        .select("shop_Vouchers")
        .eq("id", selectedShopId)
        .single();

      if (fetchError) {
        console.error("Error fetching vouchers:", fetchError);
        setError(fetchError.message);
        return;
      }

      const existingVouchers = shopData?.shop_Vouchers || [];

      // Filter out the selected vouchers to delete
      const updatedVouchers = existingVouchers.filter(
        (voucher) =>
          !selectedVouchers.some((selected) => selected.id === voucher.id)
      );

      // Update the shop_Vouchers column with the updated array
      const { error: updateError } = await supabase
        .from("shop")
        .update({ shop_Vouchers: updatedVouchers })
        .eq("id", selectedShopId);

      if (updateError) {
        console.error("Error updating vouchers:", updateError);
        setError(updateError.message);
      } else {
        console.log("Vouchers deleted successfully");
        setDelVoucher(false); // Close modal
        setSelectedVouchers([]); // Reset selected vouchers
        fetchVouchers(); // Refresh the voucher list
        setShowAlertDel(true);
        setTimeout(() => {
          setShowAlertDel(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Unexpected error deleting vouchers:", error);
    }
  };

  const handleSendToFollowers = () => {
    setShowModal(true);
  };
  const handleEditVoucherConfirmations = () => {
    setEditVoucher(true);
  };
  const handleDelVoucherConfirmations = () => {
    if (selectedVouchers.length > 0) {
      setDelVoucher(true); // Show the modal when there are selected vouchers
    } else {
      console.log("No vouchers selected for deletion.");
      setShowNoSelDelVocuher(true);
      setTimeout(() => {
        setShowNoSelDelVocuher(false);
      }, 3000);
    }
  };
  
  
  const handleLabelChange = (index, newValue) => {
    const updatedVouchers = [...selectedVouchers];
    updatedVouchers[index] = { ...updatedVouchers[index], label: newValue };
    setSelectedVouchers(updatedVouchers);
  };
  
  const closeModal = () => {
    setSelectedVouchers([]);
    setShowModal(false);
    setDelVoucher(false);
    setEditVoucher(false);
  };
  const limit = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, "").slice(0, 9);
    setVouchLimit(value);
  };
  const limit2 = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, "").slice(0, 9);
    setVouchLimit2(value);
  };
  return (
    <div className="h-full w-full overflow-y-scroll px-16 bg-slate-300 custom-scrollbar ">
      <div className="absolute mx-3 right-0 z-10">
        <SideBar />
      </div>
      <div className="w-full h-full bg-slate-100 p-5 relative">
        <div className="text-custom-purple font-bold text-3xl ">
          Shop Vouchers
        </div>
        <div className=" w-full h-auto mt-2 flex gap-5">
          <div className="w-1/4 h-[550px] ">
            <div className="w-full h-auto place-items-center glass bg-violet-500 shadow-md shadow-slate-500 p-2 rounded-md">
              <div className="text-2xl text-center font-semibold text-slate-900 iceland-regular ">
                Create Vouchers
              </div>
              <div className="mb-2 gap-3 flex place-items-center mt-2">
                <label className="text-slate-800 font-semibold text-sm ">
                  Vouch Tag:
                </label>
                <input
                  onChange={(e) => setVouchLabel(e.target.value)}
                  value={vouchLabel}
                  type="text"
                  className="bg-slate-50 rounded-md  text-slate-800 text-sm p-1 w-48   border-[1px] border-custom-purple"
                ></input>
              </div>
              <div className="mb-2 gap-3 flex place-items-center mt-2">
                <label className="text-slate-800 font-semibold text-sm ">
                  Items OFF:
                </label>
                <input
                  onKeyDown={blockInvalidChar}
                  onChange={(e) => setVouchLimit(e.target.value)}
                  value={vouchLimit}
                  type="number"
                  className="bg-slate-50 rounded-md text-slate-800 text-sm p-1 w-48   border-[1px] border-custom-purple"
                ></input>
              </div>
              <div className="mb-2 gap-2 flex place-items-center">
                <label className="text-slate-800 font-semibold text-sm">
                  Min Spend:
                </label>
                <input
                  onKeyDown={blockInvalidChar}
                  onChange={(e) => setVouchLimit2(e.target.value)}
                  value={vouchLimit2}
                  type="number"
                  className="bg-slate-50 rounded-md text-slate-800 text-sm p-1 w-48 border-[1px] border-custom-purple"
                ></input>
              </div>
              <div className="justify-end relative w-full flex  ">
                <button
                  onClick={handleCreateVoucher}
                  className="p-2 bg-custom-purple shadow-md mr-2 text-white text-sm glass rounded-md hover:bg-primary-color hover:scale-95 duration-300"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "CREATE"}
                </button>
              </div>
            </div>
            <div className="mt-2 h-[370px] relative">
              <div className="w-auto">
                <button
                  onClick={handleSendToFollowers}
                  className="font-semibold text-slate-800 flex justify-between w-full hover:bg-slate-300 duration-200 rounded-md p-1"
                >
                  Gift to Followers{" "}
                  <box-icon color="#FAB12F" name="gift"></box-icon>{" "}
                </button>
              </div>
              <div>
                <button
                  onClick={handleDelVoucherConfirmations}
                  className="font-semibold text-slate-800 flex justify-between w-full hover:bg-slate-300 duration-200 rounded-md p-1"
                >
                  Delete Voucher{" "}
                  <box-icon
                    type="solid"
                    name="coupon"
                    color="#FAB12F"
                  ></box-icon>{" "}
                </button>
              </div>
              <div>
                <button
                  onClick={handleEditVoucherConfirmations}
                  className="font-semibold text-slate-800 flex justify-between w-full hover:bg-slate-300 duration-200 rounded-md p-1"
                >
                  Edit Vouchers{" "}
                  <box-icon
                    type="solid"
                    name="coupon"
                    color="#FAB12F"
                  ></box-icon>{" "}
                </button>
              </div>
              <div className="absolute w-full bottom-10 ">
                <div className="w-full flex justify-between">
                  <button
                    onClick={() => navigate("/shop/MerchantDashboard")}
                    className="font-semibold text-slate-800 flex justify-between w-full hover:bg-slate-300 duration-200 rounded-md p-1"
                  >
                    Go back to Dashboard{" "}
                    <box-icon
                      name="dashboard"
                      color="#4D077C"
                      type="solid"
                    ></box-icon>{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-3/4 h-[550px] rounded-md bg-slate-200  shadow-inner shadow-slate-500 overflow-hidden overflow-y-scroll">
            <div className="w-auto grid grid-cols-2 relative place-items-center gap-3 p-3">
              {vouchers.length > 0 ? (
                vouchers.map((voucher) => (
                  <div
                    key={voucher.id}
                    className="h-14 w-full shadow-md shadow-primary-color relative bg-slate-800 hover:scale-95 duration-300 mt-1 flex place-items-center rounded-sm"
                  >
                    <div className="absolute -ml-2">
                      <div className="bg-slate-200 h-3 w-3 mb-1 rounded-full"></div>
                      <div className="bg-slate-200 h-3 w-3 rounded-full"></div>
                    </div>
                    <div className="bg-slate-400 md:h-5 md:w-5 h-3 w-3 rounded-full absolute right-3 place-content-center flex place-items-center">
                      <input
                        type="checkbox"
                        checked={selectedVouchers.some(
                          (v) => v.id === voucher.id
                        )}
                        className="checkbox rounded-full"
                        onChange={() => handleCheckboxChange(voucher)}
                      />
                    </div>
                    <div>
                      <div className="h-10 w-10 rounded-full mx-5">
                        <img
                          src={blackLogo}
                          alt="Shop Logo"
                          className="drop-shadow-custom object-cover"
                        />
                      </div>
                    </div>
                    <div className="h-full w-full bg-slate-100 p-1 px-2">
                      <div>
                        <p className="text-slate-800 font-medium text-sm md:text-lg">
                          Shop Voucher
                          <span className="text-custom-purple font-semibold">
                            {" "}
                            ₱{voucher.items_off} OFF
                          </span>
                        </p>
                        <p className="text-slate-800 font-normal text-sm">
                          Minimum spend of
                          <span className="text-custom-purple font-semibold">
                            {" "}
                            ₱{voucher.min_spend}
                          </span>
                          <span className="text-violet-600">
                            {" "}
                            {voucher.label}{" "}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-800  h-auto font-medium text-center place-items-center justify-center absolute ">
                  <span className="text-center">Loading Shop Vouchers</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* MODALS CONFIRMATIONS */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4 text-slate-800">
              Gift to Followers
            </h2>
            <ul>
              {selectedVouchers.length > 0 ? (
                selectedVouchers.map((voucher, index) => (
                  <li
                    key={voucher.id || index}
                    className="mb-2 text-custom-purple"
                  >
                    <span className="text-violet-600 font-semibold ">
                      "{voucher.label}"
                    </span>{" "}
                    {voucher.items_off}% OFF - Minimum Spend: ₱
                    {voucher.min_spend}
                  </li>
                ))
              ) : (
                <li>No vouchers selected.</li>
              )}
            </ul>
            <div className="flex w-full justify-between">
              <button
                onClick={closeModal}
                className="mt-4 p-2 bg-red-500 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false) && {}}
                className="mt-4 p-2 bg-green-500 text-white rounded-md"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODALS EDIT */}
      {editVoucher && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-md shadow-md w-[400px]">
            <h2 className="text-xl font-bold mb-4 text-slate-800">
              Edit Vouchers
            </h2>
            <ul>
              {selectedVouchers.length > 0 ? (
                selectedVouchers.map((voucher, index) => (
                  <li key={voucher.id || index} className="mb-4">
                    <label className="block text-sm font-semibold text-slate-800 mb-1">
                      Voucher Label
                    </label>
                    <input
                      type="text"
                      value={voucher.label}
                      onChange={(e) => handleLabelChange(index, e.target.value)}
                      className="w-full p-2 border rounded-md text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-600"
                    />
                    <p className="text-custom-purple mt-1">
                      {voucher.items_off}% OFF - Minimum Spend: ₱
                      {voucher.min_spend}
                    </p>
                  </li>
                ))
              ) : (
                <li className="text-center">No vouchers selected.</li>
              )}
            </ul>
            <div className="flex w-full justify-between">
              <button
                onClick={closeModal}
                className="mt-4 p-2 bg-red-500 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowModal(false) && {}}
                className="mt-4 p-2 bg-green-500 text-white rounded-md"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE VOUCHER CONFIRMATIONS */}
      {deleteVoucher && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center text-slate-800">
              Delete Vouchers?
            </h2>
            <ul>
              {selectedVouchers.length > 0 ? (
                selectedVouchers.map((voucher, index) => (
                  <li
                    key={voucher.id || index}
                    className="mb-2 text-custom-purple"
                  >
                    <span className="text-violet-600 font-semibold ">
                      "{voucher.label}"
                    </span>{" "}
                    {voucher.items_off}% OFF - Minimum Spend: ₱
                    {voucher.min_spend}
                  </li>
                ))
              ) : (
                <li>No vouchers selected.</li>
              )}
            </ul>
            <div className="flex w-full gap-2 justify-between">
              <button
                onClick={closeModal}
                className="mt-4 p-2 bg-red-500 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVouchers}
                className="mt-4 p-2 bg-green-500 text-white rounded-md"
              >
                Delete anyway
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ALLERTS ADD VOUCHERS */}
      {showAlert && (
        <div className="md:bottom-5 lg:bottom-10 z-10 justify-end md:right-5 lg:right-10 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div
            role="alert"
            className="alert alert-success shadow-md flex items-center p-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-slate-50 font-semibold rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current mr-2"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Voucher Added</span>
          </div>
        </div>
      )}
      {/* ALLERTS EMPTY FIELDS */}
      {showAlertNull && (
        <div className="md:bottom-5 lg:bottom-10 z-10 justify-end md:right-5 lg:right-10 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div
            role="alert"
            className="alert alert-success shadow-md flex items-center p-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-slate-50 font-semibold rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-6 w-6 shrink-0 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Fields are Empty, fill required!</span>
          </div>
        </div>
      )}
      {/* ALLERTS DELETE VOUCHERS */}
      {showAlertDel && (
        <div className="md:bottom-5 lg:bottom-10 z-10 justify-end md:right-5 lg:right-10 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div
            role="alert"
            className="alert alert-success shadow-md flex items-center p-4 bg-red-600 text-slate-50 font-semibold rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Voucher Deleted</span>
          </div>
        </div>
      )}
      {/* ALLERTS DELETE VOUCHERS */}
      {showNoSelectedVoucher && (
        <div className="md:bottom-5 lg:bottom-10 z-10 justify-end md:right-5 lg:right-10 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div
            role="alert"
            className="alert alert-info shadow-md flex items-center p-4 text-slate-50 font-semibold rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="h-6 w-6 shrink-0 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>Select a Voucher to be Deleted</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vouchers;
