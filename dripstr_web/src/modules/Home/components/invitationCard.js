import React from "react";
import { Link } from "react-router-dom";
import useUserProfile from "@/shared/mulletCheck";

const InvitationCard = () => {
  const { profile, loadingP, errorP, isLoggedIn } = useUserProfile();

  return (
    <div className="flex bg-secondary-color flex-col rounded-md group drop-shadow-lg w-full md:w-1/3 lg:w-full h-24 md:h-42 lg:h-36 ">
      <div className="flex flex-row gap-1 md:gap-2 p-2 md:p-3 w-full h-full justify-start">
        <div className="flex flex-col gap-4 w-[40%] md:w-4/5">
          <Link
            to="/"
            className="scale-100 duration-300 transition-all hover:scale-110 w-full"
          >
           
            
          </Link>
        </div>

        {/* User Info Section */}
        <div className="flex flex-row md:flex-col justify-start w-full h-full space-x-4 md:space-x-2">

        </div>
      </div>
   

    </div>
  );
};
export default InvitationCard;
