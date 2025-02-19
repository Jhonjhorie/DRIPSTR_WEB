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
import { faStar, faShoppingCart, faStore, faTags } from "@fortawesome/free-solid-svg-icons";
import SectionWrapper from "./components/SectionWrapper";

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
       <div className="flex flex-wrap w-full px-10 justify-center items-center mb-4 gap-10 font-[iceland]">

      <SectionWrapper
        title="Discounted Products"
        icon={faTags}
        buttonText="See More"
        bgColor="bg-secondary-color"
         width="w-[45%]"
      >
        <ProductsView
          products={products}
          shopFil={0}
          categories={filCat}
          filter={3}
          loading={loading}
          error={error}
          showItem={3}
          sort="top"
         
        />
      </SectionWrapper>

      <SectionWrapper
        title="Followed Store"
        icon={faStore}
        buttonText="See More"
        bgColor="bg-stone-700"
          width="w-[45%]"
      >
        <ProductsView
          products={products}
          shopFil={0}
          categories={filCat}
          filter={filMall}
          loading={loading}
          error={error}
          showItem={3}
          sort={"top"}
        />
      </SectionWrapper>

      <SectionWrapper
        title="For You"
        icon={faShoppingCart}
        buttonText="Go to Mall"
        bgColor="bg-transparent"
        textColor="text-secondary-color"
      >
        <ProductsView
          products={products}
          shopFil={0}
          categories={filCat}
          filter={filMall}
          loading={loading}
          error={error}
          showItem={0}
          sort={"top"}

        />
      </SectionWrapper>
    </div>
    

      
    </div>
  );
}

export default Home;
