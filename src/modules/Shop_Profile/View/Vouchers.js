import React, { useState, useEffect } from "react";
import SideBar from "../Component/Sidebars";
import { useNavigate } from "react-router-dom";
import blackLogo from "../../../assets/logoWhite.png";
import { blockInvalidChar } from "../Hooks/ValidNumberInput";
import { supabase } from "../../../constants/supabase";
import questionEmote from "../../../../src/assets/emote/question.png";
import hmmmEmote from "../../../../src/assets/emote/hmmm.png";
import successEmote from "../../../../src/assets/emote/success.png";

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
  const [expiryDate, setExpiryDate] = useState("");

  const [showAlert, setShowAlert] = React.useState(false); // Alert
  const [showAlertNull, setShowAlertNull] = React.useState(false); // Alert
  const [showAlertUpdated, setShowAlertUpdated] = React.useState(false); // Alert Update
  const [showAlertSent, setShowAlertSent] = React.useState(false); // Alert Sent
  const [showAlertSentNosel, setShowAlertSentNosel] = React.useState(false); // Alert Sent
  const [showAlertDel, setShowAlertDel] = React.useState(false); // Alert Delete
  const [showAlertDeac, setShowAlertDeac] = React.useState(false); // Alert Deactivate
  const [showAlertAc, setShowAlertAc] = React.useState(false); // Alert Activate
  const [showNoSelectedVoucher, setShowNoSelDelVocuher] = React.useState(false); // Alert Delete
  const [showNoSelectedDeacVoucher, setShowNoSelDeacVocuher] =
    React.useState(false); // Alert Deactivate
  const [showNoSelectedAcVoucher, setShowNoSelAcVocuher] =
    React.useState(false); // Alert activate
  const [editVoucher, setEditVoucher] = useState(false);
  const [deacVoucher, setDeacVoucher] = useState(false);
  const [acVoucher, setAcVoucher] = useState(false);
  const [showNoSelectedeEditVoucher, setShopEdit] = useState(false);
  const [followersCount, setTotalFollowers] = useState(0); // Initialize with 0
  const [followerDetails, setFollowerDetails] = useState([]); // Initialize followers info
  const [selectedFollowers, setSelectedFollowers] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  //Get the user Shop Data
  useEffect(() => {
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

        const { data: shops, error: shopError } = await supabase
          .from("shop")
          .select("shop_name, id")
          .eq("owner_Id", user.id);

        if (shopError) {
          setError(shopError.message);
        } else if (shops && shops.length > 0) {
          const shop = shops[0];
          setShopData(shop);
          setSelectedShopId(shop.id);
          console.log("Shop Name:", shop.shop_name);
          console.log("Shop ID:", shop.id);
        } else {
          console.log("No shop found for the current user.");
          setError("No shop found for the current user.");
        }

        // Fetch followers
        const { data: followers, error: followerError } = await supabase
          .from("merchant_Followers")
          .select("id, acc_id::text, shop_id, created_at")
          .in(
            "shop_id",
            shops.map((shop) => shop.id)
          );

        if (followerError) {
          console.error("Error fetching followers:", followerError.message);
          setError(followerError.message);
          setLoading(false);
          return;
        }

        if (!followers || followers.length === 0) {
          console.log("No followers found");
          setFollowerDetails([]);
          setTotalFollowers(0);
          setLoading(false);
          return;
        }

        console.log("Fetched followers:", followers);

        // Fetch profile details for each follower's acc_id
        const followerAccIds = followers.map((f) => f.acc_id);
        const { data: profiles, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, profile_picture")
          .in("id", followerAccIds);

        if (profileError) {
          console.error(
            "Error fetching follower profiles:",
            profileError.message
          );
          setError(profileError.message);
          setLoading(false);
          return;
        }

        console.log("Fetched follower profiles:", profiles);

        // Merge follower data with profile details
        const detailedFollowers = followers.map((follower) => ({
          ...follower,
          profile: profiles.find((p) => p.id === follower.acc_id) || null,
        }));

        setFollowerDetails(detailedFollowers);
        setTotalFollowers(detailedFollowers.length);
      } else {
        console.log("No user is signed in");
        setError("No user is signed in");
      }
      setLoading(false);
    };

    fetchUserProfileAndShop();
  }, []);

  const toggleFollowerSelection = (follower) => {
    setSelectedFollowers((prev) =>
      prev.some((f) => f.acc_id === follower.acc_id)
        ? prev.filter((f) => f.acc_id !== follower.acc_id)
        : [...prev, follower]
    );
  };
  // Function to toggle "Select All"
  const toggleSelectAll = () => {
    if (selectedFollowers.length === sortedFollowers.length) {
      setSelectedFollowers([]);
    } else {
      setSelectedFollowers([...sortedFollowers]);
    }
  };
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
  };
  const sortedFollowers = [...followerDetails].sort((a, b) => {
    return sortOrder === "newest"
      ? new Date(b.created_at) - new Date(a.created_at)
      : new Date(a.created_at) - new Date(b.created_at);
  });

  // Onsubmit new shop Vouchers
  const handleCreateVoucher = async () => {
    if (!selectedShopId) {
      console.error("No shop selected");
      setError("Please select a shop to create a voucher for.");
      return;
    }
    if (
      !vouchLimit.trim() ||
      !vouchLimit2.trim() ||
      !vouchLabel.trim() ||
      !expiryDate.trim()
    ) {
      console.error("Field Required");
      setShowAlertNull(true);
      setTimeout(() => {
        setShowAlertNull(false);
      }, 3000);
      return;
    }

    console.log("Creating voucher for Shop ID:", selectedShopId);
    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from("merchant_Vouchers")
        .insert([
          {
            voucher_name: vouchLabel,
            discount: parseFloat(vouchLimit),
            condition: parseFloat(vouchLimit2),
            merchant_Id: selectedShopId,
            expiration: expiryDate,
            isDeactivate: false,
          },
        ]);

      if (insertError) {
        console.error("Error inserting new voucher:", insertError);
        setError(insertError.message);
      } else {
        console.log("Voucher created successfully");
        setVouchLabel("");
        setVouchLimit("");
        setVouchLimit2("");
        setExpiryDate("");
        fetchVouchers();
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
      const { data: vouchers, error } = await supabase
        .from("merchant_Vouchers")
        .select(
          "id, voucher_name, condition, discount, expiration, isDeactivate"
        )
        .eq("merchant_Id", selectedShopId);

      if (error) {
        console.error("Error fetching vouchers:", error);
        setError(error.message);
      } else {
        setVouchers(vouchers);
        console.log("Fetched vouchers:", vouchers);
      }
    } catch (error) {
      console.error("Unexpected error fetching vouchers:", error);
    }
  };

  const handleSendToFollowersGift = async () => {
    try {
      if (selectedFollowers.length === 0 || selectedVouchers.length === 0) {
        console.error("No followers or vouchers selected.");
        return;
      }

      console.log(
        "Selected Followers Before Filtering:",
        JSON.stringify(selectedFollowers, null, 2)
      );

      const validUUID = /^[0-9a-fA-F-]{36}$/i;

      const validSelectedFollowers = selectedFollowers.filter((f) => {
        if (!f.acc_id) {
          console.warn(`Follower missing acc_id:`, f);
          return false;
        }
        if (!validUUID.test(f.acc_id)) {
          console.warn(`Invalid UUID format:`, f.acc_id);
          return false;
        }
        return true;
      });

      if (validSelectedFollowers.length === 0) {
        console.error("No valid selected follower UUIDs found.");
        return;
      }

      console.log(
        "Valid Selected Followers:",
        JSON.stringify(validSelectedFollowers, null, 2)
      );

      const vouchersToInsert = validSelectedFollowers.flatMap((f) =>
        selectedVouchers.map((voucher) => ({
          acc_id: f.acc_id,
          isClaim: true,
          isUsed: false,
          vouch_MID: voucher.id,
          merchant_Id: selectedShopId,
        }))
      );

      console.log(
        "Vouchers to insert:",
        JSON.stringify(vouchersToInsert, null, 2)
      );

      const { error } = await supabase
        .from("customer_vouchers")
        .insert(vouchersToInsert);

      if (error) {
        console.error("Error sending vouchers:", error.message);
      } else {
        console.log("Vouchers successfully sent to selected followers!");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        setSelectedFollowers([]);
        setSelectedVouchers([]);
        closeModal();
      }
    } catch (error) {
      console.error("Unexpected error sending vouchers:", error);
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
    if (!selectedShopId || selectedVouchers.length === 0) {
      console.error("No shop selected or no vouchers selected for deletion.");
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from("merchant_Vouchers")
        .delete()
        .in(
          "id",
          selectedVouchers.map((voucher) => voucher.id)
        )
        .eq("merchant_Id", selectedShopId);

      if (deleteError) {
        console.error("Error deleting vouchers:", deleteError);
        setError(deleteError.message);
      } else {
        console.log("Vouchers deleted successfully");
        setDelVoucher(false);
        setSelectedVouchers([]);
        fetchVouchers();
        setShowAlertDel(true);
        setTimeout(() => {
          setShowAlertDel(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Unexpected error deleting vouchers:", error);
    }
  };

  const handleDeacVouchers = async () => {
    if (!selectedShopId || selectedVouchers.length === 0) {
      console.error("No shop selected or no vouchers selected for deletion.");
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from("merchant_Vouchers")
        .update({ isDeactivate: true })
        .in(
          "id",
          selectedVouchers.map((voucher) => voucher.id)
        )
        .eq("merchant_Id", selectedShopId);

      if (updateError) {
        console.error("Error deleting vouchers:", updateError);
        setError(updateError.message);
      } else {
        console.log("Vouchers deleted successfully");
        setDeacVoucher(false);
        setSelectedVouchers([]);
        fetchVouchers();
        setShowAlertDeac(true);
        setTimeout(() => {
          setShowAlertDeac(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Unexpected error deleting vouchers:", error);
    }
  };
  const handleAcVouchers = async () => {
    if (!selectedShopId || selectedVouchers.length === 0) {
      console.error("No shop selected or no vouchers selected for deletion.");
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from("merchant_Vouchers")
        .update({ isDeactivate: false })
        .in(
          "id",
          selectedVouchers.map((voucher) => voucher.id)
        )
        .eq("merchant_Id", selectedShopId);

      if (updateError) {
        console.error("Error deleting vouchers:", updateError);
        setError(updateError.message);
      } else {
        console.log("Vouchers deleted successfully");
        setAcVoucher(false);
        setSelectedVouchers([]);
        fetchVouchers();
        setShowAlertAc(true);
        setTimeout(() => {
          setShowAlertAc(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Unexpected error deleting vouchers:", error);
    }
  };
  const handleSendToFollowers = () => {
    if (selectedVouchers.length > 0) {
      setShowModal(true);
    } else {
      console.log("No vouchers selected for deletion.");
      setShowAlertSentNosel(true);
      setTimeout(() => {
        setShowAlertSentNosel(false);
      }, 3000);
    }
  };

  const handleEditVoucherConfirmations = () => {
    if (selectedVouchers.length > 0) {
      setEditVoucher(true); // Show the modal when there are selected vouchers
    } else {
      console.log("No vouchers selected for update.");
      setShopEdit(true);
      setTimeout(() => {
        setShopEdit(false);
      }, 3000);
    }
  };

  const handleSave = async () => {
    if (!selectedShopId || selectedVouchers.length === 0) {
      console.error("No shop selected or no vouchers selected for update.");
      return;
    }

    try {
      const { data: existingVouchers, error: fetchError } = await supabase
        .from("merchant_Vouchers")
        .select("id, voucher_name, condition, discount, merchant_Id")
        .eq("merchant_Id", selectedShopId);

      if (fetchError) {
        console.error("Error fetching existing vouchers:", fetchError);
        return;
      }

      // Update only the selected vouchers
      const updatedVouchers = selectedVouchers.map((selectedVoucher) => {
        const existingVoucher = existingVouchers.find(
          (v) => v.id === selectedVoucher.id
        );

        return existingVoucher
          ? { ...existingVoucher, ...selectedVoucher }
          : { ...selectedVoucher, merchant_Id: selectedShopId };
      });

      const { error: upsertError } = await supabase
        .from("merchant_Vouchers")
        .upsert(updatedVouchers, { onConflict: ["id"] });

      if (upsertError) {
        console.error("Error updating vouchers:", upsertError);
      } else {
        console.log("Selected vouchers updated successfully!");
        fetchVouchers();
        setEditVoucher(false);
        setShowAlertUpdated(true);
        setTimeout(() => {
          setShowAlertUpdated(false);
        }, 3000);
        setSelectedVouchers([]);
      }
    } catch (error) {
      console.error("Unexpected error during voucher update:", error);
    }
  };
  const handleDeacVoucherConfirmations = () => {
    if (selectedVouchers.length > 0) {
      setDeacVoucher(true);
    } else {
      console.log("No vouchers selected for deletion.");
      setShowNoSelDeacVocuher(true);
      setTimeout(() => {
        setShowNoSelDeacVocuher(false);
      }, 3000);
    }
  };
  const handleAcVoucherConfirmations = () => {
    if (selectedVouchers.length > 0) {
      setAcVoucher(true);
    } else {
      console.log("No vouchers selected for deletion.");
      setShowNoSelAcVocuher(true);
      setTimeout(() => {
        setShowNoSelAcVocuher(false);
      }, 3000);
    }
  };
  const handleDelVoucherConfirmations = () => {
    if (selectedVouchers.length > 0) {
      setDelVoucher(true);
    } else {
      console.log("No vouchers selected for deletion.");
      setShowNoSelDelVocuher(true);
      setTimeout(() => {
        setShowNoSelDelVocuher(false);
      }, 3000);
    }
  };

  const handleLabelChange = (index, field, newValue) => {
    const updatedVouchers = [...selectedVouchers];
    updatedVouchers[index] = { ...updatedVouchers[index], [field]: newValue };
    setSelectedVouchers(updatedVouchers);
  };

  const closeModal = () => {
    setSelectedVouchers([]);
    setShowModal(false);
    setDelVoucher(false);
    setEditVoucher(false);
    setDeacVoucher(false);
    setAcVoucher(false);
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
    <div className="h-full w-full overflow-y-scroll px-1 md:px-16 bg-slate-300 custom-scrollbar ">
      <div className="absolute mx-3 right-0 z-10">
        <SideBar />
      </div>
      <div className="w-full h-full bg-slate-100 p-5 relative">
        <div className="text-custom-purple place-self-start font-bold px-2 md:px-0 text-xl sm:text-2xl md:text-3xl">
          SHOP VOUCHERS
        </div>
        <div className=" w-full h-auto mt-2 md:flex gap-5">
          <div className="w-full md:w-1/4 mt-5 md:mt-0 h-auto md:h-[550px] ">
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
                  className="bg-slate-50 rounded-md  text-slate-800 text-sm p-1 w-40   border-[1px] border-custom-purple"
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
                  className="bg-slate-50 rounded-md text-slate-800 text-sm p-1 w-40   border-[1px] border-custom-purple"
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
                  className="bg-slate-50 rounded-md text-slate-800 text-sm p-1 w-40  border-[1px] border-custom-purple"
                ></input>
              </div>
              <div className="mb-2 gap-2 flex place-items-center">
                <label className="text-slate-800 font-semibold text-sm">
                  Expiry Date:
                </label>
                <input
                  onChange={(e) => setExpiryDate(e.target.value)}
                  value={expiryDate}
                  type="date"
                  className="bg-slate-50 rounded-md text-slate-800 text-sm p-1 w-40 border-[1px] border-custom-purple"
                />
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
            {/* Functions manipulate data */}
            <div className=" mt-2 h-[370px] relative">
              <div className="">
                <button
                  onClick={handleAcVoucherConfirmations}
                  className="font-semibold text-slate-800 flex justify-between w-full hover:bg-slate-300 duration-200 rounded-md p-1"
                >
                  Activate voucher{" "}
                  <box-icon
                    type="solid"
                    name="coupon"
                    color="#22C55E"
                  ></box-icon>{" "}
                </button>
              </div>
              <div>
                <button
                  onClick={handleDeacVoucherConfirmations}
                  className="font-semibold text-slate-800 flex justify-between w-full hover:bg-slate-300 duration-200 rounded-md p-1"
                >
                  Deactivate voucher{" "}
                  <box-icon
                    type="solid"
                    name="coupon"
                    color="#F87171"
                  ></box-icon>{" "}
                </button>
              </div>
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
                  onClick={handleEditVoucherConfirmations}
                  className="font-semibold text-slate-800 flex justify-between w-full hover:bg-slate-300 duration-200 rounded-md p-1"
                >
                  Edit Voucher{" "}
                  <box-icon
                    type="solid"
                    name="edit-alt"
                    color="#FAB12F"
                  ></box-icon>{" "}
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
                    name="trash"
                    color="#FAB12F"
                  ></box-icon>{" "}
                </button>
              </div>
              <div className=" w-full bottom-10 ">
                <div className="w-full flex justify-between">
                  <button
                    onClick={() => navigate("/shop/MerchantDashboard")}
                    className="font-semibold text-slate-800 flex justify-between w-full hover:bg-slate-300 duration-200 rounded-md p-1"
                  >
                    Go back to Dashboard{" "}
                    <box-icon
                      type="solid"
                      color="#FAB12F"
                      name="dashboard"
                    ></box-icon>{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full -mt-36 md:mt-0  md:w-3/4 h-[550px] rounded-md bg-slate-200  shadow-inner shadow-slate-500 overflow-scroll">
            <div className="w-auto grid md:grid-cols-2 relative place-items-center gap-3 p-3">
              {vouchers.length > 0 ? (
                vouchers.map((voucher) => (
                  <div
                    key={voucher.id}
                    className={`h-16 w-full cursor-pointer border-t-2 shadow-sm relative bg-slate-800 hover:scale-95 duration-300 mt-1 flex place-items-center rounded-md
                    ${
                      voucher.isDeactivate
                        ? "border-red-500  shadow-red-500"
                        : "border-primary-color shadow-primary-color"
                    }`}
                    onClick={() => handleCheckboxChange(voucher)}
                  >
                    <div className="h-full w-full rounded-md relative overflow-hidden bg-slate-100 p-1 px-2">
                      <div
                        className="bg-slate-400 md:h-5 md:w-5 h-3 w-3 rounded-full absolute right-5 translate-y-1/2 flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedVouchers.some(
                            (v) => v.id === voucher.id
                          )}
                          className="checkbox rounded-full"
                          onChange={() => handleCheckboxChange(voucher)}
                        />
                      </div>
                      <div className="flex gap-1">
                        <div>
                          <p className="font-bold iceland-regular absolute text-green-700  opacity-25  text-7xl left-40 -top-2 z-0 drop-shadow-customViolet">
                            {" "}
                            {shopData.shop_name}{" "}
                          </p>
                        </div>

                        <div className="w-2/5">
                          <div className="w-full overflow-hidden">
                            <span className="text-slate-800 iceland-regular font-semibold text-2xl truncate block">
                              {voucher.voucher_name}
                            </span>
                          </div>
                          <div className="w-full overflow-hidden">
                            <span className="text-slate-600 iceland-regular truncate block">
                              Exp: {voucher.expiration}
                            </span>
                          </div>
                        </div>

                        <div className="text-right ">
                        <div className="w-full overflow-hidden">
                            <p className="text-slate-800  iceland-regular  truncate block ">
                              Minimum spend of
                              <span className="text-slate-800 font-semibold">
                                {" "}
                                ₱
                                {Number(voucher.condition).toLocaleString(
                                  "en-PH",
                                  {
                                    minimumFractionDigits: 2,
                                  }
                                )}
                              </span>
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-800 font-medium text-sm md:text-lg">
                              <span className="text-slate-800 iceland-regular font-semibold text-2xl">
                                {" "}
                                ₱
                                {Number(voucher.discount).toLocaleString(
                                  "en-PH",
                                  {
                                    minimumFractionDigits: 2,
                                  }
                                )}{" "}
                                OFF
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className=" top-28 justify-center absolute">
                  <div className="w-fill h-full justify-items-center content-center">
                    <div className="mt-10">
                      <img
                        src={hmmmEmote}
                        alt="Success Emote"
                        className="object-contain rounded-lg p-1 drop-shadow-customViolet"
                      />
                    </div>
                    <div className="-ml-7 ">
                      {" "}
                      <h1 className="text-2xl text-custom-purple iceland-regular font-extrabold">
                        No Vouchers Yet.
                      </h1>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* MODALS CONFIRMATIONS */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-md shadow-md w-[90%] md:w-[50%] max-h-[80vh] overflow-auto">
            <h2 className="text-xl font-bold mb-4 text-slate-800">
              Gift to Followers
            </h2>

            {/* Display Selected Vouchers */}
            <ul className="mb-4">
              {selectedVouchers.length > 0 ? (
                selectedVouchers.map((voucher, index) => (
                  <li
                    key={voucher.id || index}
                    className="mb-2 text-custom-purple"
                  >
                    <span className="text-violet-600 font-semibold">
                      "{voucher.voucher_name}"
                    </span>{" "}
                    {Number(voucher.discount).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                    % OFF - Minimum Spend: ₱
                    {Number(voucher.condition).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </li>
                ))
              ) : (
                <li>No vouchers selected.</li>
              )}
            </ul>

            {/* Sorting and Select All */}
            <div className="flex justify-between items-center mb-3">
              <button
                onClick={toggleSortOrder}
                className="text-sm bg-gray-200 text-black px-3 py-1 rounded-md"
              >
                Sort:{" "}
                {sortOrder === "newest" ? "Newest → Oldest" : "Oldest → Newest"}
              </button>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={
                    selectedFollowers.length === followerDetails.length &&
                    followerDetails.length > 0
                  }
                  onChange={toggleSelectAll}
                />
                <span className="text-gray-700 text-sm font-medium">
                  Select All
                </span>
              </div>
            </div>

            {/* Display Followers with Checkboxes */}
            <div className="border-t border-gray-300 pt-3">
              {sortedFollowers.length > 0 ? (
                <ul className="max-h-[300px] overflow-y-auto">
                  {sortedFollowers.map((follower) => (
                    <li
                      key={follower.id}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
                    >
                      <input
                        type="checkbox"
                        className="h-5 w-5"
                        checked={selectedFollowers.some(
                          (f) => f.id === follower.id
                        )}
                        onChange={() => toggleFollowerSelection(follower)}
                      />

                      <img
                        src={follower.profile?.profile_picture || successEmote}
                        alt={follower.profile?.full_name || "Follower"}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="text-gray-800 font-medium">
                        {follower.profile?.full_name || "Unknown User"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No followers found.</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex w-full justify-between mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2  text-sm text-slate-900 rounded hover:bg-gray-400 "
              >
                Cancel
              </button>
              <button
                onClick={handleSendToFollowersGift}
                className="bg-blue-500  text-sm text-slate-900 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={selectedFollowers.length === 0}
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
          <div className="bg-white overflow-hidden h-80 overflow-y-scroll relative custom-scrollbar p-5 rounded-md shadow-md w-[400px]">
            <h2 className="text-xl text-center font-bold mb-4 text-slate-800">
              Edit Vouchers
            </h2>
            <ul>
              {selectedVouchers.length > 0 ? (
                selectedVouchers.map((voucher, index) => (
                  <li
                    key={voucher.id || index}
                    className="mb-4 bg-violet-500 glass p-2 rounded-md shadow-md"
                  >
                    <label className="block text-sm font-semibold text-slate-800 mb-1">
                      Voucher Label
                    </label>
                    <input
                      type="text"
                      value={voucher.voucher_name}
                      onChange={(e) =>
                        handleLabelChange(index, "voucher_name", e.target.value)
                      }
                      className="w-full p-2 border bg-slate-100 rounded-md text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-600"
                    />
                    <p className="text-custom-purple text-sm mt-1">
                      Total Off:
                      <input
                        onKeyDown={blockInvalidChar}
                        type="number"
                        value={voucher.discount}
                        onChange={(e) =>
                          handleLabelChange(
                            index,
                            "discount",
                            Number(e.target.value)
                          )
                        }
                        className="w-full p-2 border bg-slate-100 rounded-md text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-600"
                      />
                      Minimum Spend:
                      <input
                        onKeyDown={blockInvalidChar}
                        type="number"
                        value={voucher.condition}
                        onChange={(e) =>
                          handleLabelChange(
                            index,
                            "condition",
                            Number(e.target.value)
                          )
                        }
                        className="w-full p-2 border bg-slate-100 rounded-md text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-600"
                      />
                    </p>
                  </li>
                ))
              ) : (
                <li className="text-center">No vouchers selected.</li>
              )}
            </ul>
            <div className="flex w-full  bg-white -bottom-5 sticky justify-between">
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2  text-sm text-slate-900 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500  text-sm text-slate-900 px-4 py-2 rounded hover:bg-blue-700"
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
            <h2 className="text-xl text-center font-bold mb-4 text-slate-800">
              Delete this Vouchers
            </h2>
            <ul>
              {selectedVouchers.length > 0 ? (
                selectedVouchers.map((voucher, index) => (
                  <li
                    key={voucher.id || index}
                    className="mb-2 text-custom-purple"
                  >
                    <span className="text-violet-600 font-semibold ">
                      "{voucher.voucher_name}"
                    </span>{" "}
                    {Number(voucher.discount).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                    % OFF - Minimum Spend: ₱
                    {Number(voucher.condition).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </li>
                ))
              ) : (
                <li>No vouchers selected.</li>
              )}
            </ul>
            <div className="flex w-full gap-2 justify-between">
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2  text-sm text-slate-900 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteVouchers}
                className="bg-blue-500  text-sm text-slate-900 px-4 py-2 rounded hover:bg-blue-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {deacVoucher && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-md shadow-md">
            <h2 className="text-xl text-center font-bold mb-4 text-slate-800">
              Deactivate this Vouchers ?
            </h2>
            <ul>
              {selectedVouchers.length > 0 ? (
                selectedVouchers.map((voucher, index) => (
                  <li
                    key={voucher.id || index}
                    className="mb-2 text-custom-purple"
                  >
                    <span className="text-violet-600 font-semibold ">
                      "{voucher.voucher_name}"
                    </span>{" "}
                    {Number(voucher.discount).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                    % OFF - Minimum Spend: ₱
                    {Number(voucher.condition).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </li>
                ))
              ) : (
                <li>No vouchers selected.</li>
              )}
            </ul>
            <div className="flex w-full gap-2 justify-between">
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2  text-sm text-slate-900 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeacVouchers}
                className="bg-blue-500  text-sm text-slate-900 px-4 py-2 rounded hover:bg-blue-700"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
      {acVoucher && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-md shadow-md">
            <h2 className="text-xl text-center font-bold mb-4 text-slate-800">
              Activate this Vouchers ?
            </h2>
            <ul>
              {selectedVouchers.length > 0 ? (
                selectedVouchers.map((voucher, index) => (
                  <li
                    key={voucher.id || index}
                    className="mb-2 text-custom-purple"
                  >
                    <span className="text-violet-600 font-semibold ">
                      "{voucher.voucher_name}"
                    </span>{" "}
                    {Number(voucher.discount).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                    % OFF - Minimum Spend: ₱
                    {Number(voucher.condition).toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </li>
                ))
              ) : (
                <li>No vouchers selected.</li>
              )}
            </ul>
            <div className="flex w-full gap-2 justify-between">
              <button
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2  text-sm text-slate-900 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAcVouchers}
                className="bg-blue-500  text-sm text-slate-900 px-4 py-2 rounded hover:bg-blue-700"
              >
                Activate
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ALLERTS ADD VOUCHERS */}
      {showAlert && (
        <div className="md:bottom-5 lg:bottom-10 z-10 justify-end md:right-5 lg:right-10 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 left-28 -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={successEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert alert-success shadow-md flex items-center p-4 bg-custom-purple text-slate-50 font-semibold rounded-md"
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
            <span>Voucher gifted successfully!</span>
          </div>
        </div>
      )}
      {/* ALLERTS EMPTY FIELDS */}
      {showAlertNull && (
        <div className="md:bottom-5 lg:bottom-10 z-10 justify-end md:right-5 lg:right-10 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-52 left-28 -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={questionEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert z-20 alert-success shadow-md flex items-center p-4 bg-custom-purple text-slate-50 font-semibold rounded-md"
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
      {/* ALLERTS SENT VOUCHERS */}
      {showAlertSent && (
        <div className="md:bottom-5 lg:bottom-10 z-10 justify-end md:right-5 lg:right-10 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 left-28 -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={successEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert alert-success shadow-md flex items-center p-4 bg-custom-purple text-slate-50 font-semibold rounded-md"
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
            <span>Voucher Sent to Followers.</span>
          </div>
        </div>
      )}
      {showAlertSentNosel && (
        <div className="md:bottom-5 lg:bottom-10 z-10 justify-end md:right-5 lg:right-10 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 left-28 -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={questionEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert alert-success shadow-md flex items-center p-4 bg-custom-purple text-slate-50 font-semibold rounded-md"
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
            <span>Select voucher to be sent.</span>
          </div>
        </div>
      )}
      {/* ALLERTS UPDATED FIELDS */}
      {showAlertUpdated && (
        <div className="md:bottom-5 lg:bottom-10 z-10 justify-end md:right-5 lg:right-10 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 left-28 -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={successEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert alert-success shadow-md flex items-center p-4 bg-custom-purple text-slate-50 font-semibold rounded-md"
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
            <span>Selected Voucher Updated!</span>
          </div>
        </div>
      )}
      {/* ALLERTS DELETE VOUCHERS */}
      {showAlertDel && (
        <div className="md:bottom-5 lg:bottom-10 z-10 justify-end md:right-5 lg:right-10 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 left-28 -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={successEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert alert-success shadow-md flex items-center p-4 bg-custom-purple text-slate-50 font-semibold rounded-md"
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
            <span>Selected Voucher Deleted!</span>
          </div>
        </div>
      )}
      {/* ALLERTS DEACTIVATE VOUCHERS */}
      {showAlertDeac && (
        <div className="md:bottom-5 lg:bottom-10 z-10 justify-end md:right-5 lg:right-10 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 left-28 -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={successEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert alert-success shadow-md flex items-center p-4 bg-custom-purple text-slate-50 font-semibold rounded-md"
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
            <span>Selected Voucher Deactivated!</span>
          </div>
        </div>
      )}
      {/* ALLERTS ACTIVATE VOUCHERS */}
      {showAlertAc && (
        <div className="md:bottom-5 lg:bottom-10 z-10 justify-end md:right-5 lg:right-10 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 left-28 -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={successEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert alert-success shadow-md flex items-center p-4 bg-custom-purple text-slate-50 font-semibold rounded-md"
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
            <span>Selected Voucher Activated!</span>
          </div>
        </div>
      )}
      {/* ALLERTS DELETE VOUCHERS */}
      {showNoSelectedDeacVoucher && (
        <div className="md:bottom-5 lg:bottom-10 z-10 justify-end md:right-5 lg:right-10 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-52 right-10 -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={questionEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert bg-custom-purple shadow-md flex items-center p-4 text-slate-50 font-semibold rounded-md"
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
            <span>Select a Voucher to be Deactivated</span>
          </div>
        </div>
      )}
      {showNoSelectedAcVoucher && (
        <div className="md:bottom-5 lg:bottom-10 z-10 justify-end md:right-5 lg:right-10 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-52 right-10 -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={questionEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert bg-custom-purple shadow-md flex items-center p-4 text-slate-50 font-semibold rounded-md"
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
            <span>Select a Voucher to be Activated</span>
          </div>
        </div>
      )}
      {showNoSelectedVoucher && (
        <div className="md:bottom-5 lg:bottom-10 z-10 justify-end md:right-5 lg:right-10 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-52 left-28 -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={questionEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert bg-custom-purple shadow-md flex items-center p-4 text-slate-50 font-semibold rounded-md"
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
      {/* ALLERTS UPDATE VOUCHERS */}
      {showNoSelectedeEditVoucher && (
        <div className="md:bottom-5 lg:bottom-10 z-10 justify-end md:right-5 lg:right-10 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-52 left-28 -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={questionEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="bg-custom-purple alert shadow-md flex items-center p-4 text-slate-50 font-semibold rounded-md"
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
            <span> Select a Voucher to be Edited</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vouchers;
