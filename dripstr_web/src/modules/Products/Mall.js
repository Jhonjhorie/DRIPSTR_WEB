import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import CategoriesRibbon from "./components/CategoriesRibbon";
import MallRibbon from "./components/MallRibbon";
import ProductsView from "./components/ProductsView";
import useProducts from "./hooks/useProducts";
import SectionWrapper from "../Home/components/SectionWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


// Data
import { MallItems } from "@/constants/mallItems.ts";
import { categories } from "@/constants/categories.ts";
import { searchProducts } from "@/utils/searchProducts";

function Mall() {
  const { products, loading, error } = useProducts();
  const location = useLocation();
  const [filCat, setFilCat] = useState(categories[0].label); 
  const filter = location.state?.filterM || 0;
const title = location.state?.title || "Dripstr";
const icon = location.state?.icon || "faShoppingCart";


  return (
    <div className="w-full  inset-0 items-center justify-start gap-2 h-full p-2 bg-slate-300 flex flex-col font-[iceland]">

         <div className="flex flex-col-reverse w-full gap-8 md:gap-0 md:flex-row-reverse items-center justify-center px-1 lg:px-2 mt-1 ">
        <CategoriesRibbon
          active={filCat}
          categories={categories}
          onItemClick={(label) => setFilCat(label)}
        />
      </div> 
    
      <div className="flex flex-wrap w-full px-10 justify-center items-center mb-4 gap-10 font-[iceland]">
        <SectionWrapper
          title={title}
          icon={icon}
          textColor="text-secondary-color"
        >
          <ProductsView
            products={products}
            shopFil={0}
            categories={filCat}
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
