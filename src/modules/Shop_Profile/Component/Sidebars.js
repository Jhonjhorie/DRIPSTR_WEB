import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/shop/shoplogo.jpg";
import successEmote from "../../../assets/emote/success.png";
import { supabase } from "../../../constants/supabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBookBookmark, faBoxesPacking, faBoxesStacked, faEye, faBolt, faMessage, faPeopleGroup, faUserEdit, faWallet } from "@fortawesome/free-solid-svg-icons";

function SideBar() {
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [shopImageUrl, setShopImageUrl] = useState("");
  const [shopName, setShopName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchShopImage = async () => {
      try {
        // Get the current user session
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) {
          console.error("Error fetching user:", userError);
          setErrorMessage("Unable to fetch user session.");
          return;
        }

        const user = userData.user;
        if (!user) {
          console.error("No user logged in.");
          setErrorMessage("User not logged in.");
          return;
        }

        // Fetch shop image URL where user is the shop owner
        const { data, error } = await supabase
          .from("shop") 
          .select("shop_image, shop_name")
          .eq("owner_Id", user.id) 
          .single();

        if (error) {
          console.error("Error fetching shop image:", error.message);
          setErrorMessage("Unable to fetch shop image.");
          return;
        }

        if (data) {
          setShopImageUrl(data.shop_image);
          setShopName(data.shop_name);
        } else {
          console.warn("No shop data found for this user.");
          setErrorMessage("No shop image found.");
        }
      } catch (err) {
        console.error("Unexpected error:", err.message);
        setErrorMessage("An unexpected error occurred.");
      }
    };

    fetchShopImage();
  }, []);

  return (
    <div className="relative flex  md:mr-0" ref={navbarRef}>
      {/* <div
        className="dropdown  dropdown-bottom dropdown-end bg-slate-100 shadow-md border-2 border-primary-color 
    shadow-primary-color h-12 w-20 mt-2 rounded-md -ml-36 "
      >
          <img
            src={shopImageUrl || successEmote}
            alt="Shop Profile"
            className="object-cover h-full w-full rounded-sm"
          />
     
      </div> */}

      {/* Navbar */}
      <button
        className="fixed w-12 h-12 right-3 z-10 bg-custom-purple  glass text-white rounded-md m-2 shadow-lg"
        onClick={toggleSidebar}
      >
        <i className="fa-solid fa-bars"></i>
      </button>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
      <div
        className={`fixed top-0 right-0 w-72 h-full bg-slate-200 shadow-lg transform transition-transform duration-300 z-50 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className=" mt-16  md:mt-24 p-2">
          <div className="h-24 w-full rounded-md bg-slate-900">
            <div className="bg-slate-100 absolute top-24 md:top-32 mx-[22%]  w-1/2  rounded-full border-[3px]  border-slate-800 ">
              <img
                src={shopImageUrl || successEmote} 
                alt="Shop Logo"
                className="drop-shadow-custom object-cover rounded-full h-[135px] w-full"
              />
            </div>
            <div  onClick={() => navigate("/shop/Account")} data-tip="Edit Merchant Account" className=" text-white  p-2 tooltip tooltip-left duration-200 cursor-pointer">
            <FontAwesomeIcon icon={faUserEdit} /> 
            </div>
          </div>

          {shopName ? (
            <div className="text-slate-900 font-semibold pt-[30%]  text-center">
              {" "}
              {shopName}{" "}
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <span>Loading...</span>
            </div>
          )}

          <li
            onClick={() => navigate("/shop/MerchantDashboard")}
            className="flex justify-between items-center p-1 hover:bg-slate-300 mt-4 rounded-sm hover:duration-200 hover:text-violet-900 cursor-pointer "
          >
            <a className="block  text-base text-slate-900 w-full hover:text-primary-color cursor-pointer -pr-1">
              Dashboard
            </a>
            <FontAwesomeIcon icon={faBolt} /> 
          </li>

          <li
            onClick={() => navigate("/shop/MerchantProducts")}
            className="flex justify-between p-1 items-center hover:bg-slate-300 rounded-sm hover:duration-200 hover:text-violet-900 cursor-pointer "
          >
            <a className="block  text-base text-slate-900 w-full hover:text-primary-color cursor-pointer ">
              Products
            </a>
            <FontAwesomeIcon icon={faBoxesPacking} /> 
          </li>

          <li
            onClick={() => navigate("/shop/MerchantOrders")}
            className="flex justify-between p-1 items-center hover:bg-slate-300 rounded-sm hover:duration-200 hover:text-violet-900 cursor-pointer "
          >
            <a className="block  text-base text-slate-900 w-full hover:text-primary-color cursor-pointer ">
              Orders
            </a>
            <FontAwesomeIcon icon={faBoxesStacked} /> 
          </li>

          <li
            onClick={() => navigate("/shop/MerchantMessages")}
            className="flex justify-between p-1 items-center hover:bg-slate-300 rounded-sm hover:duration-200 hover:text-violet-900 cursor-pointer "
          >
            <a className="block  text-base text-slate-900 w-full hover:text-primary-color cursor-pointer ">
              Messages
            </a>
            <FontAwesomeIcon icon={faMessage} /> 
          </li>

          <li
            onClick={() => navigate("/shop/MerchantNotifications")}
            className="flex justify-between p-1 items-center hover:bg-slate-300 rounded-sm hover:duration-200 hover:text-violet-900 cursor-pointer "
          >
            <a className="block  text-base text-slate-900 w-full hover:text-primary-color cursor-pointer ">
              Notifications
            </a>
            <FontAwesomeIcon icon={faBell} /> 
          </li>

          <li
            onClick={() => navigate("/shop/MerchantFollowers")}
            className="flex justify-between p-1 items-center hover:bg-slate-300 rounded-sm hover:duration-200 hover:text-violet-900 cursor-pointer "
          >
            <a className="block  text-base text-slate-900 w-full hover:text-primary-color cursor-pointer ">
              Followers
            </a>
            <FontAwesomeIcon icon={faPeopleGroup} /> 
          </li>

          {/* <li
            onClick={() => navigate("/shop/Shop_profile")}
            className="flex justify-between p-1 items-center hover:bg-slate-300 rounded-sm hover:duration-200 hover:text-violet-900 cursor-pointer "
          >
            <a className="block  text-base text-slate-900 w-full hover:text-primary-color cursor-pointer ">
              Merchant Preview
            </a>
            <FontAwesomeIcon icon={faEye} /> 
          </li> */}
          <li
            onClick={() => navigate("/shop/MerchantWallet")}
            className="flex justify-between p-1 items-center hover:bg-slate-300 rounded-sm hover:duration-200 hover:text-violet-900 cursor-pointer "
          >
            <a className="block  text-base text-slate-900 w-full hover:text-primary-color cursor-pointer ">
              Merchant Wallet
            </a>
            <FontAwesomeIcon icon={faWallet} /> 
          </li>
          <li
            onClick={() => navigate("/shop/CommissionPage")}
            className="flex justify-between p-1 items-center hover:bg-slate-300 rounded-sm hover:duration-200 hover:text-violet-900 cursor-pointer "
          >
            <a className="block  text-base text-slate-900 w-full hover:text-primary-color cursor-pointer ">
              Commissions
            </a>
            <FontAwesomeIcon icon={faBookBookmark} /> 
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SideBar;
