// src/pages/Home.js
import React, { useState, useEffect } from "react";
import CategoriesRibbon from "../Products/components/CategoriesRibbon";
import ProductsView from "../Products/components/ProductsView";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faShoppingCart, faBackspace, faBackward, faAngleLeft } from "@fortawesome/free-solid-svg-icons";

// Data
import { categories } from "@/constants/categories.ts";
import useProducts from "../Products/hooks/useProducts";
import AuthModal from "@/shared/login/Auth";
import { supabase } from "../../constants/supabase";

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
    <div className="w-full relative flex flex-col">
       {/* Auth Modal */}
       {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
      {/* Hero Section */}
      <div className="flex group flex-col-reverse w-full gap-8 md:gap-0 md:flex-row overflow-hidden items-start justify-center px-1 lg:p-4 bg-slate-300 min-h-[87vh]">
        <div className=" w-[90%] flex flex-col justify-center items-center">
          <div className="flex gap-2 justify-center ">
            <button 
            onClick={() => (navigate("/"))}
            className=" w-40 px-2 rounded-md bg-slate-50 flex items-center text-3xl font-bold
            justify-center"><FontAwesomeIcon icon={faAngleLeft} /></button>
          <div className="w-[60rem] px-2 rounded-md bg-secondary-color  mr-16 flex flex-col text-white overflow-hidden relative">
            <div className="absolute right-4 overflow-hidden h-32 w-40">
              <img
                src={require("@/assets/emote/success.png")}
                alt="No Images Available"
                className="drop-shadow-customViolet h-40 -right-4 -top-4 relative opacity-40"
              />
            </div>
            <h1 className="text-2xl font-[iceland] z-20 mt-2">
              {" "}
              You are in <span className="font-bold">Guest</span> Mode{" "}
            </h1>
            <p className="text-sm z-20">
              Guest user can only Browse Items. To add Cart and Place Order you
              must Log In/Register First.
            </p>
            <div className="flex justify-center z-20">
              <button
                onClick={handleAuth}
                className="btn bg-primary-color btn-outline  p-1 h-8 min-h-8 text-white hover:bg-white hover:text-black w-40 drop-shadow-lg font-[iceland] my-2"
              >
                Login/Register
              </button>
            </div>
            </div>
          </div>
         
          <div className="flex flex-wrap  w-full justify-center mb-4   gap-2 ">
            <div className="relative flex flex-row w-full items-center justify-center">
              <div className="breadcrumbs text-2xl text-slate-500  font-[iceland]">
                <ul>
                  <li className="text-bold text-primary-color flex items-center gap-2">
                    START{" "}
                    <FontAwesomeIcon fontSize={16} icon={faShoppingCart} />{" "}
                    SHOPPING
                  </li>
                  <li className="text-bold text-secondary-color flex items-center gap-2">
                    STAR <FontAwesomeIcon fontSize={16} icon={faStar} />{" "}
                    DRIPPING
                  </li>
                </ul>
              </div>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestHome;
