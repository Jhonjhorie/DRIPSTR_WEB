import React from "react";
import SideBar from "../Component/Sidebars";
import "../Component/Style.css";
import logo from "../../../assets/shop/logoBlack.png";
import { supabase } from "../../../constants/supabase";
import Subscription from "../Component/MerchantWallet";
import "boxicons";
import {
  blockInvalidChar,
  validateMinLength2,
} from "../Hooks/ValidNumberInput";
import questionEmote from "../../../../src/assets/emote/question.png";
import successEmote from "../../../../src/assets/emote/success.png";
import sadEmote from "../../../../src/assets/emote/error.png";
import hmmEmote from "../../../../src/assets/emote/hmmm.png";
import qrCode from "@/assets/qr.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown, faQrcode, faWallet } from "@fortawesome/free-solid-svg-icons";

const { useState, useEffect } = React;
function MerchantWallet() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [shopData, setShopData] = useState([]);
  const [walletData, setWalletData] = useState(null);
  const [activeTab, setActiveTab] = useState("history");
  const [modalOpen, setModalOpen] = useState(false);
  const phonedigit = (e) => {
    validateMinLength2(e, 11);
  };
  const [showWalletModal, setShowWalletModal] = useState(false); // show a wallet for verification
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
        setCurrentUser(user);

        const { data: shop, error: shopError } = await supabase
          .from("shop")
          .select(
            "shop_name, id, address, description, contact_number, shop_image, shop_BusinessPermit, wallet"
          )
          .eq("owner_Id", user.id)
          .single();

        if (shopError) {
          throw shopError;
        }

        console.log("Fetched shop data:", shop);
        setShopData(shop);
        setMerchantId(shop.id);

        if (!shop.wallet) {
          setShowWalletModal(true);
        }
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
  }, []);

  //insert the id to the shop wallet column
  const handleConfirmWallet = async () => {
    if (!walletData || !walletData.id) {
      console.error("No wallet data found.");
      return;
    }
  
    try {
      const { error } = await supabase
        .from("shop")
        .update({ wallet: walletData.id }) 
        .eq("owner_Id", currentUser.id); 
  
      if (error) {
        throw error;
      }
  
      console.log("Wallet ID successfully linked to shop.");
      setShowWalletModal(false);
    } catch (error) {
      console.error("Error updating wallet:", error.message);
    }
  };

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
      .select("id, revenue, owner_Name, owner_ID, number, valid_ID")
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
  useEffect(() => {
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
    if (!amount) {
      console.log("Please enter both amount and reason.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("merchant_Cashout").insert([
      {
        full_Name: walletData.owner_Name,
        owner_Id: walletData.owner_ID,
        qty: amount,
        reason: "Cashout",
        status: "Pending",
      },
    ]);

    if (error) {
      console.log("Error submitting request. Try again.");
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
    if (!amount) {
      console.log("Please enter both amount and reason.");
      return;
    }

    if (!walletData) {
      console.log("Wallet data not available.");
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

  //subscribe
  const [showAlertSubscription, setShowSubscription] = useState(false);
  const [openScan, setOpenscan] = useState(false);
  const [activeTabSubs, setActiveTabSubs] = useState("Def");
  const [inquiryText, setInquiryText] = useState("");

  //payment subscription
  const [currentUser, setCurrentUser] = useState(null);
  const [merchantId, setMerchantId] = useState(null);
  const [walletNote, setWalletNote] = useState("");
  const [gcashAmount, setGcashAmount] = useState("");
  const [gcashProof, setGcashProof] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptionExpiry, setSubscriptionExpiry] = useState(null);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [hasShownExpirationAlert, setHasShownExpirationAlert] = useState(false);
  const [showAlertExpiredSubs, setIsModalOpenExpired] = useState(false); //Expired CONFIRMATION
  const [showAlertSuccessSubs, setShowSubs] = useState(false);
  const [showAlertIBL, setIsModalOpenIBL] = useState(false); //CASHOUT CONFIRMATION
  const handleSubmitWalletSubscription = async () => {
    if (!currentUser || !merchantId) {
      setError("User or shop ID not found.");
      console.error("User or shop ID not found:", currentUser, merchantId);
      console.log("Alert: User or shop ID not found.");
      alert("User or shop ID not found.");
      return;
    }
    console.log("Submitting subscription:", currentUser, merchantId);
    setLoading(true);
    try {
      const subscriptionAmount = 500;
      const reason = walletNote;

      // Fetch current wallet balance
      const { data: wallet, error: walletError } = await supabase
        .from("merchant_Wallet")
        .select("revenue")
        .eq("owner_ID", currentUser.id)
        .single();
      if (walletError || !wallet) {
        throw new Error("Failed to retrieve wallet balance.");
      }
      const currentBalance = parseFloat(wallet.revenue || "0");
      if (currentBalance < subscriptionAmount) {
        throw new Error("Insufficient wallet balance.");
      }

      // Deduct subscription fee from wallet
      const newBalance = currentBalance - subscriptionAmount;
      const { error: updateWalletError } = await supabase
        .from("merchant_Wallet")
        .update({ revenue: newBalance.toString() })
        .eq("owner_ID", currentUser.id);
      if (updateWalletError) {
        throw updateWalletError;
      }
      //for expiration date of yhe subs
      const currentDate = new Date();
      const expirationDate = new Date();
      expirationDate.setDate(currentDate.getDate() + 30);
      const formattedExpirationDate = expirationDate
        .toISOString()
        .split("T")[0];
      // Insert subscription record for Wallet payment
      const { error: subscriptionError } = await supabase
        .from("merchant_Subscription")
        .insert([
          {
            user_Id: currentUser.id,
            merchant_Id: merchantId,
            payment: "Dripstr Wallet",
            reason: reason,
            status: "Completed",
            subs_Enddate: formattedExpirationDate,
          },
        ]);
      if (subscriptionError) {
        throw subscriptionError;
      }
      const { error: updateShopError } = await supabase
        .from("shop")
        .update({ is_Premium: true })
        .eq("id", merchantId);
      if (updateShopError) {
        throw updateShopError;
      }
      // Log cashout transaction
      const { error: cashoutError } = await supabase
        .from("merchant_Cashout")
        .insert([
          {
            full_Name: currentUser.full_Name,
            owner_Id: currentUser.id,
            qty: subscriptionAmount,
            reason: "Subscription",
            status: "Completed",
            subscription: "Dripstr Monthly Merchant Boost Plan",
            subs_HM: "500",
          },
        ]);
      if (cashoutError) {
        throw cashoutError;
      }
      checkSubscriptionStatus();
      
      fetchTransactions();
      fetchUserProfileAndShop();
      fetchWalletData();
      setShowSubs(true);
      setTimeout(() => setShowSubs(false), 3000);
      setShowSubscription(false);
      console.log("Alert: Subscription successful via Wallet!");
    } catch (err) {
      console.error("Wallet Subscription error:", err.message);
      console.log("Alert error:", err.message);
      setIsModalOpenIBL(true);
      setTimeout(() =>  setIsModalOpenIBL(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  // GCash Subscription Submission
  const handleSubmitGcashSubscription = async () => {
    if (!currentUser || !merchantId) {
      setError("User or shop ID not found.");
      return;
    }
    setLoading(true);
    try {

      if (!gcashProof) {
        throw new Error("Please upload proof of payment.");
      }

      // Upload proof of payment file to Supabase Storage
      const filePath = `proofs/${currentUser.id}_${Date.now()}_${
        gcashProof.name
      }`;
      const { data, error: uploadError } = await supabase.storage
        .from("wallet_docs")
        .upload(filePath, gcashProof);

      if (uploadError) {
        console.error("Upload error details:", uploadError);
        throw new Error(
          "Failed to upload proof of payment: " + uploadError.message
        );
      }

      const proofURL = data.path;

      // Insert subscription record for GCash payment
      const { error: subscriptionError } = await supabase
        .from("merchant_Subscription")
        .insert([
          {
            user_Id: currentUser.id,
            merchant_Id: merchantId,
            payment: "GCash",
            screenshot: proofURL,
            reason: "",
            status: "Pending",
          },
        ]);
      if (subscriptionError) {
        throw subscriptionError;
      }
      const { error: updateShopError } = await supabase
        .from("shop")
        .update({ is_Premium: false })
        .eq("id", merchantId);
      if (updateShopError) {
        throw updateShopError;
      }

      checkSubscriptionStatus();
    } catch (err) {
      console.error("GCash Subscription error:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // Function to handle subscription expiration when closing the modal
  const handleSubscriptionExpiration = async (artistId) => {
    try {
      // Validate that artistId is a valid number/string
      if (!artistId || typeof artistId !== "number") {
        console.error("Invalid artistId:", artistId);
        return;
      }
      // Insert cashout record
      const { error: cashoutError } = await supabase
        .from("merchant_Cashout")
        .insert([
          {
            full_Name: currentUser.full_Name || "Unknown Merchant",
            owner_Id: currentUser.id,
            qty: "250",
            reason: "Subscription",
            status: "Subscription Expired",
            subscription: "Dripstr Monthly Merchant Boost Plan",
            subs_HM: "500",
          },
        ]);

      if (cashoutError) {
        console.error("Failed to insert cashout record:", cashoutError.message);
        return;
      }
      // Close the modal permanently
      setIsModalOpenExpired(false);

      // Update subscription status in the database
      const { error } = await supabase
        .from("merchant_Subscription")
        .update({ status: "Expired" })
        .eq("user_Id", currentUser.id)
        .in("status", ["Completed", "Expire"]);

      if (error) {
        console.error("Failed to update subscription status:", error.message);
        return;
      }
      console.log("Subscription status updated to Expired.");

      // Update artist to non-premium
      console.log(
        "Updating Merchant premium status for merchantId:",
        merchantId
      );
      const { error: artistError } = await supabase
        .from("shop")
        .update({ is_Premium: false })
        .eq("id", merchantId);

      if (artistError) {
        console.error(
          "Failed to update artist premium status:",
          artistError.message
        );
        return;
      }
      console.log("Artist is no longer premium.");
      fetchTransactions();
      checkSubscriptionStatus();
      fetchUserProfileAndShop();
      console.log("Cashout record inserted successfully.");
    } catch (err) {
      console.error("Error handling subscription expiration:", err.message);
    }
  };
  const checkSubscriptionStatus = async () => {
    if (!currentUser) return;
    setLoading(true);

    try {
      const { data: subscriptions, error } = await supabase
        .from("merchant_Subscription")
        .select("subs_Enddate, status, merchant_Id")
        .eq("user_Id", currentUser.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (subscriptions && subscriptions.length > 0) {
        const latestSub = subscriptions[0];

        if (latestSub.status === "Pending") {
          setIsPending(true);
          setIsPremium(false);
          setSubscriptionExpiry(null);
          console.log("Subscription pending: waiting for admin approval.");
          return;
        }

        // If already expired, do not show the modal
        if (latestSub.status === "Expired") {
          setIsPremium(false);
          setSubscriptionExpiry(null);
          setIsPending(false);
          console.log(
            "Subscription is already expired. No modal will be shown."
          );
          return;
        }

        // Get expiration date
        const expirationDate = latestSub.subs_Enddate
          ? new Date(new Date(latestSub.subs_Enddate).setHours(24, 59, 59, 999))
          : null;

        const now = new Date();

        if (expirationDate) {
          console.log(
            "Subscription expires on:",
            expirationDate.toDateString()
          );

          if (now >= expirationDate) {
            // Show modal only if it hasn’t been shown before
            if (!hasShownExpirationAlert) {
              setHasShownExpirationAlert(true);
              setIsModalOpenExpired(true);
            }

            setSubscriptionExpiry(null);
            setIsPending(false);

            // Pass artist_Id to handleSubscriptionExpiration
            return latestSub.merchant_Id;
          } else {
            // Subscription is still valid
            setIsPremium(true);
            setIsPending(false);
            setSubscriptionExpiry(expirationDate);
            console.log(
              "User is currently premium. Expires on:",
              expirationDate
            );
          }
        } else {
          console.log("No expiration date found in subscription data.");
          setIsPremium(false);
          setSubscriptionExpiry(null);
          setIsPending(false);
        }
      } else {
        // No subscription found
        setIsPremium(false);
        setSubscriptionExpiry(null);
        setIsPending(false);
        console.log("No subscription found. User is not premium.");
      }
    } catch (err) {
      console.error("Error checking subscription status:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Call checkSubscriptionStatus when currentUser is set
  useEffect(() => {
    if (currentUser) {
      checkSubscriptionStatus();
    }
  }, [currentUser]);

  return (
    <div className="h-full w-full bg-slate-300 md:px-20 p-2 ">
      <div className="absolute mx-3 right-0 z-20">
        <SideBar />
      </div>
      <div className="text-xl md:ml-0 -ml-2 md:text-3xl font-semibold w-full text-start  text-custom-purple p-3">
        <h1>MERCHANT WALLET</h1>
      </div>
      <div className="md:flex  mt-3 md:mt-0 gap-2 w-full h-auto">
        <div className="md:w-1/3 w-full justify-items-center h-full md:flex flex-col items-center">
          <div
            className={`bg-gradient-to-r relative mt-2 from-violet-600 to-indigo-600 h-[180px] w-[330px] shadow-lg shadow-slate-700 rounded-xl p-5 flex flex-col justify-between text-white ${
              isPremium
                ? "border-4 border-yellow-400 bg-gradient-to-r relative mt-2 from-yellow-600 to-indigo-500 h-[180px]"
                : ""
            }`}
          >
              {isPremium && (
                <div className="absolute z-10 -left-2 -top-2 flex justify-end">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-black text-yellow-400 rounded-full text-sm font-medium">
                    <FontAwesomeIcon icon={faCrown} /> Premium Merchant
                  </span>
                </div>
              )}
            {/* Wallet Icon and Name */}
            <div className="absolute bottom-2 right-2">
              <img src={logo} className="h-20 w-20 blur-sm" />
            </div>
            <div className="flex justify-between items-center">
            <FontAwesomeIcon icon={faWallet} /> 
              <span className="text-lg font-semibold">Dripstr Wallet</span>
            </div>

            {/* Balance */}
            <div>
              <p className="text-sm">Your Balance</p>
              {loading ? (
                <p className="text-2xl font-bold">Loading...</p>
              ) : (
                <p className="text-3xl font-bold">
                  ₱
                  {walletData?.revenue
                    ? Number(walletData.revenue).toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "0.00"}
                </p>
              )}
            </div>

            {/* Card Number */}
            <div className="text-sm tracking-widest opacity-80">
              0{walletData?.number || "**** **** ****"}
            </div>
          </div>
        </div>

        <div className="w-full md:w-2/3 h-full p-4 flex flex-col justify-between">
          {/* Header */}
          <div className="">
            <div className="text-slate-900 md:text-start text-center text-xl font-semibold">
              {" "}
              {walletData?.owner_Name || "Loading"}
            </div>
          </div>

          {/* Buttons at the Bottom */}
          <div className="flex gap-2 md:gap-4 mt-2">
            <button
              onClick={() => setActiveTab("history")}
              className="bg-indigo-600 glass text-sm hover:bg-indigo-700 text-white px-4 md:py-2 py-1 rounded-lg w-1/3"
            >
              History
            </button>
            <button
              onClick={() => setActiveTab("cashout")}
              className="bg-violet-600 glass text-sm hover:bg-violet-700 text-white px-4 md:py-2 py-1 rounded-lg w-1/3"
            >
              Request Cashout
            </button>

            <button
              onClick={() => setActiveTab("inquiry")}
              className="bg-purple-600 glass text-sm hover:bg-purple-700 text-white px-4 md:py-2 py-1 rounded-lg w-1/3"
            >
              Cashout Information
            </button>
          </div>
          <div className="w-full mt-5">
            <div className="justify-end flex w-auto relative">
              <h1
                onClick={() => setShowSubscription(true)}
                className="cursor-pointer w-auto glass bg-red-600 text-sm text-white font-semibold shadow-red-400 shadow-md p-1 md:p-2 rounded-md hover:scale-95 duration-200
      animate-none hover:animate-[shake_1s_ease-in-out_infinite]  flex items-center gap-2"
              >
                SUBSCRIPTION
                <FontAwesomeIcon icon={faCrown} className="text-yellow-500"/>
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className=" w-full border-b-2 border-slate-400 shadow-lg h-1 mt-2 "></div>
      <div className="w-full h-auto  justify-items-center mb-20 md:mb-0">
        {/* Content Display */}
        {activeTab === "cashout" && (
          <div className="flex-grow relative bg-white w-full md:w-1/2 px-6  p-4 rounded-lg shadow-md mt-4">
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
                onInput={phonedigit}
                className="w-full p-2 border text-sm text-slate-800 bg-slate-300 rounded-md mb-2"
              />
              {/* <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for Cashout"
                className="w-full p-2 border text-sm text-slate-800 rounded-md bg-slate-300"
              ></textarea> */}
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
          <div className="flex-grow relative bg-white w-full md:w-1/2 p-4 rounded-lg shadow-md mt-4">
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
                    <span className="text-sm">
                      ₱{transaction.qty} - {transaction.reason}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        transaction.status === "Pending"
                          ? "text-yellow-500"
                          : transaction.status === "Subscription Expired"
                          ? "text-red-500"
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
          <div className="flex-grow relative bg-white w-full md:w-1/2 p-4 rounded-lg shadow-md mt-4">
            <div className="w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-md"></div>

            <h3 className="text-lg font-semibold mb-2 text-custom-purple text-center">
              DRIPSTR FAQs: CASHOUT
            </h3>

            {/* Info Display */}
            <div className="h-[300px] w-full shadow-inner shadow-slate-400 rounded-md overflow-y-auto bg-slate-300 p-4">
              <div className="max-w-3xl mx-auto px-6">
                <div className="space-y-6">
                  <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                    <h2 className="text-lg text-black font-semibold">
                      1. What is the only accepted cash out method?
                    </h2>
                    <p className="text-gray-800 text-sm">
                      We currently only support GCash for cash out. You must
                      have a valid GCash account to withdraw your funds.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                    <h2 className="text-lg text-black font-semibold">
                      2. Is there a minimum cash out amount?
                    </h2>
                    <p className="text-gray-800 text-sm">
                      Yes. The minimum cash out amount is ₱100. You’ll be
                      notified if your balance is below this threshold.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                    <h2 className="text-lg text-black font-semibold">
                      3. How long does it take to process a GCash cash out?
                    </h2>
                    <p className="text-gray-800 text-sm">
                      Cash out requests are usually processed within 3-5
                      business days. You will receive a confirmation email once
                      your request is completed.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                    <h2 className="text-lg text-black font-semibold">
                      4. Are there any fees for cashing out to GCash?
                    </h2>
                    <p className="text-gray-800 text-sm">
                      A small transaction fee may apply. You’ll see a breakdown
                      of any fees before confirming your request.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                    <h2 className="text-lg text-black font-semibold">
                      5. How do I request a GCash cash out?
                    </h2>
                    <ul className="list-disc pl-6 text-gray-800 text-sm">
                      <li>Go to your Merchant/Artist Dashboard.</li>
                      <li>Select “Request Cash Out.”</li>
                      <li>Choose GCash as your payment method.</li>
                      <li>Enter the amount you wish to withdraw.</li>
                      <li>Click “Confirm” to finalize your request.</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                    <h2 className="text-lg text-black font-semibold">
                      6. Is my transaction secure?
                    </h2>
                    <p className="text-gray-800 text-sm">
                      Absolutely. We use encryption and secure payment gateways
                      to protect your information and ensure safe transactions.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                    <h2 className="text-lg text-black font-semibold">
                      7. How will I know if my cash out is successful?
                    </h2>
                    <p className="text-gray-800 text-sm">
                      You’ll receive an email notification once your cash out
                      has been processed. You can also check your transaction
                      history in your dashboard for real-time status updates.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                    <h2 className="text-lg text-black font-semibold">
                      8. What if I encounter issues or delays?
                    </h2>
                    <p className="text-gray-800 text-sm">
                      If you haven’t received your funds within the stated
                      timeframe or have any other concerns, please contact our
                      Support Team. Provide your cash out reference number to
                      help us resolve your issue quickly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {isModalOpenCO && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-lg font-semibold text-center text-slate-900 mb-4">
              Are you sure you want to submit this cashout request?
            </h3>
            <span className="text-custom-purple text-sm font-semibold">
              Amount:
            </span>
            <input
              type="number"
              value={amount}
              placeholder="Enter Amount"
              className="w-full disabled p-2 text-sm text-slate-800 bg-slate-300 rounded-md mb-2"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpenCO(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white text-sm  px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitCashout}
                className="bg-violet-600 hover:bg-violet-700 text-white text-sm px-4 py-2 rounded"
              >
                Submit
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
       {showAlertIBL && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-40 right-0  h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
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
            <span>Insuffecient Balance is Low!</span>
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
      {showAlertSubscription && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 w-[600px] rounded-md shadow-md relative">
            {/* Gradient Header Line */}
            <div className="w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-md"></div>

            {/* Title */}
            <h2 className="text-2xl font-bold iceland-regular text-center mb-4 text-slate-900">
              Subscribe to Dripstr's Monthly Merchant Boost Plan!
            </h2>
            {/* Content*/}
            <div className="bg-slate-200 py-4 rounded-sm p-2">
              {/* Success Emote */}
              {isPending ? (
                <div className="p-4 bg-yellow-100 rounded-md shadow-md">
                  <h2 className="text-2xl font-bold text-slate-800">
                    Your subscription is pending!
                  </h2>
                  <p className="text-slate-700">
                    Your subscription request is awaiting admin approval. Please
                    wait.
                  </p>
                </div>
              ) : isPremium ? (
                <div className="p-4 bg-green-100 rounded-md shadow-md">
                  <h2 className="text-2xl font-bold text-slate-800">
                    You're already Premium!
                  </h2>
                  <p className="text-slate-700">
                    Your subscription is active until{" "}
                    {subscriptionExpiry
                      ? subscriptionExpiry.toLocaleDateString()
                      : "[DATE]"}
                    .
                  </p>
                </div>
              ) : (
                <>
                  {activeTabSubs === "Def" && (
                    <div>
                      <div className="flex justify-center p-5">
                        <img
                          src={successEmote}
                          alt="Success Emote"
                          className="object-contain rounded-lg p-1 drop-shadow-customViolet w-24"
                        />
                      </div>
                      {/* Benefits Section */}
                      <div className=" text-slate-800 space-y-3">
                        <p className="text-lg font-semibold text-center">
                          🚀 Why Subscribe?
                        </p>
                        <ul className="text-sm space-y-2 list-disc list-inside">
                          <li>
                            <strong>Increased Visibility:</strong> Your products
                            get featured for better exposure.
                          </li>
                          <li>
                            <strong>Exclusive Promotions:</strong> Access to
                            special discounts and marketing campaigns.
                          </li>
                          <li>
                            <strong>Priority Support:</strong> Get faster
                            customer assistance whenever you need it.
                          </li>
                          <li>
                            <strong>Advanced Analytics:</strong> Gain insights
                            on sales trends and customer behavior.
                          </li>
                          <li>
                            <strong>More Sales Opportunities:</strong> Stand out
                            from competitors with premium placements.
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                  {activeTabSubs === "Wallet" && (
                    <div className="flex-grow relative place-self-center bg-white w-2/3 px-6 p-4 rounded-lg shadow-md">
                      <div className="text-slate-900">
                        <div className="flex justify-items-center gap-2">
                          <div>
                            <h3 className="text-lg text-center font-bold mb-2 text-slate-800">
                              Pay via Dripstr Wallet
                            </h3>
                          </div>
                          <div className="w-auto h-auto">
                            <box-icon name="wallet" type="solid"></box-icon>
                          </div>
                        </div>
                        <p className="text-start text-slate-800 font-semibold">
                          Subscription Fee: ₱500
                        </p>
                        <label className="text-sm text-slate-800">
                          Type note for Dripstr (Optional):
                        </label>
                        <textarea
                          placeholder="Note for Dripstr"
                          value={walletNote}
                          onChange={(e) => setWalletNote(e.target.value)}
                          className="w-full p-2 border text-slate-800 rounded-md bg-slate-300"
                        ></textarea>
                        <button
                          onClick={handleSubmitWalletSubscription}
                          className="mt-3 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg w-full"
                        >
                          Submit Payment
                        </button>
                      </div>
                    </div>
                  )}

                  {activeTabSubs === "Gcash" && (
                    <div className="flex-grow relative place-self-center bg-white w-2/3 px-6 p-4 rounded-lg shadow-md">
                      <div className="text-slate-900">
                        <div className="flex justify-items-center gap-2">
                          <div>
                            <h3 className="text-lg text-center font-bold mb-2 text-slate-800">
                              Pay via Gcash
                            </h3>
                          </div>
                          <div
                            onClick={() => setOpenscan(true)}
                            data-tip="Scan here"
                            className="tooltip-right tooltip w-auto h-auto cursor-pointer flex gap-1"
                          >
                             <FontAwesomeIcon icon={faQrcode} className="text-yellow-500 text-xl"/>
                             <p className="text-sm text-slate-800">(scan here)</p>
                          </div>
                        </div>
                        <label className="text-sm text-slate-800">
                          Type the Amount:
                        </label>
                        <p className="text-start text-slate-800 font-semibold">
                          Subscription Fee: ₱500
                        </p>
                        <label className="text-sm text-slate-800">
                          Proof of payment:
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setGcashProof(e.target.files[0])}
                          className="w-full p-2 border text-slate-800 bg-slate-300 rounded-md mb-2"
                        />
                        <button
                          onClick={handleSubmitGcashSubscription}
                          className="mt-3 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg w-full"
                        >
                          Submit Payment
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between gap-3 mt-5">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTabSubs("Wallet")}
                  disabled={isPending || isPremium}
                  className={`bg-custom-purple glass px-4 py-2 text-white rounded-sm font-semibold transition duration-300 ${
                    isPending || isPremium
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-primary-color"
                  }`}
                >
                  Pay via Dripstr Wallet
                </button>
                <button
                  onClick={() => setActiveTabSubs("Gcash")}
                  disabled={isPending || isPremium}
                  className={`bg-blue-600 glass px-4 py-2 text-white rounded-sm font-semibold transition duration-300 ${
                    isPending || isPremium
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                >
                  Pay via Gcash
                </button>
              </div>

              <button
                onClick={() => {
                  setShowSubscription(false);
                  setActiveTabSubs("Def");
                }}
                className="bg-red-500 px-4 py-2 text-white rounded-sm font-semibold transition duration-300 hover:bg-red-600"
              >
                Close
              </button>
            </div>
          </div>
          {openScan && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
              <div className="relative bg-custom-purple h-auto w-auto p-2 rounded-md ">
                <div className="h-80 w-64">
                  <img src={qrCode} className="h-full w-full object-fill"/>
                </div>
                <button
                  onClick={() => {
                    setOpenscan(false);
                  }}
                  className="absolute -top-2 right-0 text-custom-purple text-3xl p-2 drop-shadow-lg "
                >
                  &times;
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {showAlertExpiredSubs && (
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
              Your Subscription has Expired!
            </h3>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => handleSubscriptionExpiration(merchantId)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
      {showAlertSuccessSubs && (
        <div className="md:bottom-5  w-auto px-10 bottom-10 z-30 right-0  h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
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
            className="alert bg-yellow-600 glass shadow-md flex items-center p-4 text-slate-50 font-semibold rounded-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Successfully Avail SUBSCRIPTION!</span>
          </div>
        </div>
      )}
      {showWalletModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome to Your Merchant Wallet
            </h2>
            <p className="mt-3 text-gray-600">
              Please click <span className="font-bold">"CONFIRM"</span> to set
              up your wallet information.
            </p>
            <button
              className="mt-5 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
              onClick={handleConfirmWallet}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MerchantWallet;
