import React from "react";
import SideBar from "../Component/Sidebars";
import "../Component/Style.css";
import logo from "../../../assets/shop/logoBlack.png";
import { supabase } from "../../../constants/supabase";
import "boxicons";
import { blockInvalidChar } from "../Hooks/ValidNumberInput";
import questionEmote from "../../../../src/assets/emote/question.png";
import successEmote from "../../../../src/assets/emote/success.png";
import sadEmote from "../../../../src/assets/emote/error.png";
import hmmEmote from "../../../../src/assets/emote/hmmm.png";
const { useState, useEffect } = React;
function MerchantWallet() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shopData, setShopData] = useState([]);
  const [walletData, setWalletData] = useState(null);
  const [activeTab, setActiveTab] = useState("history");
  const [modalOpen, setModalOpen] = useState(false);

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
            "shop_name, id, address, description, contact_number, shop_image, shop_BusinessPermit"
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

  useEffect(() => {
    const fetchWalletData = async () => {
      setLoading(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.error("Error fetching user:", authError?.message);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("merchant_Wallet")
        .select("revenue, owner_Name, owner_ID, number, valid_ID")
        .eq("owner_ID", user.id)
        .single();

      if (error) {
        console.error("Error fetching wallet:", error.message);
        setLoading(false);
        return;
      }

      setWalletData(data);
      setLoading(false);
    };

    fetchWalletData();
  }, []);

  //cashout magkakasama variable ko hiwalay ko muna
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpenCO, setIsModalOpenCO] = useState(false); //CASHOUT CONFIRMATION
  const [showAlertBL, setIsModalOpenBL] = useState(false); //CASHOUT CONFIRMATION
  const [showAlertSend, setIsModalOpenSend] = useState(false); //CASHOUT CONFIRMATION
  const [showAlertMin, setIsModalOpenMin] = useState(false); //CASHOUT CONFIRMATION
  const handleSubmitCashout = async () => {
    if (!amount || !reason) {
      setMessage("Please enter both amount and reason.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("merchant_Cashout").insert([
      {
        full_Name: walletData.owner_Name,
        owner_Id: walletData.owner_ID,
        qty: amount,
        reason: reason,
        status: "Pending",
      },
    ]);

    if (error) {
      setMessage("Error submitting request. Try again.");
    } else {
      setAmount("");
      setReason("");
      setIsModalOpenSend(true);
      setTimeout(() => setIsModalOpenSend(false), 3000);
      setIsModalOpenCO(false);
      fetchTransactions();
    }
    setLoading(false);
  };
  const handleSubmitCashoutcONF = async () => {
    if (!amount || !reason) {
      setMessage("Please enter both amount and reason.");
      return;
    }

    if (!walletData) {
      setMessage("Wallet data not available.");
      return;
    }
    if (parseFloat(amount) < 100) {
      setIsModalOpenMin(true);
      setTimeout(() => setIsModalOpenMin(false), 3000);
      return;
    }
    if (parseFloat(amount) > parseFloat(walletData.revenue)) {
      setIsModalOpenBL(true);
      setTimeout(() => setIsModalOpenBL(false), 3000);
      return;
    }
    setIsModalOpenCO(true); // Open confirmation modal before submitting
  };

  //transaction history
  const [transactions, setTransactions] = useState([]);
  const fetchTransactions = async () => {
    setLoading(true);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Error fetching user:", authError?.message);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("merchant_Cashout")
      .select("id, created_at, qty, reason, status")
      .eq("owner_Id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching transactions:", error.message);
      setLoading(false);
      return;
    }

    setTransactions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const [inquiryText, setInquiryText] = useState("");
  return (
    <div className="h-full w-full bg-slate-300 md:px-20 p-2 ">
      <div className="absolute mx-3 right-0 z-20">
        <SideBar />
      </div>
      <div className="text-3xl text-custom-purple font-bold py-4">
        <h1>Your Merchant Wallet</h1>
      </div>
      <div className="flex gap-2 w-full h-auto">
        <div className="w-1/3  h-full flex flex-col items-center">
          <div className="bg-gradient-to-r relative mt-2 from-violet-600 to-indigo-600 h-[180px] w-[330px] shadow-lg shadow-slate-700 rounded-xl p-5 flex flex-col justify-between text-white">
            {/* Wallet Icon and Name */}
            <div className="absolute bottom-2 right-2">
              <img src={logo} className="h-20 w-20 blur-sm" />
            </div>
            <div className="flex justify-between items-center">
              <box-icon type="solid" name="wallet"></box-icon>
              <span className="text-lg font-semibold">Dripstr Wallet</span>
            </div>

            {/* Balance */}
            <div>
              <p className="text-sm">Your Balance</p>
              {loading ? (
                <p className="text-2xl font-bold">Loading...</p>
              ) : (
                <p className="text-3xl font-bold">
                  ₱{walletData?.revenue || "0.00"}
                </p>
              )}
            </div>

            {/* Card Number */}
            <div className="text-sm tracking-widest opacity-80">
              0{walletData?.number || "**** **** **** 1234"}
            </div>
          </div>
        </div>

        <div className="w-2/3 h-full p-4 flex flex-col justify-between">
          {/* Header */}
          <div className="">
            <div className="text-slate-800 text-xl font-semibold">
              {" "}
              {walletData?.owner_Name || "Loading"}
            </div>
          </div>

          {/* Buttons at the Bottom */}
          <div className="flex gap-4 mt-2">
            <button
              onClick={() => setActiveTab("history")}
              className="bg-indigo-600 glass hover:bg-indigo-700 text-white px-4 py-2 rounded-lg w-1/3"
            >
              History
            </button>
            <button
              onClick={() => setActiveTab("cashout")}
              className="bg-violet-600 glass hover:bg-violet-700 text-white px-4 py-2 rounded-lg w-1/3"
            >
              Request Cashout
            </button>

            <button
              onClick={() => setActiveTab("inquiry")}
              className="bg-purple-600 glass hover:bg-purple-700 text-white px-4 py-2 rounded-lg w-1/3"
            >
              Cashout Information
            </button>
          </div>
        </div>
      </div>

      <div className=" w-full border-b-2 border-slate-400 shadow-lg h-1 mt-2 "></div>
      <div className="w-full h-auto  justify-items-center">
        {/* Content Display */}
        {activeTab === "cashout" && (
          <div className="flex-grow relative bg-white w-1/2  p-4 rounded-lg shadow-md mt-4">
            <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-md">
              {" "}
            </div>
            <div className="text-slate-900">
              <h3 className="text-lg font-semibold mb-2 text-slate-800">
                Request Cashout
              </h3>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter Amount"
                className="w-full p-2 border text-slate-800 bg-slate-300 rounded-md mb-2"
              />
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for Cashout"
                className="w-full p-2 border text-slate-800 rounded-md bg-slate-300"
              ></textarea>
              <button
                onClick={handleSubmitCashoutcONF}
                className="mt-3 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg w-full"
              >
                Submit Request
              </button>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="flex-grow relative bg-white w-1/2 p-4 rounded-lg shadow-md mt-4">
            <div className="w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-md"></div>
            <div className="w-full text-slate-900 relative p-2">
              <h3 className="text-lg font-semibold mb-2">
                Transaction History
              </h3>

              {loading ? (
                <p className="text-center">Loading transactions...</p>
              ) : transactions.length === 0 ? (
                <p className="text-center text-gray-500">
                  No transactions yet.
                </p>
              ) : (
                transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="p-2 border-b flex justify-between"
                  >
                    <span>
                      ₱{transaction.qty} - {transaction.reason}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        transaction.status === "Pending"
                          ? "text-yellow-500"
                          : "text-green-600"
                      }`}
                    >
                      {transaction.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(transaction.created_at).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "2-digit", year: "numeric" }
                      )}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "inquiry" && (
          <div className="flex-grow relative bg-white w-1/2 p-4 rounded-lg shadow-md mt-4">
            <div className="w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-md"></div>

            <h3 className="text-lg font-semibold mb-2 text-custom-purple text-center">
              DRIPSTR FAQS CASHOUT
            </h3>

            {/* Info Display */}
            <div className="h-[300px] w-full shadow-inner shadow-slate-400 rounded-md overflow-y-auto bg-slate-300 p-4">
              {inquiryText ? (
                <p className="whitespace-pre-line text-slate-700">{inquiryText}</p>
              ) : (
                <p className="text-gray-500 text-center">Select an inquiry</p>
              )}
            </div>

            {/* Buttons for Quick Inquiry Messages */}
            <div className="mt-3 flex flex-wrap gap-2">
              {/* PAYMENT METHODS */}
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex-1"
                onClick={() =>
                  setInquiryText(`💳 **Accepted Payment Methods**:
            
• **Credit/Debit Cards**: Visa, Mastercard, American Express
• **E-Wallets**: GCash, PayMaya
• **Bank Transfers**: BPI, BDO, UnionBank
• **Cash on Delivery (COD)**: Available in selected locations

✅ **Secure Transactions**: All payments are encrypted & secure.
📧 **Confirmation**: You'll receive an email once payment is processed.`)
                }
              >
                Payment Methods
              </button>

              {/* REFUNDS & EXCHANGES */}
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex-1"
                onClick={() =>
                  setInquiryText(`🔄 **Refund & Exchange Policy**:
            
📆 **Refunds**: Within **7 days** if the item is defective or not as described.
🔄 **Exchanges**: Within **14 days** for size or color changes.
📦 **Condition**: Items must be unused with original tags/packaging.

📩 **To request a refund/exchange, email**: support@dripstr.com`)
                }
              >
                Refunds & Exchanges
              </button>

              {/* SHIPPING TIME */}
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex-1"
                onClick={() =>
                  setInquiryText(`🚚 **Shipping Time Estimates**:
            
📍 **Metro Manila**: 2-5 business days
📍 **Luzon Areas**: 5-7 business days
📍 **Visayas & Mindanao**: 7-10 business days
🌎 **International Shipping**: 10-20 business days

🔗 **Tracking**: You’ll receive an email with a tracking number when your order ships.`)
                }
              >
                Shipping Time
              </button>

              {/* STORE LOCATION */}
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex-1"
                onClick={() =>
                  setInquiryText(`🏬 **Dripstr Store Locations**:
            
📌 **Online Store**: We currently operate **online only**.
📌 **Physical Pop-Up Shops**:
   • **SM Megamall (Event Booth)** – Last weekend of the month
   • **Greenbelt 5 (Urban Hype Store)** – Selected Dripstr items available

📲 **Follow us on Instagram**: @dripstr.ph for the latest pop-up updates!`)
                }
              >
                Store Location
              </button>
            </div>
          </div>
        )}
      </div>
      {isModalOpenCO && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              Are you sure you want to submit this cashout request?
            </h3>
            <span className="text-custom-purple font-semibold">Amount:</span>
            <input
              type="number"
              value={amount}
              placeholder="Enter Amount"
              className="w-full disabled p-2  text-slate-800 bg-slate-300 rounded-md mb-2"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpenCO(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitCashout}
                className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {showAlertBL && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-10 right-0  h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 right-16   -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={sadEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert bg-yellow-600 shadow-md flex items-center p-4 text-slate-50 font-semibold rounded-md"
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>Your Current Balance is Low!</span>
          </div>
        </div>
      )}
      {showAlertSend && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-10 right-0  h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 right-16   -z-10 justify-items-center content-center">
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
            className="alert bg-custom-purple shadow-md flex items-center p-4 text-slate-50 font-semibold rounded-md"
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>Your Request has been Sent!</span>
          </div>
        </div>
      )}
      {showAlertMin && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-10 right-0  h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
          <div className="absolute -top-48 right-16   -z-10 justify-items-center content-center">
            <div className="mt-10 ">
              <img
                src={sadEmote}
                alt="Success Emote"
                className="object-contain rounded-lg p-1 drop-shadow-customViolet"
              />
            </div>
          </div>
          <div
            role="alert"
            className="alert bg-yellow-600 shadow-md flex items-center p-4 text-slate-50 font-semibold rounded-md"
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
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>Minimum cashout amount is ₱100</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MerchantWallet;
