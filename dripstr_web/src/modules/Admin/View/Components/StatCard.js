import React from "react";

const StatCard = ({ icon: Icon, value, label }) => (
  <div className="bg-slate-900 w-full 2xl:h-5/6 rounded-3xl m-4 p-2 flex">
    <div className="flex items-center h-full mx-6">
      <div className="w-14 h-14 bg-violet-400 rounded-3xl flex items-center justify-center">
        <Icon className="w-10 h-10 text-white" />
      </div>
      <div className="flex flex-col mx-4">
        <p className="text-violet-400 font-bold text-4xl">{value}</p>
        <p className="text-violet-400 font-bold">{label}</p>
      </div>
    </div>
  </div>
);

export default StatCard;
