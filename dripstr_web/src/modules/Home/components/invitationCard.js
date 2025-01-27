import React from "react";
import { Link } from "react-router-dom";
import useUserProfile from "@/shared/mulletCheck";

const InvitationCard = () => {
  const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();

  return (
    <div className="flex  flex-row gap-12 justify-start w-full h-24 md:h-42 lg:h-40 ">
      <div className="flex flex-row gap-1 md:gap-2 p-2 md:p-3 w-[40%] h-full justify-start rounded-md bg-primary-color drop-shadow-lg scale-100 transition-all duration-300 hover:scale-110"
      
      >
        <div className="flex flex-col justify-between ">
            <div className="flex flex-col w-48 ">
        <p className="text-[1.125rem] text-white font-semibold">Become a</p>
        <p className="text-[2.5rem] text-white font-bold drop-shadow-2xl">Merchant</p>
        </div>
        <Link 
        className="btn glass btn-outline text-white text-md font-semibold"
        to="account/shop-setup"> 
        
        Set up Shop</Link>
            <img 
            src={require("@/assets/emote/success.png")}
            className="absolute left-10 opacity-30 -z-10 object-contain w-32"
            />
        </div>

        
      </div>
      <div className="flex flex-row gap-1 md:gap-2 p-2 md:p-3 w-[40%] h-full justify-start rounded-md bg-secondary-color drop-shadow-lg scale-100 transition-all duration-300 hover:scale-110"
      
      >
        <div className="flex flex-col justify-between ">
        <div className="flex flex-col w-48">
        <p className="text-[1.125rem] text-white font-semibold">Become a</p>
        <p className="text-[2.5rem] text-white font-bold drop-shadow-2xl">Artist</p>
        </div>
        <Link 
        className="btn glass btn-outline text-white text-md font-semibold"
        to="/"> 
        
        Get Dripstr Studio</Link>
            <img 
            src={require("@/assets/logoWhite.png")}
            className="absolute right-2 opacity-30 -z-10 object-contain w-32"
            /> 
        </div>

        
      </div>
   

    </div>
  );
};
export default InvitationCard;
