import React, { useState, useRef, useEffect } from 'react';
import { ReactComponent as Logo } from '../assets/images/BlackLongLogo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import { faSearch, faShoppingCart, faMessage, faUser } from '@fortawesome/free-solid-svg-icons';
import ChatMessages from '../modules/Messaging/View/Messaging';
import Cart from '../modules/Products/Cart';
import AuthModal from "../shared/login/Auth";
import { supabase } from "../constants/supabase";

const Header = () => {
  const [openChat, setOpenChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const drawerCheckboxRef = useRef(null);
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const toggleChat = () => {
    setOpenChat(!openChat);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const closeDrawer = () => {
    if (drawerCheckboxRef.current) {
      drawerCheckboxRef.current.checked = false;
    }
  };

  const handleAuth = () => {
    if (!user) {
      setIsAuthModalOpen(true); // Open the auth modal if user is not logged in
    } else {
      navigate("/account"); // Redirect to /account if user is logged in
    }
  };

  return (
    <div className="flex items-center gap-2 h-16 sm:h-20 px-4 sm:px-8 md:px-16 py-4 sm:py-8 md:py-12 bg-slate-50 sticky top-0 z-30">
      {/* Website Name */}
      <div className="hidden sm:flex">
        <Link to="/">
          <button>
            <Logo className="h-8 w-24 sm:h-10 sm:w-32 md:h-12 md:w-36 lg:h-16 lg:w-52" />
          </button>
        </Link>
      </div>

      {/* Search Bar and Button */}
      <form onSubmit={handleSearch} className="flex flex-1 items-center justify-end gap-4">
        <div
          className={`group relative flex items-center bg-slate-200 rounded-md pl-3 flex-1 sm:flex-none transition-all duration-300 ${
            searchQuery || isFocused
              ? "sm:w-[55vw] md:w-[50vw] lg:w-[60vw]"
              : "sm:w-60 md:w-60"
          }`}
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="flex-1 text-black bg-transparent outline-none"
          />
          <button
            type="submit"
            className="w-10 h-10 flex items-center justify-center bg-slate-200 group-hover:bg-primary-color rounded-r-md transition-all duration-300"
            aria-label="Search"
          >
            <FontAwesomeIcon
              icon={faSearch}
              className="text-primary-color group-hover:text-black transition-all duration-300"
            />
          </button>
        </div>
      </form>

      {/* Icons */}
      <div className="space-x-4 flex">
        <div className="drawer drawer-end">
          <input
            id="my-drawer-4"
            type="checkbox"
            className="drawer-toggle"
            ref={drawerCheckboxRef}
          />
          <div className="drawer-content">
            <label htmlFor="my-drawer-4" className="drawer-button" aria-label="Open cart">
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="text-black hover:text-[--primary-color]"
              />
            </label>
          </div>
          <div className="drawer-side z-50">
            <label
              htmlFor="my-drawer-4"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <Cart closeDrawer={closeDrawer} />
          </div>
        </div>
        <button onClick={toggleChat} aria-label="Open chat">
          <FontAwesomeIcon
            icon={faMessage}
            className="indicator text-black hover:text-[--primary-color]"
          />
        </button> 
        <button onClick={handleAuth} aria-label="User account"  >
          {user ? (
            <FontAwesomeIcon
              icon={faUser}
              className="text-black hover:text-[--primary-color]"
            />
          ) : (
            <span className=" text-[--primary-color] hover:text-gray-300 hover:underline ">Login/SignIn</span>
          )}
        </button>
      </div>

      {/* Chat Messages */}
      {openChat && <ChatMessages />}

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Header;