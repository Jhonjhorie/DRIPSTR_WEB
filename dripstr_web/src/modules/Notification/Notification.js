// src/pages/Home.js
import React,{useState} from "react";
import CategoriesRibbon from "../Products/components/CategoriesRibbon";
import ProductsView from "../Products/components/ProductsView";
import MallRibbon from "../Products/components/MallRibbon";
import FilterProducts from '../Products/components/FilterProducts';


//Data
import { MallItems } from "@/constants/mallItems.ts";
import { categories } from '@/constants/categories.ts';
import { currUser, Images } from "@/constants/sampleData";
import useProducts from "../Products/hooks/useProducts";



function Notification() {
  
  return (
    <div className=" w-full relative inset-0 bg-slate-300 flex flex-col ">
      <div className="flex flex-col-reverse gap-4 md:flex-row items-center p-4 h-[39%] lg:h-[38%]">
        
      </div>
      <div className="flex flex-col-reverse gap-8 md:gap-0 md:flex-row-reverse items-center justify-between px-1 lg:px-2 mt-1 ">
       
      </div>
      <div className="flex flex-wrap justify-center mb-4 mt-0 md:mt-5  p-4 gap-2">
      
      </div>
    </div>
  );
}

export default Notification;
