import React from "react";
import questionEmote from "../../../assets/emote/success.png";

const AlertPrepare = ({ show }) => {
  if (!show) return null; 

  return (
    <div className="md:bottom-5 w-auto px-10 bottom-10 z-10 right-0 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
      <div className="absolute -top-48 left-28 -z-10 justify-items-center content-center">
        <div className="mt-10">
          <img
            src={questionEmote}
            alt="Success Emote"
            className="object-contain rounded-lg p-1 drop-shadow-customViolet"
          />
        </div>
      </div>
      <div
        role="alert"
        className="alert bg-custom-purple shadow-md flex items-center p-4 text-slate-50 font-semibold rounded-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Shop name is required!</span>
      </div>
    </div>
  );
};

export default AlertPrepare;
