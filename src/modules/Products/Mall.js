import React, { useState } from "react";
import { useLocation } from "react-router-dom"; 
import CategoriesRibbon from "./components/CategoriesRibbon";
import ProductsView from "./components/ProductsView";
import useProducts from "./hooks/useProducts";
import SectionWrapper from "../Home/components/SectionWrapper";
import useUserProfile from "@/shared/mulletCheck";
// Data
import { categories } from "@/constants/categories.ts";

function Mall({ title2 }) {
    const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();
   
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState(categories[0].label);
  
  const title = location.state?.title || title2 || "Dripstr";
  const filter = location.state?.filterM || 0;
  const icon = location.state?.icon || "faShoppingCart";
  const { products, loading, error } = useProducts(isLoggedIn ? profile : null);
  return (
    <div className="w-full h-full bg-gray-100 rounded-lg flex flex-col">
      {/* Categories navigation */}
      <div className="w-full px-4 py-3">
        <CategoriesRibbon
          active={activeCategory}
          categories={categories}
          onItemClick={setActiveCategory}
        />
      </div>
      
      {/* Main content */}
      <div className="flex-1 px-4 pb-6">
        <SectionWrapper
          
         
          textColor="text-secondary-color"
        >
          <ProductsView
            products={products}
            shopFil={0}
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