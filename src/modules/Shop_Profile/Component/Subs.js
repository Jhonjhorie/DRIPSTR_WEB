import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../../constants/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown} from "@fortawesome/free-solid-svg-icons";

function Subs() {
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch shop details
  useEffect(() => {
    const fetchUserProfileAndShop = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw authError;
        if (!user) throw new Error("No user signed in");

        const { data: shops, error: shopError } = await supabase
          .from("shop")
          .select("id, shop_name, is_Premium")
          .eq("owner_Id", user.id);

        if (shopError) throw shopError;
        if (shops.length === 0) throw new Error("No shop found for this user");

        setShopData(shops[0].is_Premium === true);
      } catch (error) {
        console.error("Error fetching shop:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfileAndShop();
  }, []);

  return (
    <div className="">
      {shopData && (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-black text-yellow-400 rounded-full text-sm font-medium">
          <FontAwesomeIcon icon={faCrown} /> Premium Merchant
        </span>
      )}
    </div>
  );
}

export default Subs;
