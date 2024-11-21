import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { faChevronRight, faChevronLeft, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as Logo } from '@/assets/images/LOGO.svg'; 

const AvatarCard = ({ user }) => {
    return (
        <div className="flex bg-secondary-color rounded-md group drop-shadow-lg w-full sm:w-1/2 lg:w-1/3 h-full">
          <div className="flex flex-row gap-2 p-4 w-full h-full justify-start">
            {/* Avatar Section */}
            <div className="flex flex-col gap-4 w-2/5 h-full">
              <Link
                to="/"
                className="scale-100 duration-300 transition-all hover:scale-110 w-full h-full"
              >
                <img
                  src={typeof user.avatarIcon === 'string' ? user.avatarIcon : user.avatarIcon.uri}
                  alt="User Avatar"
                  className="z-20 duration-300 transition-all left-0 bottom-0 bg-gray-200 drop-shadow-lg rounded-b-lg hover:bottom-2 hover:scale-105 hover:-left-2 hover:rounded-2xl object-contain w-full h-full"
                />
              </Link>
            </div>
    
            {/* User Info Section */}
            <div className="flex flex-col justify-start w-3/5 h-full">
              <p className="text-slate-50 text-lg font-bold">{user.name}</p>
              <p className="text-slate-50 text-lg font-light">{user.title}</p>
              <p className="text-primary-color text-lg font-bold">Orders:</p>
              {/* <OrderCard orders={user.orders} /> */}
            </div>
          </div>
        </div>
      );
    };
export default AvatarCard;
