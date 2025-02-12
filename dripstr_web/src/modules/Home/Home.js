// src/pages/Home.js
import React,{useState} from "react";
import Carousel from "./components/Carousel";
import NameCard from "./components/nameCard";
import CategoriesRibbon from "../Products/components/CategoriesRibbon";
import ProductsView from "../Products/components/ProductsView";
import MallRibbon from "../Products/components/MallRibbon";
import FilterProducts from '../Products/components/FilterProducts';
import LandingPage from "./Landing";

//Data
import { MallItems } from "@/constants/mallItems.ts";
import { categories } from '@/constants/categories.ts';
import { Images } from "@/constants/sampleData";
import useProducts from "../Products/hooks/useProducts";
import useUserProfile from "@/shared/mulletCheck";
import InvitationCard from "./components/invitationCard";



function Home() {
  const [filMall, setFilMall] = useState(0);
  const [filCat, setFilCat] = useState(categories[0].label);
  const { products, loading, error } = useProducts();
  const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();

  if(!isLoggedIn) return <LandingPage />
  
  
  return (
    <div className=" w-full relative inset-0 bg-slate-300 flex flex-col ">
   
      <div className="flex flex-col-reverse gap-4 md:flex-row items-center p-4 h-[39%] lg:h-[38%]">
        <Carousel images={Images} />
        <div className="flex flex-col w-full md:w-1/3 lg:w-1/3 h-24 md:h-42 lg:h-80 justify-start gap-6">
        {isLoggedIn ?? 
        <div>
           <NameCard /> 
           <InvitationCard />
        </div>
        }
         
        </div>
        
      </div>
      <div className="flex flex-col-reverse gap-8 md:gap-0 md:flex-row-reverse items-center justify-between px-1 lg:px-2 mt-1 ">
      <CategoriesRibbon active={filCat} categories={categories} onItemClick={(label) => setFilCat(label)} />
       
        <MallRibbon active={filMall} items={MallItems} onItemClick={(index) => setFilMall(index)} />
      </div>
      <div className="flex flex-wrap justify-center mb-4 mt-0 md:mt-5  p-4 gap-2">
      <div className='relative flex flex-row w-full items-center p-6 justify-end'>
     
        <div className="breadcrumbs text-lg text-slate-500 font-serif  absolute left-0 md:left-40">
          <ul>
            <li className=" text-bold text-primary-color">{filMall === 0 ? 'Drip Now' :MallItems[filMall].label}</li>
            <li className=" text-bold  text-secondary-color">{filCat === categories[0].label ? 'Star Later' : filCat}</li>
          </ul>
        </div>
     
        <FilterProducts />
      </div>
      
        <ProductsView products={products}  categories={filCat} filter={filMall} loading={loading} error={error} />
      </div>
    </div>
  );
}

export default Home;
