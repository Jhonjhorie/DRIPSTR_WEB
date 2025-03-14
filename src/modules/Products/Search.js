import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CategoriesRibbon from "./components/CategoriesRibbon";
import MallRibbon from "./components/MallRibbon";
import ProductsView from "./components/ProductsView";
import useProducts from "./hooks/useProducts";
import SectionWrapper from "../Home/components/SectionWrapper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import useUserProfile from "@/shared/mulletCheck";

// Data
import { MallItems } from "@/constants/mallItems.ts";
import { categories } from "@/constants/categories.ts";
import { searchProducts } from "@/utils/searchProducts";

function Search() {
  const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();
  const { products, loading, error } = useProducts(isLoggedIn ? profile : null);
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [filMall, setFilMall] = useState(0);
  const [filCat, setFilCat] = useState(categories[0].label);
  const [filteredProducts, setFilteredProducts] = useState(products);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("q") || "";
    setQuery(searchQuery);
  }, [location.search]);

  useEffect(() => {
    if (!products || products.length === 0) return;

    let result = searchProducts(query, products);

    setFilteredProducts(result);
  }, [query, products, filMall, filCat]); 

  return (
    <div className="w-full  inset-0 items-center justify-start gap-2 h-full p-2 bg-gray-100 flex flex-col ">
      <div className="flex flex-col-reverse w-[80%]  text-slate-50 bg-secondary-color mx-2 rounded-md gap-4 md:flex-row items-center justify-center p-4 ">
        <h1 className="text-xl ">Search Results for "{query}"</h1>
      </div>
     <div className="w-full px-4 py-3 flex justify-center">
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
        />
        </div>
      </div> 
      <SectionWrapper title={`Search Results for ${query}`} icon={faSearch}>
        <ProductsView
          shopFil={0}
          sort="top"
          products={filteredProducts}
          categories={filCat}
          filter={filMall}
          loading={loading}
          error={error}
          showItem={0}
        />
      </SectionWrapper>

      {/* <div className="flex flex-wrap justify-center mb-4 mt-0 md:mt-2 p-4 gap-2">
        <ProductsView
          products={filteredProducts}
          categories={filCat}
          filter={filMall}
          loading={loading}
          error={error}
            showItem={0}
            shopFil={0}
        />
      </div> */}
    </div>
  );
}

export default Search;
