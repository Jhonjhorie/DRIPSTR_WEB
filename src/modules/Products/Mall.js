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

function Mall({title2}) {
  const { products, loading, error } = useProducts();
  const location = useLocation();
  const [filCat, setFilCat] = useState(categories[0].label); 
  const title = location.state?.title != null ? location.state?.title : title2 != null ? title2 : "Dripstr";
  const filter = location.state?.filterM || 0;
const icon = location.state?.icon || "faShoppingCart";



  return (
    <div className="w-full  inset-0 h-full  bg-slate-300 flex flex-col ">

         <div className="flex flex-col-reverse w-full gap-8 md:gap-0 md:flex-row-reverse items-center justify-center px-1 lg:px-2 mt-1 ">
        <CategoriesRibbon
          active={filCat}
          categories={categories}
          onItemClick={(label) => setFilCat(label)}
        />
      </div> 
      <div className="flex flex-col lg:flex-row  flex-wrap w-full px-10 justify-center items-center mb-4 gap-10 ">
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
