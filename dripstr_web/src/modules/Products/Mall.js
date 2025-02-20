import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import CategoriesRibbon from "./components/CategoriesRibbon";
import MallRibbon from "./components/MallRibbon";
import ProductsView from "./components/ProductsView";
import useProducts from "./hooks/useProducts";

// Data
import { MallItems } from "@/constants/mallItems.ts";
import { categories } from "@/constants/categories.ts";
import { searchProducts } from "@/utils/searchProducts";

function Mall(filter) {
  const { products, loading, error } = useProducts();
  const location = useLocation();
  const [filCat, setFilCat] = useState(categories[0].label); 
  const [filteredProducts, setFilteredProducts] = useState(products);


  return (
    <div className="w-full  inset-0 items-center justify-start gap-2 h-full p-2 bg-slate-300 flex flex-col font-[iceland]">

         <div className="flex flex-col-reverse w-full gap-8 md:gap-0 md:flex-row-reverse items-center justify-center px-1 lg:px-2 mt-1 ">
        <CategoriesRibbon
          active={filCat}
          categories={categories}
          onItemClick={(label) => setFilCat(label)}
        />
      </div> 

      
      <div className="flex flex-wrap justify-center mb-4 mt-0 md:mt-2 p-4 gap-2">
        <ProductsView
          products={filteredProducts}
          categories={filCat}
          filter={filter}
          loading={loading}
          error={error}
            showItem={0}
            shopFil={0}
        />
      </div>
    </div>
  );
}

export default Mall;
