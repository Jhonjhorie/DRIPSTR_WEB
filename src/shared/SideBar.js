import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabase } from "../constants/supabase";
import {
  faHome,
  faUser,
  faStore,
  faBell,
  faPalette,
  faPaintBrush,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import AuthModal from "./login/Auth";
import { useNotification } from '../utils/NotificationContext';

const SideBar = () => {
  const [activeName, setActiveName] = useState("Home");
  const [isMerchant, setIsMerchant] = useState(false);
  const [isArtist, setIsArtist] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { notifications } = useNotification();
  
  // Calculate unread notifications
  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  useEffect(() => {
    // Fetch the current user profile and check if they are a merchant or artist
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
          setIsMerchant(profiles?.isMerchant || false); // Set the isMerchant state
          setIsArtist(profiles?.isArtist || false); // Set the isArtist state
        }
      } else {
        console.log("No user is signed in");
      }
    };

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
    fetchUserProfile();
  }, []);

  const handleAccountClick = (e) => {
    e.preventDefault();
    if (!user) {
      setIsAuthModalOpen(true); // Open the auth modal if user is not logged in
    } else {
      navigate("/account"); // Redirect to /account if user is logged in
      setActiveName("Account");
    }
  };

  if (location.pathname.startsWith('/admin')) {
    return null; // Don't render anything if the route is "/admin/*"
  }

  const mainSideBar = [
    { label: "Home", path: "/", icon: faHome },
    { label: "Arts", path: "/arts/Artists", icon: faPalette },
    { 
      label: "Notification", 
      path: "/notification", 
      icon: faBell,
      badge: unreadCount 
    },
    ...(isMerchant ? [{ label: "Shop", path: "/shop/MerchantDashboard", icon: faStore }] : []),
    ...(isArtist ? [{ label: "Artist", path: "/shop/Artist/ArtistDashboard", icon: faPaintBrush }] : []),
    { label: user ? "Account" : "Login/SignIn", path: user ? "/account" : "#", icon: faUser, onClick: handleAccountClick, },
  ];

  return (
    <>
      <div className="flex sm:flex-col flex-row justify-evenly sm:justify-center sticky sm:fixed items-start bg-slate-50 p-1 sm:p-2 rounded-t-lg sm:rounded-none w-full sm:w-10 sm:h-screen h-12 left-0 top-4 drop-shadow-sm sm:hover:w-48 duration-300 transition-all z-20 overflow-hidden gap-2">
        {mainSideBar.map((item, index) => (
          <Link
            key={index}
            onClick={(e) => {
              if (item.onClick) item.onClick(e); // Handle onClick if defined
              setActiveName(item.label); // Set the active label
            }}
            to={item.path}
            className="flex gap-4 py-2 rounded-md group justify-center items-center relative"
          >

            <div className="flex justify-center items-center w-6 relative">
              <FontAwesomeIcon
                icon={item.icon}
                className={`${
                  activeName === item.label
                    ? "text-primary-color"
                    : "text-slate-500"
                } group-hover:text-primary-color`}
                size="lg"
              />
              {item.badge > 0 && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {item.badge > 99 ? '99+' : item.badge}
                </div>
              )}
            </div>
            <span
              className={`${
                activeName === item.label
                  ? "text-primary-color font-bold"
                  : "text-slate-500"
              } sm:flex hidden text-sm font-semibold group-hover:text-primary-color group-hover:font-bold`}
            >
              {item.label}
              {item.badge > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </span>
          </Link>
        ))}
         <Link

            to={"/download_studio"}
            className="absolute gap-4 bottom-10 hidden sm:flex py-2 rounded-md group justify-center items-center overflow-hidden "
          >

            <div className="flex justify-center items-center w-6 relative">
              <FontAwesomeIcon
                icon={faDownload}
                className={`${
                  activeName === "Download"
                    ? "text-primary-color"
                    : "text-slate-500"
                } group-hover:text-primary-color`}
                size="lg"
              />
              
            </div>
            <span
              className={`${
                activeName === "Download"
                  ? "text-primary-color font-bold"
                  : "text-slate-500"
              } sm:flex hidden text-sm font-semibold group-hover:text-primary-color group-hover:font-bold truncate`}
            >
              Download Studio
             
            </span>
          </Link>
      </div>

      {/* Auth Modal - Moved outside the sidebar container */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default SideBar;