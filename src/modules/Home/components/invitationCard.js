import React from "react";
import { Link } from "react-router-dom";
import useUserProfile from "@/shared/mulletCheck";

const InvitationCard = (profile, loadingP, errorP, isLoggedIn) => {
  const {} = useUserProfile();

  return (
    <div className="flex flex-row gap-2 justify-center md:justify-end w-full h-auto">
      {/* Merchant Invitation */}
      <div className="flex flex-row gap-1 p-2 w-full md:w-auto h-auto justify-start items-center rounded-md bg-secondary-color drop-shadow-lg scale-100 transition-all duration-300 overflow-hidden">
        <div className="flex flex-col w-40 md:w-52">
          <p className="text-[0.5rem] md:text-[0.75rem] text-white font-semibold">
            Turn Your Passion Into Profit
          </p>
          <p className="ml-2 text-[0.7rem] md:text-[1rem] text-white font-bold drop-shadow-2xl">
            Become a Merchant
          </p>
        </div>
        <Link
          className="btn glass btn-outline text-white text-xs md:text-md font-semibold w-16 md:w-[7rem] px-1 py-1 md:px-4 md:py-2"
          to="account/shop-setup"
        >
          Set up Shop
        </Link>
        <img
          src={require("@/assets/logoWhite.png")}
          className="absolute right-10 md:right-20 -top-4 md:-top-6 opacity-30 -z-10 object-contain w-20 md:w-32"
        />
      </div>

      {/* Artist Invitation */}
      <div className="flex flex-row gap-1 p-2 w-full md:w-auto h-auto justify-start items-center rounded-md bg-[#141414] drop-shadow-lg scale-100 transition-all duration-300 overflow-hidden">
        <div className="flex flex-col w-40 md:w-52">
          <p className="text-[0.5rem] md:text-[0.75rem] text-white font-semibold">
            Unleash Your Creativity
          </p>
          <p className="ml-2 text-[0.7rem] md:text-[1rem] text-white font-bold drop-shadow-2xl">
            Become an Artist
          </p>
        </div>
        <Link
          className="btn glass btn-outline text-white text-xs md:text-md font-semibold w-16 md:w-28 px-1 py-1 md:px-4 md:py-2"
          to="account/shop-setup"
        >
          Set up Art
        </Link>
        <img
          src={require("@/assets/emote/success.png")}
          className="absolute right-10 md:right-20 -top-4 md:-top-6 opacity-30 -z-10 object-contain w-20 md:w-32"
        />
      </div>
    </div>
  );
};

export default InvitationCard;
