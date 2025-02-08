import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabase } from "../constants/supabase";  
import {
  faHome,
  faUser,
  faShop,
  faStore,
  faBell,
  fapalette,
  faPalette,
  faWandMagicSparkles,
  faPaintBrush
} from "@fortawesome/free-solid-svg-icons";

const SideBar = () => {
  const [activeName, setActiveName] = useState("Home");
  const [isMerchant, setIsMerchant] = useState(false); 
  const [isArtist, setIsArtist] = useState(false);

  useEffect(() => {
    // Fetch the current user profile and yung IsMerchant == false ELSE == True
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log("Current user:", user);
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("isMerchant, isArtist")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile data:", error);
        } else {
          console.log("Profile data:", profiles);
          setIsMerchant(profiles?.isMerchant || false); // Set the isMerchant state
          setIsArtist(profiles?.isArtist || false); // Set the isMerchant state
        }
      } else {
        console.log("No user is signed in");
      }
    };
    fetchUserProfile();
  }, []); 


  const mainSideBar = [
    { label: 'Home', path: '/', icon: faHome },
    { label: 'Arts', path: '/arts/Artists', icon: faPalette },
    { label: 'Notification', path: '/notification', icon: faBell },
    { label: 'Account', path: '/account', icon: faUser },
    ...(isMerchant ? [{ label: 'Shop', path: '/shop/MerchantDashboard', icon: faStore }] : []),
    ...(isArtist ? [{ label: 'Artist', path: '/shop/Artist/ArtistDashboard', icon: faPaintBrush }] : []),
  ];

  return (
    <div className="flex sm:flex-col flex-row justify-evenly sm:justify-center sticky sm:fixed items-start bg-slate-50 p-1 sm:p-2 rounded-t-lg sm:rounded-none w-full sm:w-10 sm:h-screen h-12 left-0 top-4 drop-shadow-sm sm:hover:w-48 duration-300 transition-all z-20 overflow-hidden gap-2">
      {mainSideBar.map((item, index) => (
        <Link
          key={index}
          onClick={() => setActiveName(item.label)} // Update activeName when a link is clicked
          to={item.path}
          className="flex gap-4 py-2 rounded-md group justify-center items-center"
        >
          <div
            className={`${
              activeName === item.label ? "bg-primary-color" : "hidden"
            } absolute bottom-0 sm:bottom-auto sm:left-0 w-10 h-1 sm:w-1 sm:h-10 z-40 rounded-t-lg sm:rounded-r-lg`}
          />
          <div className="flex justify-center items-center w-6">
            <FontAwesomeIcon
              icon={item.icon}
              className={`${
                activeName === item.label
                  ? "text-primary-color"
                  : "text-slate-500"
              } group-hover:text-primary-color`}
              size="lg"
            />
          </div>
          <span
            className={`${
              activeName === item.label
                ? "text-primary-color font-bold"
                : "text-slate-500"
            } sm:flex hidden text-sm font-semibold group-hover:text-primary-color group-hover:font-bold`}
          >
            {item.label}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default SideBar;
