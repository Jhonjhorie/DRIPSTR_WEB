// src/pages/Home.js
import React, { useState } from "react";
import Carousel from "./components/Carousel";
import CategoriesRibbon from "../Products/components/CategoriesRibbon";
import ProductsView from "../Products/components/ProductsView";
import MallRibbon from "../Products/components/MallRibbon";
import FilterProducts from "../Products/components/FilterProducts";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";

// Data
import { MallItems } from "@/constants/mallItems.ts";
import { categories } from "@/constants/categories.ts";
import { Images } from "@/constants/sampleData";
import useProducts from "../Products/hooks/useProducts";

function GuestHome() {
  const [filMall, setFilMall] = useState(0);
  const [filCat, setFilCat] = useState("Choose Categories");
  const { products, loading, error } = useProducts();

  const navigate = useNavigate();

  const handleShow = (action) => {
    if (action === "login") {
      navigate(`/login`);
    }
  };

  return (
    <div className="w-full relative flex flex-col">
      {/* Hero Section */}
      <div className="flex group flex-col-reverse w-full gap-8 md:gap-0 md:flex-row overflow-hidden items-start justify-center px-1 lg:p-4 bg-slate-300 min-h-[87vh]">
        <div className="pt-4  w-full">
          <div className="flex flex-col-reverse gap-8 md:gap-0 md:flex-row-reverse items-center justify-between px-1 lg:px-2 mt-1">
            <CategoriesRibbon
              active={filCat}
              categories={categories}
              onItemClick={(label) => setFilCat(label)}
            />
            <div className="w-full px-2 rounded-md bg-secondary-color m-4 flex flex-col text-white overflow-hidden relative">
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
                Guest user can only Browse Items. To add Cart and Place Order
                you must Log In/Register First.
              </p>
              <div className="flex justify-center z-20">
                <button
                  onClick={() => handleShow("login")}
                  className="btn bg-primary-color btn-outline  p-1 h-8 min-h-8 text-white hover:bg-white hover:text-black w-40 drop-shadow-lg font-[iceland] my-2"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap  w-full justify-center mb-4  p-4 gap-2 ">
            <div className="relative flex flex-row w-full items-center p-6 justify-end">
              <div className="breadcrumbs text-lg text-slate-500 font-serif absolute left-0 md:left-40">
                <ul>
                  <li className="text-bold text-primary-color">
                    {filMall === 0 ? "Drip Now" : MallItems[filMall].label}
                  </li>
                  <li className="text-bold text-secondary-color">
                    {filCat === categories[0].label ? "All" : filCat}
                  </li>
                </ul>
              </div>
              <FilterProducts />
            </div>
            <ProductsView
              products={products}
              categories={filCat}
              filter={filMall}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestHome;
