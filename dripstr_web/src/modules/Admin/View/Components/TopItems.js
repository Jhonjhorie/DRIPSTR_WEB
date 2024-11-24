import React from "react";

const TopItems = ({ image, price, label, soldCount }) => (
  <div className="bg-slate-600 w-1/6 m-2 h-5/6 flex items-center transition-transform duration-500 hover:scale-125 align-middle justify-center">
    <img
      src={image}
      alt={label}
      className="w-12 h-12 object-cover rounded-full"
    />
    <div className="ml-2">
      <p>{label}</p>
      <p>Sold: {soldCount}</p>
      <p>Price: {price}</p>
    </div>
  </div>
);

export default TopItems;
