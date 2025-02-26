import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import { supabase } from "@/constants/supabase";

const WishlistButton = ({ profile, item, isLoggedIn }) => {
  const [isInWishlist, setIsInWishlist] = useState(false); // Track if the item is in the wishlist

  // Fetch wishlist on component mount
  useEffect(() => {
    if (isLoggedIn && profile?.id && item?.id) {
      fetchWishlist();
    }
  }, [isLoggedIn, profile, item]);

  // Fetch the user's wishlist and check if the item is in it
  const fetchWishlist = async () => {
    const { data, error } = await supabase
      .from("customer_wishlist")
      .select("*")
      .eq("acc_id", profile.id)
      .eq("prod_id", item.id);

    if (error) {
      console.error("Error fetching wishlist:", error);
    } else {
      setIsInWishlist(data.length > 0); // Set isInWishlist to true if the item is in the wishlist
    }
  };

  // Toggle wishlist (add or remove item)
  const toggleWishlist = async () => {
    if (!isLoggedIn || !profile?.id || !item?.id) return;

    if (isInWishlist) {
      // Remove item from wishlist
      const { error } = await supabase
        .from("customer_wishlist")
        .delete()
        .eq("acc_id", profile.id)
        .eq("prod_id", item.id);

      if (error) {
        console.error("Error removing from wishlist:", error);
      } else {
        setIsInWishlist(false); // Update state
      }
    } else {
      // Add item to wishlist
      const { error } = await supabase
        .from("customer_wishlist")
        .insert([{ acc_id: profile.id, prod_id: item.id }]);

      if (error) {
        console.error("Error adding to wishlist:", error);
      } else {
        setIsInWishlist(true); // Update state
      }
    }
  };

  return (
    <>
      {isLoggedIn && (
        <button
          onClick={toggleWishlist}
          className={`flex-none flex items-center justify-center w-8 h-8 rounded-md duration-300 transition-all border ${
            isInWishlist
              ? "bg-primary-color text-white border-primary-color"
              : "text-slate-400 border-slate-400 hover:text-slate-800 hover:border-slate-800"
          }`}
        >
          <FontAwesomeIcon icon={faHeart} />
        </button>
      )}
    </>
  );
};

export default WishlistButton;