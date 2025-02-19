import React from "react";


function LoadingMullet() {

    return (
      <div className="w-full relative pb-16 items-center justify-center bg-slate-300 flex flex-col gap-2 px-2 lg:px-8 h-[100%] py-4">
         <img
        src={require("@/assets/emote/hmmm.png")}
          alt="No Images Available"
          className="object-none mb-2 mt-1 max-w-[180px] max-h-[200px] drop-shadow-customViolet animate-pulse"
        />
        <h1 className="top-20 bg-primary-color p-4 rounded-md drop-shadow-lg">
          Loading...
        </h1>
        
      </div>
    );
  
}

export default LoadingMullet;