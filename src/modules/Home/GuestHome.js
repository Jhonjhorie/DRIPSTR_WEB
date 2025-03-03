// src/pages/Home.js
import React, { useState, useEffect } from "react";
import CategoriesRibbon from "../Products/components/CategoriesRibbon";
import ProductsView from "../Products/components/ProductsView";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faShoppingCart, faAngleLeft } from "@fortawesome/free-solid-svg-icons";

// Data
import { categories } from "@/constants/categories.ts";
import useProducts from "../Products/hooks/useProducts";
import AuthModal from "@/shared/login/Auth";
import { supabase } from "../../constants/supabase";
import Mall from "../Products/Mall";

function GuestHome() {
  const [filMall, setFilMall] = useState(0);
  const [filCat, setFilCat] = useState("All");
  
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { products, loading, error } = useProducts();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleAuth = () => {
    if (!user) {
      setIsAuthModalOpen(true); 
    } else {
      navigate("/"); 
    }
  };

  return (
    <div className="w-full relative flex flex-col ">
      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
      {/* Hero Section */}
      <div className="flex flex-col w-full gap-1 p-2 items-center bg-gray-200 min-h-screen">
        {/* Back Button and Guest Mode Banner */}
        <div className="flex flex-row w-full gap-2 lg:ml-16 ">
        <button 
            onClick={() => navigate("/")}
            className="w-12  rounded-md bg-slate-50 flex items-center justify-center text-2xl"
          >
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
          <div className="w-full lg:w-[90%]  p-4 rounded-md bg-secondary-color flex flex-col text-white relative overflow-hidden">
            
            <div className="absolute right-4 overflow-hidden h-24 w-24">
              <img
                src={require("@/assets/emote/success.png")}
                alt="No Images Available"
                className="drop-shadow-customViolet h-24 -right-4 -top-4 relative opacity-40"
              />
            </div>
            <h1 className="text-xl font-[iceland] z-20">
              You are in <span className="font-bold">Guest</span> Mode
            </h1>
            <p className="text-sm z-20">
              Guest user can only browse items. To add to cart and place orders, you must log in or register first.
            </p>
            <div className="flex justify-center z-20 mt-2">
              <button
                onClick={handleAuth}
                className="btn bg-primary-color btn-outline p-2 h-10 min-h-10 text-white hover:bg-white hover:text-black w-full max-w-xs drop-shadow-lg "
              >
                Login/Register
              </button>
            </div>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="flex flex-col w-full items-center justify-center">
          <div className="breadcrumbs text-lg text-gray-500 font-[iceland]">
            <ul>
              <li className="font-bold text-primary-color flex items-center gap-2">
                START <FontAwesomeIcon fontSize={16} icon={faShoppingCart} /> SHOPPING
              </li>
              <li className="font-bold text-secondary-color flex items-center gap-2">
                STAR <FontAwesomeIcon fontSize={16} icon={faStar} /> DRIPPING
              </li>
            </ul>
          </div>
        </div>
<Mall title2={"Guest Mall"} />
        {/* Products View */}
        {/* <div className="flex flex-col w-full justify-center ">
          <ProductsView
            products={products}
            shopFil={0}
            categories={filCat}
            filter={filMall}
            loading={loading}
            error={error}
            showItem={0}
            sort={"top"}
          />
        </div> */}
      </div>
    </div>
  );
}

export default GuestHome;