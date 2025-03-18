import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTriangleExclamation,
  faHeart,
  faStar,
  faBox,
  faShoppingBag,
  faUsers,
  faCrown,
  faAnglesLeft,
} from "@fortawesome/free-solid-svg-icons";
import useCarts from "./hooks/useCart.js";
import ReportDialog from "./components/reportModal.js";
import CategoriesRibbon from "./components/CategoriesRibbon.js";
import AlertDialog from "./components/alertDialog2.js";
import ProductsView from "./components/ProductsView.js";

// Data
import { categories } from "@/constants/categories.ts";
import useProducts from "./hooks/useProducts";
import useUserProfile from "@/shared/mulletCheck";
import MerchantFollow from "./components/subcomponents/MerchantFollow.js";
import AdsBanner from "../Home/components/AdsBanner.js";
import AdsCarousel from "./components/subcomponents/AdsCarousel.js";
import ShopVoucherStream from "./components/subcomponents/ShopVoucher.js";
import ReviewStream from "./components/subcomponents/reviewsStream.js";
import { supabase } from "../../constants/supabase.js";
import useReviews from "./hooks/useShopReview.js";
import ChatBox from "../Messaging/ChatBox.js";

function ShopPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const shop = location.state?.shop || {};
  const [showAlert, setShowAlert] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { fetchDataCart } = useCarts();
  const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();
  const [filMall, setFilMall] = useState(0);
  const [filCat, setFilCat] = useState(categories[0]?.label || "");
  const { products, loading, error } = useProducts(profile);
  const {reviews, loadingRev, shopRating, fetchReviews} = useReviews(shop.id);
  const [openChat, setOpenChat] = useState(false);
const [selectedChat, setSelectedChat] = useState(null);
const [minimizedChats, setMinimizedChats] = useState([]);

  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSold: 0,
    totalFollowers: 0,
  });
  
  useEffect(() => {
    if (isLoggedIn && profile?.id && shop?.id) {
      fetchWishlist();
    }
  }, [isLoggedIn, profile, shop]);
  
  const fetchWishlist = async () => {
    const { data, error } = await supabase
      .from("merchant_Followers")
      .select("*")
      .eq("acc_id", profile.id)
      .eq("shop_id", shop.id);
  
    if (error) {
      console.error("Error fetching Followers:", error);
    } else {
      setIsInWishlist(data.length > 0);
    }
  };
  
  const fetchFollowers = async () => {
    try {
      const { data, error } = await supabase
        .from("merchant_Followers")
        .select("shop_id")
        .eq("shop_id", shop.id);
  
      if (error) {
        console.error("Error fetching followers:", error);
        return 0;
      }
  
      return data.length;
    } catch (err) {
      console.error("Unexpected error:", err);
      return 0;
    }
  };
  
  const toggleWishlist = async () => {
    if (!isLoggedIn || !profile?.id || !shop?.id) return;
  
    if (isInWishlist) {
      const { error } = await supabase
        .from("merchant_Followers")
        .delete()
        .eq("acc_id", profile.id)
        .eq("shop_id", shop.id);
  
      if (error) {
        console.error("Error removing from Followers:", error);
      } else {
        setIsInWishlist(false);
        updateFollowersCount(-1); 
      }
    } else {
      const { error } = await supabase
        .from("merchant_Followers")
        .insert([{ acc_id: profile.id, shop_id: shop.id }]);
  
      if (error) {
        console.error("Error adding to Followers:", error);
      } else {
        setIsInWishlist(true);
        updateFollowersCount(1); 
      }
    }
  };

  const handleMessage = async () => {
    if (!profile?.id || !shop?.id) return;
  
    try {
      const { data: existingMessages, error: fetchError } = await supabase
        .from("messages")
        .select("*, merch:merchant_Id(*)") // Include merchant data
        .eq("sender_id", shop.owner_Id)
        .eq("receiver_id", profile.id)
        .eq("merchant_Id", shop.id);
  
      if (fetchError) throw fetchError;
  
      if (existingMessages.length > 0) {
        setSelectedChat(existingMessages[0]);
      } else {
        // Create a new conversation
        const { data, error } = await supabase
          .from("messages")
          .insert([
            {
              sender_id: shop.owner_Id,
              receiver_id: profile.id,
              merchant_Id: shop.id,
              content: [],
              last_message: "",
            },
          ])
          .select("*, merch:merchant_Id(*)")
          .single();
  
        if (error) throw error;
  
        // Open the new chat
        setSelectedChat(data);
      }
  
      // Open the chat modal
      setOpenChat(true);
    } catch (error) {
      console.error("Error handling message:", error.message);
    }
  };
  
  const updateFollowersCount = async (change) => {
    setStats((prevStats) => ({
      ...prevStats,
      totalFollowers: prevStats.totalFollowers + change,
    }));
  };
  
  useEffect(() => {
    const updateStats = async () => {
      const followers = await fetchFollowers();
  
      if (products && products.length) {
        const shopProducts = products.filter((p) => p.shop_Id === shop.id);
        const soldCount = shopProducts.reduce(
          (acc, product) => acc + (product.item_Orders || 0),
          0
        );
  
        setStats({
          totalProducts: shopProducts.length,
          totalSold: soldCount,
          totalFollowers: followers,
        });
      } else {
        setStats((prevStats) => ({
          ...prevStats,
          totalFollowers: followers,
        }));
      }
    };
  
    updateStats();
  }, [products, shop]);
  
  
  const closeModalRepS = () => {
    document.getElementById("my_modal_reportS").close();
  };

  const mulletReport = () => {
    document.getElementById("my_modal_reportS").showModal();
  };

  const imagePreview = shop.shop_image != null ? shop.shop_image : null;
  const isPremium = shop.isPremiumShop;

  const handleSelectChat = (chat) => {
  setSelectedChat(chat);
  setOpenChat(false);
};

const handleCloseChat = (chat) => {
  setSelectedChat(null);
};

const handleMinimizeChat = (chat) => {
  setMinimizedChats((prev) => [...prev, chat]);
  setSelectedChat(null);
};

  if (!shop || Object.keys(shop).length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <p className="text-lg font-semibold">
          No Shop data found. Please return to the Home page.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`w-full  relative bg-white flex flex-col ${
        isPremium ? "" : ""
      } bg-gradient-to-b from-gray-50 to-gray-100`}
    >
       
       {selectedChat && (
      <ChatBox
        profile={profile}
        chat={selectedChat}
        onClose={() => handleCloseChat(selectedChat)}
        onMinimize={() => handleMinimizeChat(selectedChat)}
      />
    )}

<div className="fixed bottom-60 right-4 flex flex-col gap-2">
      {minimizedChats.map((chat, index) => (
        <div
          key={index}
          className="hover:scale-105 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md shadow-slate-100 opacity-80 hover:opacity-100 cursor-pointer"
          onClick={() => setSelectedChat(chat)}
        >
          <img
            src={chat?.merch?.shop_image}
            alt="Avatar"
            className="rounded-full"
          />
        </div>
      ))}
    </div>

    
      {/* Report Dialog */}
      <dialog
        id="my_modal_reportS"
        className="modal modal-bottom sm:modal-middle absolute z-[60] right-4 sm:right-0"
      >
        <ReportDialog
          item={shop}
          onClose={closeModalRepS}
          accId={profile.id}
          type={"shop"}
        />
        <form
          method="dialog"
          className="modal-backdrop min-h-full min-w-full absolute"
        >
          <button onClick={closeModalRepS}></button>
        </form>
      </dialog>

      {/* Alert */}
      {showAlert && (
        <div className="w-[95%] absolute -top-60 justify-center flex flex-col gap-2 px-2 lg:px-8 h-[80%] py-4">
          <AlertDialog
            emote={require("@/assets/emote/success.png")}
            text={"Item added to cart successfully!"}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-1 px-4 sm:px-6 lg:px-8 py-6 relative">
        {/* Premium Badge */}
        {isPremium && (
          <div className="absolute top-4 left-5 flex justify-end z-50">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r to-gray-700 from-yellow-800 text-yellow-400 rounded-full text-sm font-medium">
              <FontAwesomeIcon icon={faCrown} /> Premium Merchant
            </span>
          </div>
        )}

        {/* Shop Header Section */}
        <div
          className={`rounded-lg overflow-hidden  ${
            isPremium ? "bg-black bg-opacity-90 shadow-lg" : "bg-white shadow"
          } px-4 sm:px-6 py-4 sm:py-6 relative`}
        >
          {isPremium && (
            <>
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-500 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500 rounded-full opacity-20 blur-3xl"></div>
            </>
          )}
          <div className="flex flex-col items-center justify-center md:flex-row gap-6">
            {/* Shop Image */}
            <div className="flex-shrink-0 w-full md:w-64 h-full max-h-80 flex flex-col gap-1">
              {imagePreview ? (
                <div
                  className={`relative h-[17rem] w-full overflow-hidden rounded-md ${
                    isPremium ? "border-2 border-yellow-400" : "border "
                  }`}
                >
                  <img
                    src={imagePreview}
                    alt={`${shop.shop_name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full bg-gray-100 rounded-md">
                  <img
                    src={require("@/assets/emote/hmmm.png")}
                    alt="No Images Available"
                    className="w-32 h-32 object-contain opacity-70"
                  />
                  <p className="text-center font-medium text-gray-500 mt-2">
                    No image available
                  </p>
                </div>
              )}
              <button
                className={`btn btn-outline p-1 h-7 min-h-7 rounded-md ${
                  isPremium
                    ? "text-yellow-400 hover:bg-yellow-400 hover:text-black border-yellow-400"
                    : ""
                }`}
                onClick={handleMessage}
              >
                Message Us
              </button>
            </div>

            {/* Shop Info */}
            <div className="flex-1 flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h1
                  className={`text-3xl sm:text-4xl font-bold font-[iceland] ${
                    isPremium ? "text-gray-50" : "text-secondary-color"
                  } line-clamp-2`}
                >
                  {shop.shop_name}
                </h1>

                {/* Rating */}
                <div className="flex w-full md:w-auto justify-between md:justify-end items-center mt-2 sm:mt-0 gap-2">
                  <div
                    className={`flex items-center gap-1 px-3 py-1 ${
                      isPremium
                        ? "bg-black text-yellow-400"
                        : "bg-secondary-color bg-opacity-10 text-primary-color"
                    }  rounded-full`}
                  >
                    <FontAwesomeIcon icon={faStar} />
                    <span className="font-bold">{shopRating || "0"}</span>
                  </div>
                  {/* Action buttons */}
                  {isLoggedIn && (
                    <div className="flex gap-2 font-[iceland] mt-auto">
                      <MerchantFollow
                      toggleWishlist={toggleWishlist}
                 
                      isInWishlist={isInWishlist}
                        customClassName={
                          isPremium
                            ? "border-black hover:bg-black hover:text-white"
                            : ""
                        }
                      />
                      <button
                        onClick={mulletReport}
                        className={`flex items-center justify-center h-10 px-4 gap-1 rounded-md text-gray-500 hover:text-gray-700 border ${
                          isPremium
                            ? "border-gray-500 hover:border-gray-800"
                            : "border-gray-300 hover:border-gray-500"
                        } transition-all duration-300`}
                      >
                        <FontAwesomeIcon
                          icon={faTriangleExclamation}
                          size="sm"
                        />{" "}
                        Report
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Shop description */}
              <div className="border-t border-b border-gray-200 overflow-y-auto custom-scrollbar pr-3  h-40 py-1 mb-4">
                <p
                  className={`${
                    isPremium ? "text-gray-400" : "text-gray-700"
                  } font-[iceland] text-justify`}
                >
                  {shop.description || "No description available."}
                </p>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-4 mb-4 ">
                <div className="text-center p-2 rounded-md bg-gray-50 flex w-full h-full justify-center items-center">
                  <FontAwesomeIcon
                    icon={faBox}
                    className="text-primary-color text-xl md:text-3xl hidden md:flex"
                  />
                  <div className="divider max-w-1  divider-horizontal hidden md:flex "></div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Products</p>
                    <p className="font-bold text-base md:text-2xl">
                      {stats.totalProducts}
                    </p>
                  </div>
                </div>
                <div className="text-center p-2 rounded-md bg-gray-50 flex w-full h-full justify-center items-center ">
                  <FontAwesomeIcon
                    icon={faShoppingBag}
                    className="text-primary-color text-xl md:text-3xl hidden md:flex"
                  />
                  <div className="divider max-w-1 divider-horizontal hidden md:flex"></div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Sold</p>
                    <p className="font-bold text-base md:text-2xl">
                      {stats.totalSold}
                    </p>
                  </div>
                </div>
                <div className="text-center p-2 rounded-md bg-gray-50 flex w-full h-full justify-center items-center">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="text-primary-color text-xl md:text-3xl hidden md:flex"
                  />
                  <div className="divider max-w-1 divider-horizontal hidden md:flex"></div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Followers</p>
                    <p className="font-bold text-base md:text-2xl">
                      {stats.totalFollowers}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ad Banner Section */}
        <div className="my-6 mx-1 flex flex-col gap-4 md:mx-auto   h-full w-full">
                  {profile &&  <ShopVoucherStream profile={profile} shop={shop} />}
         
          <div className="flex flex-col md:flex-row justify-between  h-full  items-center gap-2">
            {/* <AdsCarousel shop={shop} /> */}
            <ReviewStream fetchReviews={fetchReviews} reviews={reviews} loading={loadingRev} />
          </div>
        </div>

        {/* Categories Section */}
        <div
          className={`${
            isPremium ? "bg-gray-900 bg-opacity-5" : "bg-gray-100"
          } flex w-full md:px-4  justify-center rounded-lg  mb-6`}
        >
          <button
            onClick={() => navigate("/")}
            className="w-4 px-2 sm:w-12  rounded-md bg-slate-50 flex items-center justify-center text-base sm:text-lg"
          >
            <FontAwesomeIcon icon={faAnglesLeft} />
          </button>
          <div className="w-full max-w-4xl">
            <CategoriesRibbon
              active={filCat}
              categories={categories}
              onItemClick={(label) => setFilCat(label)}
              premiumStyle={isPremium}
            />
          </div>
        </div>

        {/* Products Section */}
        <div
          className={`${
            isPremium ? "bg-white shadow-lg" : "bg-white"
          } rounded-lg p-4`}
        >
          <h2
            className={`text-xl md:text-2xl font-bold mb-4 ${
              isPremium ? "text-gray-900" : "text-secondary-color"
            }`}
          >
            Products
          </h2>
          <ProductsView
            products={products}
            categories={filCat}
            shopFil={shop.id}
            filter={filMall}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}

export default ShopPage;
