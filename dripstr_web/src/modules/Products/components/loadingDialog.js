import React from "react";

const LoadingDialog = () => {
  <div className="w-[60.40rem] rounded-lg relative pb-16 items-center justify-center bg-slate-100 flex flex-col gap-2 px-2 lg:px-8 h-auto py-4">
    <img
      src={require("@/assets/emote/hmmm.png")}
      alt="No Images Available"
      className="object-none mb-2 mt-1 w-[180px] h-[200px] drop-shadow-customViolet animate-pulse"
    />
    <h1 className="top-20 font-[iceland] font-semibold text-3xl p-4 rounded-md drop-shadow-lg">
      Loading
    </h1>
  </div>;
};

export default LoadingDialog;

