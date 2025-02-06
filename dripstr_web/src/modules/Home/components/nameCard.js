import React from "react";
import { Link } from "react-router-dom";
import useUserProfile from "@/shared/mulletCheck";

const NameCard = () => {
  const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();

  return (
    <Link className="flex bg-secondary-color rounded-md group drop-shadow-lg w-full  h-24  md:h-32  scale-100 duration-300 transition-all "
    to="account/profile"
    >
      <div className="flex flex-row gap-2 md:gap-2 p-2 md:p-3  h-full justify-start">
        <div className="flex flex-col gap-2 w-[15%] md:w-[50%] ">
          
            <img
              src={
                profile.profile_picture != null
                  ? typeof profile.profile_picture === "string"
                    ? profile.profile_picture
                    : profile.profile_picture
                  : require("@/assets/emote/success.png")
              }
              alt="User Avatar"
              className="z-20 duration-300 transition-all left-0 bottom-0 bg-gray-200 drop-shadow-lg rounded-b-lg hover:bottom-2 hover:scale-105 hover:-left-2 hover:rounded-2xl object-cover h-[130%] max-w-28 border-white border-2 "
            />
         
        </div>

        {/* User Info Section */}
        <div className="flex flex-row md:flex-col   w-full  h-full justify-between space-x-4 md:space-x-1">
            <div>
          <p className="text-slate-50 text-3xl font-bold">
            {profile.username || profile.full_name}
          </p>
          <p className="text-slate-50 text-sm mt-1">
            {profile.email}
          </p>
          </div>
          <p className="text-slate-50 text-lg semibold">
            Available Vouchers: {profile.shop_Vouchers?.length || 0}
          </p>
        </div>
      </div>
   

    </Link>
  );
};
export default NameCard;
