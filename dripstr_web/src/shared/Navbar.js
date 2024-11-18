import React, { useState } from 'react';
import { ReactComponent as Logo } from '../assets/LOGO.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faSearch, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import ChatMessages from '../modules/Messaging/View/Messaging'; 

function Navbar() {
  const [openChat, setOpenChat] = useState(false);

  const toggleChat = () => {
    setOpenChat(!openChat);
  };

  const closeChat = () => {
    setOpenChat(false);
  };

  return (
    <nav className="bg-purple p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center">
          <span className="text-white font-iceland text-3xl">DRP</span>
          <Logo className="h-20 w-20 mx-2" /> {/* SVG Logo */}
          <span className="text-white font-iceland text-3xl">STR</span>
        </Link>

        {/* Search Bar */}
        <div className="flex items-center bg-gray-700 rounded-md p-1">
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-700 text-white rounded-l-md pr-40 p-1 outline-none"
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
          <button onClick={toggleChat}>
            <FontAwesomeIcon icon={faMessage} className="text-white text-2xl cursor-pointer" />
          </button>
          <Link to="/useraccount" className="text-white">
            <FontAwesomeIcon icon={faUser} className="text-white text-2xl cursor-pointer" />
          </Link>
        </div>
      </div>
      {openChat && <ChatMessages onClose={closeChat} />}
    </nav>
  );
}

export default Navbar;
