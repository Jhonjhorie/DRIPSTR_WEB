import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import { supabase } from "@/constants/supabase";

const MerchantFollow = ({ profile, shop, isLoggedIn }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    if (isLoggedIn && profile?.id && shop?.id) {
      fetchWishlist();
    }
  }, [isLoggedIn, profile, shop]);

  const fetchWishlist = async () => {
    const { data, error } = await supabase
      .from("merchant_Followers")
      .select("*")
      .eq("acc_id", profile.id)
      .eq("shop_id", shop.id);

    if (error) {
      console.error("Error fetching Followers:", error);
    } else {
      setIsInWishlist(data.length > 0);
    }
  };

  const toggleWishlist = async () => {
    if (!isLoggedIn || !profile?.id || !shop?.id) return;

    if (isInWishlist) {
      const { error } = await supabase
        .from("merchant_Followers")
        .delete()
        .eq("acc_id", profile.id)
        .eq("shop_id", shop.id);

      if (error) {
        console.error("Error removing from Followers:", error);
      } else {
        setIsInWishlist(false);
      }
    } else {
      const { error } = await supabase
        .from("merchant_Followers")
        .insert([{ acc_id: profile.id, shop_id: shop.id }]);

      if (error) {
        console.error("Error adding to Followers:", error);
      } else {
        setIsInWishlist(true);
      }
    }
  };

  return (
    <>
      {isLoggedIn && (
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
      )}
    </>
  );
};

export default MerchantFollow;