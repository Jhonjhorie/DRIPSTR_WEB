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
  faCrown
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

function ShopPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const shop = location.state?.shop || {};
  const [showAlert, setShowAlert] = useState(false);
  const { fetchDataCart } = useCarts();
  const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();
  const [filMall, setFilMall] = useState(0);
  const [filCat, setFilCat] = useState(categories[0]?.label || "");
  const { products, loading, error } = useProducts(profile);
  
  // Stats for the shop (you would normally fetch these)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSold: 0,
    totalFollowers: 0
  });
  
  useEffect(() => {
    // Calculate stats based on available products
    if (products && products.length) {
      const shopProducts = products.filter(p => p.shop_id === shop.id);
      const soldCount = shopProducts.reduce((acc, product) => acc + (product.sold_count || 0), 0);
      
      setStats({
        totalProducts: shopProducts.length,
        totalSold: soldCount,
        totalFollowers: shop.followers_count || 0
      });
    }
  }, [products, shop]);

  const closeModalRepS = () => {
    document.getElementById("my_modal_reportS").close();
  };

  const mulletReport = () => {
    document.getElementById("my_modal_reportS").showModal();
  };

  const imagePreview = shop.shop_image != null ? shop.shop_image : null;
  const isPremium = shop.is_premium === true;

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
    <div className={`w-full font-[iceland] relative bg-white flex flex-col ${isPremium ? 'bg-gradient-to-b from-gray-50 to-gray-100' : 'bg-white'}`}>
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
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Premium Badge */}
        {isPremium && (
          <div className="mb-4 flex justify-end">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-black text-yellow-400 rounded-full text-sm font-medium">
              <FontAwesomeIcon icon={faCrown} /> Premium Merchant
            </span>
          </div>
        )}
        
        {/* Shop Header Section */}
        <div className={`rounded-lg overflow-hidden ${isPremium ? 'bg-black bg-opacity-5 shadow-lg' : 'bg-white shadow'} p-4 sm:p-6`}>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Shop Image */}
            <div className="flex-shrink-0 w-full md:w-64 h-64">
              {imagePreview ? (
                <div className={`relative h-full w-full overflow-hidden rounded-md ${isPremium ? 'border-2 border-primary-color' : 'border border-gray-200'}`}>
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
            </div>
            
            {/* Shop Info */}
            <div className="flex-1 flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h1 className={`text-3xl sm:text-4xl font-bold ${isPremium ? 'text-gray-900' : 'text-secondary-color'} line-clamp-2`}>
                  {shop.shop_name}
                </h1>
                
                {/* Rating */}
                <div className="flex w-1/3 justify-between md:justify-end items-center mt-2 sm:mt-0 gap-2">
                  <div className={`flex items-center gap-1 px-3 py-1 ${isPremium ? 'bg-black text-yellow-400' : 'bg-secondary-color bg-opacity-10 text-primary-color'}  rounded-full`}>
                    <FontAwesomeIcon icon={faStar} />
                    <span className="font-bold">{shop.shop_Rating || "0"}</span>
                  </div>
                    {/* Action buttons */}
              {isLoggedIn && (
                <div className="flex gap-2 mt-auto">
                  <MerchantFollow 
                    profile={profile} 
                    shop={shop} 
                    isLoggedIn={isLoggedIn}
                    customClassName={isPremium ? "border-black hover:bg-black hover:text-white" : ""} 
                  />
                  <button
                    onClick={mulletReport}
                    className={`flex items-center justify-center h-10 px-4 gap-1 rounded-md text-gray-500 hover:text-gray-700 border ${isPremium ? 'border-gray-500 hover:border-gray-800' : 'border-gray-300 hover:border-gray-500'} transition-all duration-300`}
                  >
                    <FontAwesomeIcon icon={faTriangleExclamation} size="sm" /> Report
                  </button>
                </div>
              )}
                </div>
              </div>
              
              {/* Shop description */}
              <div className="border-t border-b border-gray-200 py-4 mb-4">
                <p className="text-gray-700">{shop.description || "No description available."}</p>
              </div>
              
              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-2 rounded-md bg-gray-50">
                  <FontAwesomeIcon icon={faBox} className="text-primary-color mb-1" />
                  <p className="text-sm text-gray-500">Products</p>
                  <p className="font-bold text-xl">{stats.totalProducts}</p>
                </div>
                <div className="text-center p-2 rounded-md bg-gray-50">
                  <FontAwesomeIcon icon={faShoppingBag} className="text-primary-color mb-1" />
                  <p className="text-sm text-gray-500">Sold</p>
                  <p className="font-bold text-xl">{stats.totalSold}</p>
                </div>
                <div className="text-center p-2 rounded-md bg-gray-50">
                  <FontAwesomeIcon icon={faUsers} className="text-primary-color mb-1" />
                  <p className="text-sm text-gray-500">Followers</p>
                  <p className="font-bold text-xl">{stats.totalFollowers}</p>
                </div>
              </div>
              
            
            </div>
          </div>
        </div>
        
        {/* Ad Banner Section */}
        {/* <div className="my-6 mx-auto w-full max-w-[15rem] h-[10rem]">
          {/* <AdsCarousel ads={shop.shop_Ads}/> */}
          {/* Fallback if you don't have the component: */}
          {/* <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center text-gray-500 border border-dashed border-gray-300">
            Advertisement Space
          </div> 
        </div> */}
        
        {/* Categories Section */}
        <div className={`${isPremium ? 'bg-gray-900 bg-opacity-5' : 'bg-gray-100'} rounded-lg p-4 mb-6`}>
          <CategoriesRibbon
            active={filCat}
            categories={categories}
            onItemClick={(label) => setFilCat(label)}
            premiumStyle={isPremium}
          />
        </div>
        
        {/* Products Section */}
        <div className={`${isPremium ? 'bg-white shadow-lg' : 'bg-white'} rounded-lg p-4`}>
          <h2 className={`text-2xl font-bold mb-4 ${isPremium ? 'text-gray-900' : 'text-secondary-color'}`}>Products</h2>
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