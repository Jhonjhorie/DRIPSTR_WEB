// src/pages/Home.js
import React, { useState } from "react";
import Carousel from "./components/Carousel";
import NameCard from "./components/nameCard";
import CategoriesRibbon from "../Products/components/CategoriesRibbon";
import ProductsView from "../Products/components/ProductsView";
import MallRibbon from "../Products/components/MallRibbon";
import FilterProducts from "../Products/components/FilterProducts";
import LandingPage from "./Landing";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faShoppingCart, faStore } from "@fortawesome/free-solid-svg-icons";

//Data
import { MallItems } from "@/constants/mallItems.ts";
import { categories } from "@/constants/categories.ts";
import { Images } from "@/constants/sampleData";
import useProducts from "../Products/hooks/useProducts";
import useUserProfile from "@/shared/mulletCheck";
import InvitationCard from "./components/invitationCard";
import LoadingMullet from "@/shared/Loading";

function Home() {
  const [filMall, setFilMall] = useState(0);
  const [filCat, setFilCat] = useState(categories[0].label);
  const { products, loading, error } = useProducts();
  const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();

  if (loadingP) return <LoadingMullet />;

  if (!isLoggedIn) return <LandingPage />;

  return (
    <div className=" w-full relative inset-0 bg-slate-300 flex flex-col ">
      <div className="flex  gap-4 md:flex-row justify-center items-center p-4 h-[49%] lg:h-[48%]">
        <Carousel images={Images} />
      </div>
      {/* <div className="flex flex-col-reverse gap-8 md:gap-0 md:flex-row-reverse items-center justify-center px-1 lg:px-2 mt-1 ">
        <CategoriesRibbon
          active={filCat}
          categories={categories}
          onItemClick={(label) => setFilCat(label)}
        />
      </div> */}
      <div className="flex flex-wrap w-full px-10  justify-center mb-4 gap-4  font-[iceland]">
        <div className="min-w-[100%] bg-secondary-color drop-shadow-lg rounded-md p-2">
          <div
            className="flex justify-between text-2xl text-slate-500 
           items-start mb-1   font-[iceland]"
          >
            <p className="text-bold text-slate-50">
              TOP PRODUCTS <FontAwesomeIcon fontSize={16} icon={faStar} />
            </p>
            <button className="btn btn-outline bg-primary-color text-white min-h-7 h-7 px-4">See More</button>
          </div>
          <ProductsView
            products={products}
            shopFil={0}
            categories={filCat}
            filter={filMall}
            loading={loading}
            error={error}
            showItem={6}
            sort="top"
          />
        </div>
        <div className="min-w-[100%] bg-stone-700 drop-shadow-lg rounded-md p-2">
          <div
            className="flex justify-between text-2xl text-slate-500 
           items-start  mb-1 font-[iceland]"
          >
            <p className="text-bold text-slate-50">
              Followed Store <FontAwesomeIcon fontSize={16} icon={faStore} />
            </p>
            <button className="btn btn-outline bg-primary-color text-white min-h-7 h-7 px-4">See More</button>
          </div>
          <ProductsView
            products={products}
            shopFil={0}
            categories={filCat}
            filter={filMall}
            loading={loading}
            error={error}
            showItem={6}
          />
        </div>
        <div className="min-w-[100%] p-2">
          <div
            className="flex justify-between text-2xl text-slate-500 
           items-start  mb-2 font-[iceland]"
          >
            <p className="text-bold text-secondary-color">
              For You <FontAwesomeIcon fontSize={16} icon={faShoppingCart} />
            </p>
            <button className="btn btn-outline bg-primary-color text-white min-h-7 h-7 px-4">Go to Mall</button>
          </div>
          <ProductsView
            products={products}
            shopFil={0}
            categories={filCat}
            filter={filMall}
            loading={loading}
            error={error}
            showItem={0}
          />
        </div>
      </div>
       
    

      
    </div>
  );
}

export default Home;
