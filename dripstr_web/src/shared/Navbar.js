import React from 'react';
import { ReactComponent as Logo } from '../assets/LOGO.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
<nav className="bg-purple p-2 w-full h-full">
  <div className="container mx-auto flex flex-wrap items-center justify-between">
    {/* Logo and Brand */}
    <Link to="/" className="flex items-center mb-2 sm:mb-0">
      <span className="text-white font-iceland text-3xl">DRP</span>
      <Logo className="h-16 w-16 sm:h-20 sm:w-20 mx-2" /> {/* SVG Logo */}
      <span className="text-white font-iceland text-3xl">STR</span>
    </Link>

    {/* Search Bar */}
    <div className="flex items-center bg-gray-700 rounded-md p-1 w-full sm:w-auto mb-2 sm:mb-0">
      <input
        type="text"
        placeholder="Search..."
        className="bg-gray-700 text-white rounded-l-md flex-1 sm:w-auto pr-4 p-1 outline-none"
      />
      <button className="p-2">
        <FontAwesomeIcon icon={faSearch} className="text-white" />
      </button>
    </div>

    {/* Icons for Cart and User */}
    <div className="flex items-center space-x-5">
      <Link to="/cart" className="text-white">
        <FontAwesomeIcon icon={faShoppingCart} className="text-white text-2xl cursor-pointer" />
      </Link>
      <Link to="/useraccount" className="text-white">
        <FontAwesomeIcon icon={faUser} className="text-white text-2xl cursor-pointer" />
      </Link>
    </div>
  </div>
</nav>

  );
}

export default Navbar;
