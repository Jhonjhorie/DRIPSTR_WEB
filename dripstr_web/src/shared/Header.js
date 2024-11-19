import React from 'react';
import { ReactComponent as Logo } from '../assets/images/BlackLongLogo.svg'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faSearch, faShoppingCart, faMessage } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  return (
    <div className="flex items-center h-16 sm:h-20 px-4 sm:px-8 md:px-16 py-4 sm:py-8 md:py-12 bg-slate-50 sticky top-0 z-30 ">
      {/* Website Name */}
      <div className="hidden sm:flex">
        <Link to="/">
          <button>
            <Logo className="h-8 w-24 sm:h-10 sm:w-32 md:h-12 md:w-36 lg:h-16 lg:w-52" />
          </button>
        </Link>
      </div>

      {/* Search Bar and Button */}
      <div className="flex flex-1 items-center justify-end gap-4">
        <div className="group relative flex items-center bg-slate-200 rounded-md pl-3 flex-1 sm:flex-none sm:w-60 md:w-60 transition-all duration-300 sm:hover:w-[55vw] md:hover:w-[50vw] lg:hover:w-[60vw]">
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 text-black bg-transparent outline-none"
          />
          <button className="w-10 h-10 flex items-center justify-center bg-slate-200 group-hover:bg-primary-color rounded-r-md transition-all duration-300">
            <FontAwesomeIcon icon={faSearch} className="text-primary-color group-hover:text-black transition-all duration-300" />
          </button>
        </div>

        {/* Icons */}
        <div className="flex space-x-4">
          <Link to="/cart">
            <button>
              <FontAwesomeIcon icon={faShoppingCart} className="text-black hover:text-[--primary-color]" />
            </button>
          </Link>
          <Link to="/account">
            <button>
              <FontAwesomeIcon icon={faMessage} className="text-black hover:text-[--primary-color]" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
