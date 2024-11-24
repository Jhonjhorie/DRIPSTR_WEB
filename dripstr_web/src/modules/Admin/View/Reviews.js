import React from "react";
import Sidebar from "./Shared/Sidebar";

function Reviews() {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="w-full h-screen flex-col">
        <div className="bg-slate-900 h-5/6 m-5 mt-20 flex flex-col rounded-3xl p-2 cursor-default">
          <p className="text-white text-2xl font-bold p-6">Reviews</p>
          <div className="flex h-full flex-col p-2 "></div>
        </div>
      </div>
    </div>
  );
}
export default Reviews;
