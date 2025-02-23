import React from "react";

const VoucherStream = (profile) => {
  return (
    <div className="w-[90%]  rounded-md      flex flex-col text-secondary-color font-[iceland] relative">
      <div class=" bg-slate-50 flex gap-2 items-center rounded-md drop-shadow-sm p-2 border-primary-color border-t-2 h-14 glass w-72">
        <figure>
          <img
            src={require("@/assets/logoWhite.png")}
            alt="Logo"
            className="drop-shadow-customViolet h-10 "
          />
        </figure>
        <div className="absolute opacity-40 text-primary-color
             font-bold text-7xl left-14 -top-2 z-0">
            <p> Product</p>
              
            </div>
        <div class="flex justify-between gap-1 w-full items-center">
          <div className="w-full  flex flex-col justify-start
          ">
            <h2 class="text-3xl font-bold">Drip50</h2>
           
            <p className="">Exp Date:</p>
          </div>
          <div className="flex flex-col items-end">  
            <h3 className="text-lg font-bold">₱45</h3>
            <p className="">Min:100</p>
          
          </div>
          <div class=" justify-end z-50">
            <button class="btn btn-primary ">Claim now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherStream;
