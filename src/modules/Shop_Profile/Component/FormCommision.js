import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import logo from "../../../assets/logoBlack.png";
import logoName from "../../../assets/logoName.png";
import DateTime from "../Hooks/DateTime";
import successEmote from "../../../../src/assets/emote/success.png";
import { supabase } from "../../../constants/supabase";
import hmmmEmote from "../../../../src/assets/emote/hmmm.png";
import sadEmote from "../../../../src/assets/emote/error.png";

function FormCommision() {
  const [records, setRecords] = useState([]);
  const [sData, setSdata] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModalComplete, setShowModalComplete] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [selectedRecordName, setSelectedRecordName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [ownerId, setOwnerId] = useState(null);
  const [shopId, setShopId] = useState(null);
 
  
  useEffect(() => {
    const fetchUserProfileAndShop = async () => {
      try {
        // Get current authenticated user
        const { data: userData, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error("Auth Error:", authError.message);
          return;
        }
  
        const user = userData?.user;
        if (!user) {
          console.error("No user is signed in.");
          return;
        }
  
        // Fetch the shop owned by the current user
        const { data: shops, error: shopError } = await supabase
          .from("shop")
          .select("id, owner_Id")
          .eq("owner_Id", user.id);
  
        if (shopError) throw shopError;
  
        if (shops.length > 0) {
          const shop = shops[0]; 
          setSdata(shop); 
          setOwnerId(shop.owner_Id); 
          setShopId(shop.id); 
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };
  
    fetchUserProfileAndShop();
  }, []);
  
  useEffect(() => {
    if (sData?.id) {
      fetchMerchantCommissions(sData.owner_Id, sData.id);
    }
  }, [sData]); 
  
  const fetchMerchantCommissions = async (ownerId, shopId) => {
    if (!ownerId || !shopId) {
      console.error("fetchMerchantCommissions: Missing ownerId or shopId.");
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Fetch the shop owner's LVM
      const { data: shopData, error: shopError } = await supabase
        .from("shop")
        .select("lvm")
        .eq("id", shopId)
        .single();
  
      if (shopError) {
        console.error("Error fetching shop LVM:", shopError);
        return;
      }
  
      const shopLvm = shopData?.lvm;
      if (!shopLvm) {
        console.warn("No LVM found for shop.");
        return;
      }
  
      const { data: clientProfiles, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name") 
        .neq("id", ownerId); 
  
      if (profileError) {
        console.error("Error fetching client profiles:", profileError);
        return;
      }
      const clientIds = clientProfiles.map((profile) => profile.id);
  
      // Fetch client addresses where `is_default_shipping = true`
      const { data: addressData, error: addressError } = await supabase
        .from("addresses")
        .select("user_id, lvm")
        .eq("is_default_shipping", true)
        .in("user_id", clientIds); 
  
      if (addressError) {
        console.error("Error fetching client addresses:", addressError);
        return;
      }
  
      const clientLvmMap = addressData.reduce((acc, address) => {
        acc[address.user_id] = address.lvm;
        return acc;
      }, {});
  
      // Fetch all merchant commissions where `status = Confirmed`
      const { data: commissions, error: commissionError } = await supabase
        .from("merchant_Commission")
        .select("id, client_Id, image, fullName, pricing, status, description")
        .eq("status", "Confirmed")
        .in("client_Id", clientIds); 
  
      if (commissionError) {
        console.error("Error fetching merchant commissions:", commissionError);
        return;
      }
  
      const filteredCommissions = commissions.filter((record) => {
        return clientLvmMap[record.client_Id] === shopLvm;
      });
  
      setRecords(filteredCommissions);
    } catch (error) {
      console.error("Unexpected error:", error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const closeBtn = () => { 
    setShowModalComplete(false);
    setIsModalOpenAlreadyTaken(false);
    setIsModalOpentaken(false);
    fetchMerchantCommissions(sData.owner_Id, sData.id);
  }
  
  
  const [showAlertAlreadyTaken, setIsModalOpenAlreadyTaken] = useState(false); 
  const [showAlertTaken, setIsModalOpentaken] = useState(false); 
  const handleAccept = async () => {
    if (!selectedRecordId) return;
  
    const { data: existingRecord, error: fetchError } = await supabase
      .from("merchant_Commission")
      .select("merchantId")
      .eq("id", selectedRecordId)
      .single();
  
    if (fetchError) {
      console.error("Error fetching record:", fetchError);
      return;
    }
  
    // check if there's a id of merchant
    if (existingRecord?.merchantId) {
      setIsModalOpenAlreadyTaken(true)
      return;
    }
  
    // Proceed with updating the status
    const { error } = await supabase
      .from("merchant_Commission")
      .update({ status: "To prepare", merchantId: shopId })
      .eq("id", selectedRecordId);
  
    if (error) {
      console.error("Error updating record:", error);
      return;
    }
  
    setShowModalComplete(false);
    setIsModalOpentaken(true);
    if (!ownerId || !shopId) {
      console.error("Error: Missing ownerId or shopId in handleAccept.");
      return;
    }
  
    fetchMerchantCommissions(ownerId, shopId);
  };
  



  return (
    <div>
      <div className="overflow-x-auto rounded-md border border-base-content/5 bg-base-200">
        <table className="table h-auto w-full bg-slate-200">
          {/* head */}
          <thead className="w-full bg-custom-purple glass">
            <tr className="text-sm text-center ">
              <th></th>
              <th className="text-white">Name</th>
              <th className="text-white">Image</th>
              <th className="text-white">Description</th>
              <th className="text-white">Pricing</th>
              <th className="text-white">Action</th>
            </tr>
          </thead>
          {isLoading ? (
            <tbody>
              <tr>
                <td colSpan="7" className="text-center py-10">
                 <span className="loading loading-dots loading-lg"></span>
                  <p className="text-slate-800 mt-3">Loading commissions...</p>
                </td>
              </tr>
            </tbody>
          ) : records.length > 0 ? (
            <tbody className="bg-slate-100 text-center text-black">
              {records.map((record, index) => (
                <tr key={record.id} className="text-center">
                  <th>{index + 1}</th>
                  <td>{record.fullName}</td>
                  <td className="justify-center flex">
                    <img
                      src={record.image || successEmote}
                      onClick={() => setSelectedImage(record.image)}
                      className="shadow-md shadow-slate-400 cursor-pointer bg-slate-100 h-12 w-12 object-cover rounded-md"
                      sizes="100%"
                      alt="Merchant"
                    />
                  </td>
                  <td className="whitespace-pre-line break-words max-w-[200px]">
                    {record.description}
                  </td>
                  <td>{record.pricing}</td>
                  <td>
                    <button
                      onClick={() => {
                        setShowModalComplete(true);
                        setSelectedRecordId(record.id);
                        setSelectedRecordName(record.fullName);
                      }}
                      className="bg-blue-500 text-sm text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      Accept
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan="7" className="text-center py-10">
                  <img
                    src={hmmmEmote}
                    className="h-20 mx-auto"
                    alt="No Orders"
                  />
                  <div className="text-slate-800">
                    No commissions orders yet.
                  </div>
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>


      {showAlertAlreadyTaken && (
        <div className="fixed  inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white relative p-6 rounded-lg shadow-lg w-1/3">
            <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1.5 rounded-t-md">
              {" "}
            </div>
            <div className="mt-2 justify-center flex ">
              <img
                src={sadEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
            <h3 className="text-lg text-center font-semibold text-slate-900 mb-4">
              Order commission already taken
            </h3>

            <div className="flex justify-center gap-4">
              <button
               onClick={closeBtn}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
       {showAlertTaken && (
        <div className="fixed  inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white relative p-6 rounded-lg shadow-lg w-1/3">
            <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1.5 rounded-t-md">
              {" "}
            </div>
            <div className="mt-2 justify-center flex ">
              <img
                src={successEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
            <h3 className="text-lg text-center font-semibold text-slate-900 mb-4">
              Order commission taken
            </h3>

            <div className="flex justify-center gap-4">
              <button
               onClick={closeBtn}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Image to view  */}
      {selectedImage && (
        <div className="fixed top-0 left-0 z-30 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-md shadow-lg relative">
            <button
              className="absolute top-1.5 right-1.5 text-xl text-gray-800 rounded-md px-1.5 bg-slate-50"
              onClick={() => setSelectedImage(null)}
            >
              ✖
            </button>
            <img
              src={selectedImage}
              className="max-w-[90vw] max-h-[90vh] rounded-md"
              alt="Selected Merchant"
            />
          </div>
        </div>
      )}
      {showModalComplete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">
              Are you sure you want to accept{" "}
              <span className="font-bold text-primary-color">
                {selectedRecordName}
              </span>
              ?
            </h2>
            <div className="flex w-full justify-between">
              <button
                onClick={() => setShowModalComplete(false)}
                className="mt-4 p-2 px-4 bg-gray-500 hover:bg-gray-700 duration-300 text-sm text-white py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAccept}
                className="mt-4 p-2 px-4 hover:bg-blue-700 text-sm duration-300 bg-blue-500 text-white rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FormCommision;
