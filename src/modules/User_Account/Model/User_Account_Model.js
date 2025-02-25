import { useState, useEffect } from "react";
import { supabase } from "../../../constants/supabase";

const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get the authenticated user's session
        const { data: session, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session?.session?.user) throw new Error("User not logged in.");

        const userId = session.session.user.id;

        // Fetch user profile and addresses in a single request
        const { data, error: fetchError } = await supabase
          .from("profiles")
          .select(
            "id, full_name, email, mobile, birthday, gender, profile_picture, isMerchant, isArtist, address, shop_Vouchers, " +
            "addresses:addresses(id, address, postcode, is_default_shipping, created_at)"
          )
          .eq("id", userId)
          .single();

        if (fetchError) throw fetchError;

        setUserData(data);
      } catch (err) {
        setError(err.message || "Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { userData, loading, error };
};

export default useUserData;
