// src/pages/Mall.js

import React from 'react';

import ProductsView from './components/ProductsView';

function Mall() { 

  return (
    <div className=" w-full relative inset-0 bg-slate-300 flex flex-col gap-2 px-2 py-4 ">
        <div className="flex items-center justify-center">
       
        </div>
        <div className="flex items-center justify-center">
       
        </div> 
        <div className="flex flex-wrap justify-center mb-4 p-4 gap-8">
            <ProductsView categories="all" />
        </div> 
    
    </div>
  );
    
}

export default Mall;
