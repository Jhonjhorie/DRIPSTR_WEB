import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import { supabase } from "@/constants/supabase";

const MerchantFollow = ({ toggleWishlist, isInWishlist }) => {

  return (
    <>
      
        <button
          onClick={toggleWishlist}
        
          className={`flex-none flex items-center justify-center h-10 px-2 gap-1 rounded-md duration-300 transition-all border ${
            isInWishlist
              ? "bg-primary-color text-white border-primary-color"
              : "text-slate-400 border-slate-400 hover:text-slate-800 hover:border-slate-800"
          }`}
        >
          <FontAwesomeIcon icon={faHeart} /> {isInWishlist ? "Followed" : "Follow"}
        </button>
    </>
  );
};

export default MerchantFollow;