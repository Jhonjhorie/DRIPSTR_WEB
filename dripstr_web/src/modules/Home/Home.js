// src/pages/Home.js
import React from 'react';
import Carousel from './components/Carousel';
import AvatarCard from './components/AvatarCard';
import CategoriesRibbon from '@/shared/products/CategoriesRibbon';
import ProductsView from '../Products/components/ProductsView';
import { currUser, Images } from '@/constants/sampleData';
function Home() { 

  return (
    <div className=" w-full relative inset-0 bg-slate-300 flex flex-col ">
        <div className="flex flex-col-reverse gap-4 md:flex-row items-center p-4 h-[39%] lg:h-[38%]">
          <Carousel images={Images} />
          <AvatarCard user={currUser} />
        </div>
        <div className="flex items-center justify-center ">
            <CategoriesRibbon active="All" />
        </div> 
        <div className="flex flex-wrap justify-center mb-4 p-4 gap-8">
            <ProductsView categories="all" />
        </div> 
    
    </div>
  );
}

export default Home;

