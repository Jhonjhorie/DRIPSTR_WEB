// src/pages/Home.js
import React from 'react';
import Carousel from './components/Carousel';
import AvatarCard from './components/AvatarCard';
// import CategoriesRibbon from '../components/products/CategoriesRibbon';
// import ProductsView from '../components/products/ProductsView';
import { currUser, Images } from '../../constants/sampleData';
function Home() { 

  return (
    <div className="h-[120vh] w-full relative">
      <div className="absolute inset-0 bg-slate-300 flex flex-col overflow-hidden">
        <div className="flex flex-col md:flex-row md:space-x-8 items-center p-4">
          <Carousel images={Images} />
          <AvatarCard user={currUser} />
        </div>
        {/* <div className="flex w-full justify-center py-4">
          {isMobile ? (
            <CategoriesRibbon active="all" />
          ) : (
            <CategoriesRibbon active="all" />
          )}
        </div> */}
        {/* <div className="flex flex-wrap justify-center gap-8">
          {isMobile ? (
            <ProductsView categories="all" />
          ) : (
            <ProductsView categories="all" />
          )}
        </div> */}
      </div>
    </div>
  );
}

export default Home;

