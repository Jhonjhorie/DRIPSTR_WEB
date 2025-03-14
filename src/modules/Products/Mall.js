import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import CategoriesRibbon from "./components/CategoriesRibbon";
import ProductsView from "./components/ProductsView";
import useProducts from "./hooks/useProducts";
import SectionWrapper from "../Home/components/SectionWrapper";
import useUserProfile from "@/shared/mulletCheck";
// Data
import { categories } from "@/constants/categories.ts";

import { toBeInTheDocument } from "@testing-library/jest-dom/matchers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";

function Mall({ title2 }) {
    const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();
    const navigate = useNavigate()
   
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState(categories[0].label);
  
  const title = location.state?.title || title2 || "Dripstr";
  const filter = location.state?.filterM || 0;
  const icon = location.state?.icon || "faShoppingCart";
  const shopFil = location.state?.shopFil || 0;
  const { products, loading, error } = useProducts(isLoggedIn ? profile : null);
  return (
    <div className="w-full h-full bg-gray-100 rounded-lg flex flex-col">
      {/* Categories navigation */}
     
      <div className="w-full px-4 py-3 flex justify-center">
      <button 
                  onClick={() => navigate("/")}
                  className="w-4 px-2 sm:w-12  rounded-md bg-slate-50 flex items-center justify-center text-base sm:text-lg"
                >
                  <FontAwesomeIcon icon={faAnglesLeft} />
                </button> 
                <div className="w-full max-w-4xl">
        <CategoriesRibbon
          active={activeCategory}
          categories={categories}
          onItemClick={setActiveCategory}
        />
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 px-4 pb-6">
        <SectionWrapper
          title ={title}
          icon={icon}
          textColor="text-secondary-color"
        >
          <ProductsView
            products={products}
            shopFil={shopFil}
            categories={activeCategory}
            filter={filter}
            loading={loading}
            error={error}
            showItem={0}
            sort="top"
          />
        </SectionWrapper>
      </div>
    </div>
  );
}

export default Mall;