import React from "react";
import SideBar from "../Component/Sidebars";
import "../Component/Style.css";
import logo from "../../../assets/shop/logoBlack.png";
import { supabase } from "../../../constants/supabase";
import "boxicons";
import { blockInvalidChar } from "../Hooks/ValidNumberInput";
const { useState, useEffect } = React;
function MerchantWallet() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shopData, setShopData] = useState([]);
  const [showForm, setShowForm] = useState(false); 

  const [formData, setFormData] = useState({
    fullName: "",
    bankName: "",
    accountNumber: "",
    govID: null,
    profilePhoto: null,
  });

  const fetchUserProfileAndShop = async () => {
    setLoading(true);

    try {
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
          .select(
            "shop_name, id, address, description, contact_number, shop_image, shop_BusinessPermit, has_Wallet"
          )
          .eq("owner_Id", user.id);

        if (shopError) {
          throw shopError;
        }
setShopData(shops);
      } else {
        console.log("No user is signed in.");
        setError("No user is signed in.");
      }
    } catch (error) {
      console.error("Error fetching user/shop data:", error.message);
      setError("An error occurred while fetching user/shop data.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserProfileAndShop();
  }, []); // Run once on mount

  // Simulate wallet creation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shopData || !shopData.id) {
      setError("Shop data is missing. Please refresh the page and try again.");
      return;
    }
  
    setLoading(true);
  
    try {
      let walletID;
      let isUnique = false;

      while (!isUnique) {
        walletID = Math.floor(100000000 + Math.random() * 900000000);
  
        const { data: existingWallet } = await supabase
          .from("merchant_Wallet")
          .select("id")
          .eq("id", walletID);
  
        if (!existingWallet || existingWallet.length === 0) {
          isUnique = true;
        }
      }
      // Upload files 
      // to Supabase storage
      const uploadFile = async (file, path) => {
        const { data, error } = await supabase.storage
          .from("wallet_docs") 
          .upload(`${path}/${file.name}`, file);
  
        if (error) throw error;
        return data.path;
      };
  
      const govIDPath = formData.govID
        ? await uploadFile(formData.govID, "gov_ids")
        : null;
      const profilePhotoPath = formData.profilePhoto
        ? await uploadFile(formData.profilePhoto, "profile_photos")
        : null;
  
      // Step 1: Update shop table
      const { error: shopError } = await supabase
        .from("shop")
        .update({
          has_Wallet: true,
        })
        .eq("id", shopData.id);
  
      if (shopError) throw shopError;
  
      // Step 2: Insert into merchant_Wallet table
      const { error: walletError } = await supabase
        .from("merchant_Wallet")
        .insert([
          {
            id: walletID,
            merchant_Id: shopData.id, 
            E_wallet: formData.bankName, 
            number: formData.accountNumber,
            owner_Name: formData.fullName,
            valid_ID: govIDPath,
            owner_Photo: profilePhotoPath,
            revenue: "0", 
          },
        ]);
  
      if (walletError) throw walletError;
  
      // Refresh data
      fetchUserProfileAndShop();
      setShowForm(false); // Hide form after submission
    } catch (err) {
      console.error("Error creating wallet:", err.message);
      setError("Failed to create wallet.");
    } finally {
      setLoading(false);
    }
  };
  


  return (
    <div className="h-full w-full bg-slate-300 md:px-20 p-2 ">
      <div className="absolute mx-3 right-0 z-20">
        <SideBar />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : shopData?.has_Wallet ? (
        // Show Wallet
        <div className="h-full w-full">
          <div className="text-2xl flex font-semibold place-items-center justify-between">
            <label className="text-3xl text-custom-purple font-bold">YOUR WALLET</label>
          </div>
          <div className="bg-gradient-to-r relative mt-2 from-violet-600 to-indigo-600 h-[200px] w-[350px] shadow-lg shadow-slate-700 rounded-xl p-5 flex flex-col justify-between text-white">
            {/* Wallet Icon and Name */}
            <div className="absolute bottom-2 right-2">
              <img src={"/path-to-logo.png"} className="h-20 w-20 blur-sm" />
            </div>
            <div className="flex justify-between items-center">
            <box-icon type='solid' name='wallet'></box-icon>
              <span className="text-lg font-semibold">Dripstr Wallet</span>
            </div>

            {/* Balance */}
            <div>
              <p className="text-sm">Your Balance</p>
              <p className="text-2xl font-bold">₱5,250.75</p>
            </div>

            {/* Card Number */}
            <div className="text-sm tracking-widest opacity-80">**** **** **** 1234</div>
          </div>
        </div>
      ) : showForm ? (
        // Show Wallet Creation Form
        <div className="bg-white shadow-md shadow-slate-400 p-6 rounded-md w-full max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-center text-custom-purple ">Enter E-Wallet Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="w-full p-2 border bg-slate-300 rounded-sm text-slate-800"
              required
            />
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              placeholder="Bank Name"
              className="w-full p-2 border bg-slate-300 rounded-sm text-slate-800"
              required
            />
            <input
              type="number"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleInputChange}
              onKeyDown={blockInvalidChar}
              placeholder="Account Number"
              className="w-full p-2 border bg-slate-300 rounded-sm text-slate-800"
              required
            />
            <label className="block text-slate-800">
              Government ID:
              <input type="file" name="govID" onChange={handleFileChange} className="w-full p-2 border rounded" required />
            </label>
            <label className="block text-slate-800">
              Photo of the Holder:
              <input type="file" name="profilePhoto" onChange={handleFileChange} className="w-full p-2 border rounded" required />
            </label>
            <button
              type="submit"
              className="w-full bg-custom-purple glass text-white font-bold text-white py-2 rounded hover:bg-primary-color transition"
            >
              Submit
            </button>
          </form>
        </div>
      ) : (
        // Show "Create Wallet" Button
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-xl font-bold text-gray-700">Create Your Wallet</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 bg-custom-purple glass text-white font-bold px-6 py-2 rounded-md shadow-md hover:bg-indigo-700 transition"
          >
            Create Wallet
          </button>
        </div>
      )}

    </div>
  );
}

export default MerchantWallet;
