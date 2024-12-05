import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; 
import CategoriesRibbon from "./components/CategoriesRibbon";
import MallRibbon from "./components/MallRibbon";
import ProductsView from "./components/ProductsView";

// Data
import { MallItems } from "@/constants/mallItems.ts";
import { categories } from "@/constants/categories.ts";
import { products } from "@/constants/sampleData";
import { searchProducts } from "@/utils/searchProducts";

function Search() {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [filMall, setFilMall] = useState(0); 
  const [filCat, setFilCat] = useState(categories[0].label); 
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("q") || ""; 
    setQuery(searchQuery);

    let result = searchProducts(searchQuery, products);
    result = result.filter((item) =>
      (filMall === 0 || item.mallId === MallItems[filMall]?.id) &&
      (filCat === categories[0].label || item.category === filCat)
    );

    setFilteredProducts(result);
  }, [location.search, filMall, filCat]);

  return (
    <div className="w-full relative inset-0 bg-slate-300 flex flex-col pt-2">
     
      <div className="flex flex-col-reverse gap-8 md:gap-0 md:flex-row-reverse items-center justify-between px-1 lg:px-2 mt-1">
        <CategoriesRibbon
          active={filCat}
          categories={categories}
          onItemClick={(label) => setFilCat(label)}
        />
        <MallRibbon
          active={filMall}
          items={MallItems}
          onItemClick={(index) => setFilMall(index)}
        />
      </div>
      <div className="flex flex-col-reverse mt-2 md:mt-12 bg-slate-50 mx-2 rounded-md gap-4 md:flex-row items-center justify-center p-4 ">
        <h1 className="text-xl font-bold">
          Search Results for "{query}"
        </h1>
      </div>

      <div className="flex flex-wrap justify-center mb-4 mt-0 md:mt-2 p-4 gap-2">
        <ProductsView
          products={filteredProducts}
          categories={filCat}
          filter={filMall}
        />
      </div>
    </div>
  );
}

export default Search;
