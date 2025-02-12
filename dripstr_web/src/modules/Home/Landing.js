// src/pages/Home.js
import React, { useState } from "react";
import Carousel from "./components/Carousel";
import CategoriesRibbon from "../Products/components/CategoriesRibbon";
import ProductsView from "../Products/components/ProductsView";
import MallRibbon from "../Products/components/MallRibbon";
import FilterProducts from "../Products/components/FilterProducts";
import { useNavigate } from "react-router-dom";

// Data
import { MallItems } from "@/constants/mallItems.ts";
import { categories } from "@/constants/categories.ts";
import { Images } from "@/constants/sampleData";
import useProducts from "../Products/hooks/useProducts";

function LandingPage() {
  const [filMall, setFilMall] = useState(0);
  const [filCat, setFilCat] = useState("Choose Categories");
  const { products, loading, error } = useProducts();
  const [showShop, setShowShop] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const navigate = useNavigate();

  const handleShow = (action) => {
    if (action === "login") {
      navigate(`/login`);
    } else if (action === "shop") {
      setShowShop(true);
      setShowAbout(false);
    } else if (action === "about") {
      setShowAbout(true);
      setShowShop(false);
    }
  };

  return (
    <div className="w-full relative inset-0 bg-slate-300 flex flex-col">
      {/* Hero Section */}
      <div className="flex group flex-col-reverse gap-8 md:gap-0 md:flex-row overflow-hidden items-center justify-center px-1 lg:p-4 bg-slate-50">
        <img
          src={require("@/assets/images/home/dripMasa.png")}
          alt="No Images Available"
          className="object-cover w-[95%] rounded-lg h-[400px]"
        />
        <img
          src={require("@/assets/images/home/DrpTxt.png")}
          alt="No Images Available"
          className="absolute object-none mb-2 mt-1 w-full z-10 h-[400px] drop-shadow-customViolet right-10 group-hover:right-80 scale-100 group-hover:scale-50 group-hover:drop-shadow-customWhite transition-all duration-300"
        />
        <div className="absolute font-[iceland] text-white top-10 text-xl duration-300 transition-all group-hover:text-3xl tracking-[2rem] text-center">
          <h1>WELCOME</h1>
          <h1>TO</h1>
        </div>
        <div className="absolute right-40 h-40 w-96 overflow-hidden flex">
          <p className="font-[iceland] absolute right-[-10rem] w-96 text-white group-hover:right-0 transition-all opacity-0 group-hover:opacity-100 duration-300">
            <span className="font-bold text-lg text-primary-color">DRIPSTR</span>{" "}
            provides a unique and immersive online shopping experience by
            integrating 3D apparel visualization and avatar-based sizing to ensure
            the perfect fit and style. Whether you’re looking for custom-designed
            apparel or exclusive digital assets, DRIPSTR makes shopping seamless
            and enjoyable.
          </p>
        </div>
        <div className="h-40 w-1 group-hover:drop-shadow-customViolet drop-shadow-custom duration-300 transition-all bg-white absolute right-36 rounded-lg"></div>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-col-reverse gap-4 md:flex-row justify-evenly bg-slate-50 items-center p-4 h-[39%] lg:h-[38%] font-[iceland]">
        <div className="flex justify-center text-center flex-col gap-2">
          <p className="text-lg">Already have an account?</p>
          <button
            onClick={() => handleShow("login")}
            className="btn bg-primary-color glass text-white hover:bg-secondary-color drop-shadow-lg font-[iceland] text-2xl w-56"
          >
            Login
          </button>
        </div>
        <div className="flex justify-center text-center flex-col gap-2">
          <p className="text-lg">Browse Shop as a Guest?</p>
          <button
            onClick={() => handleShow("shop")}
            className="btn bg-primary-color glass text-white hover:bg-secondary-color drop-shadow-lg font-[iceland] text-2xl w-56"
          >
            Browse Shop
          </button>
        </div>
        <div className="flex justify-center text-center flex-col gap-2">
          <p className="text-lg">More about Dripstr?</p>
          <button
            onClick={() => handleShow("about")}
            className="btn bg-primary-color glass text-white hover:bg-secondary-color drop-shadow-lg font-[iceland] text-2xl w-56"
          >
            About Dripstr
          </button>
        </div>
      </div>

      {/* Shop Section */}
      {showShop && (
        <div className="pt-4">
          <div className="flex flex-col-reverse gap-8 md:gap-0 md:flex-row-reverse items-center justify-between px-1 lg:px-2 mt-1">
            <CategoriesRibbon
              active={filCat}
              categories={categories}
              onItemClick={(label) => setFilCat(label)}
            />
            <div className="w-full px-2 rounded-md bg-secondary-color m-4 flex flex-col text-white overflow-hidden">
              <div className=" absolute left-96 overflow-hidden h-32   w-40">
            <img
          src={require("@/assets/emote/success.png")}
          alt="No Images Available"
          className=" drop-shadow-customViolet h-40 right-0 opacity-40 -top-4  absolute"
        />
        </div>
            <h1 className="text-2xl font-[iceland] z-20 mt-2"> You are in <span className="font-bold">Guest</span> Mode </h1>
            <p className="text-sm z-20">Guest user can only Browse Items. To add Cart and Place Order you must Log In/Register First.</p>
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
          <div className="flex flex-wrap justify-center mb-4 mt-0 md:mt-5 p-4 gap-2">
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
      )}

      {/* About Section */}
      {showAbout && (
        <div className="w-full p-8 bg-slate-50">
          <h2 className="text-3xl font-bold text-center mb-8 font-[iceland]">
            What is Dripstr?
          </h2>
          <div className="join join-vertical w-full">
            {/* Accordion Item 1: Browse & Discover Products */}
            <div className="collapse collapse-arrow join-item border border-base-300 glass bg-secondary-color text-white">
              <input type="radio" name="dripstr-accordion"  />
              <div className="collapse-title text-xl font-medium">
                Browse & Discover Products
              </div>
              <div className="collapse-content">
                <p>
                  Explore a wide collection of custom apparel designed by
                  merchants.
                </p>
                <p>Shop for exclusive digital assets created by artists.</p>
                <p>Use filters and categories to find the perfect design.</p>
              </div>
            </div>

            {/* Accordion Item 2: Try Before You Buy */}
            <div className="collapse collapse-arrow join-item border border-base-300 glass bg-secondary-color text-white">
              <input type="radio" name="dripstr-accordion" />
              <div className="collapse-title text-xl font-medium">
                Try Before You Buy (Virtual Fitting)
              </div>
              <div className="collapse-content">
                <p>Create a personalized avatar based on your measurements.</p>
                <p>
                  Use 3D previews to see how clothes fit and look before
                  purchasing.
                </p>
              </div>
            </div>

            {/* Accordion Item 3: Customize Your Order */}
            <div className="collapse collapse-arrow join-item border border-base-300 glass bg-secondary-color text-white">
              <input type="radio" name="dripstr-accordion" />
              <div className="collapse-title text-xl font-medium">
                Customize Your Order (If Available)
              </div>
              <div className="collapse-content">
                <p>
                  Select sizes, colors, and styles from merchant-offered
                  options.
                </p>
              </div>
            </div>

            {/* Accordion Item 4: Secure Checkout & Payment */}
            <div className="collapse collapse-arrow join-item border border-base-300 glass bg-secondary-color text-white">
              <input type="radio" name="dripstr-accordion" />
              <div className="collapse-title text-xl font-medium">
                Secure Checkout & Payment
              </div>
              <div className="collapse-content">
                <p>Add items to your cart and proceed to secure checkout.</p>
                <p>Multiple payment options available for convenience.</p>
                <p>Receive order confirmation and tracking details.</p>
              </div>
            </div>

            {/* Accordion Item 5: Track & Receive Your Order */}
            <div className="collapse collapse-arrow join-item border border-base-300 glass bg-secondary-color text-white">
              <input type="radio" name="dripstr-accordion" />
              <div className="collapse-title text-xl font-medium">
                Track & Receive Your Order
              </div>
              <div className="collapse-content">
                <p>Monitor your order status through your account.</p>
                <p>Get updates on shipping and estimated delivery times.</p>
                <p>Enjoy your customized, perfectly fitted apparel! 🎉</p>
              </div>
            </div>
          </div>
        </div>
      
      )}
    </div>
  );
}

export default LandingPage;