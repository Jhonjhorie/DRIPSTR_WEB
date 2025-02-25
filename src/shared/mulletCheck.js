import { useState, useEffect } from "react";
import { supabase } from "@/constants/supabase";

const useUserProfile = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    mobile: "",
    birthday: "",
    gender: "",
    profile_picture: "",
  });

  const [originalProfile, setOriginalProfile] = useState(null);
  const [loadingP, setLoadingP] = useState(true);
  const [errorP, setErrorP] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const { data: session, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;
      if (!session || !session.session || !session.session.user) {
        throw new Error("User not logged in or session invalid.");
      }

      const userId = session.session.user.id;

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, email, mobile , birthday, gender, profile_picture")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      setProfile(data);
      setOriginalProfile(data);
      setIsLoggedIn(true);
    } catch (err) {
      setErrorP(err.message || "An error occurred while fetching the profile.");
    } finally {
      setLoadingP(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return { profile, originalProfile, loadingP, errorP, isLoggedIn };
};

export default useUserProfile;