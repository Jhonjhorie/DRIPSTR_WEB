import React, { useState, useRef, useEffect } from "react";
import { ReactComponent as Logo } from "../assets/images/BlackLongLogo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  faSearch,
  faShoppingCart,
  faMessage,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import ChatList from "../modules/Messaging/ChatList";
import ChatBox from "../modules/Messaging/ChatBox";
import Cart from "../modules/Products/Cart";
import AuthModal from "../shared/login/Auth";
import { supabase } from "../constants/supabase";
import useCarts from "../modules/Products/hooks/useCart";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const drawerCheckboxRef = useRef(null);
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [minimizedChats, setMinimizedChats] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user?.id) {
      fetchUnreadCount();
      
      // Set up real-time subscription for new messages
      const subscription = supabase
        .channel('messages-changes')
        .on('postgres_changes', { 
          event: '*', 
          schema: 'public', 
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        }, () => {
          fetchUnreadCount();
        })
        .subscribe();
        
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user?.id]);

  const fetchUnreadCount = async () => {
    try {
      const { count, error } = await supabase
        .from("messages")
        .select("*", { count: 'exact', head: true })
        .eq("receiver_id", user.id)
        .eq("is_read", false);
        
      if (error) throw error;
      setUnreadCount(count || 0);
    } catch (error) {
      console.error("Error fetching unread message count:", error.message);
    }
  };
  

  const { cartItems, setCartItems, fetchDataCart } = useCarts();

  const location = useLocation();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const toggleChat = () => {
    setOpenChat(!openChat);
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setOpenChat(false);
  };

  const handleCloseChat = (chat) => {
    setSelectedChat(null);
  };

  const handleMinimizeChat = (chat) => {
    setMinimizedChats((prev) => [...prev, chat]);
    setSelectedChat(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const closeDrawer = () => {
    if (drawerCheckboxRef.current) {
      drawerCheckboxRef.current.checked = false;
    }
  };

  const handleAuth = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      navigate("/account");
    }
  };

  const handleCartClick = async () => {
    await fetchDataCart();
    drawerCheckboxRef.current.checked = true;
  };

  const handleHomeClick = () => {
    setSearchQuery("");
    navigate("/");
  };

  if (location.pathname.startsWith("/admin")) {
    return null;
  }


  return (
    <div className="flex items-center gap-2 h-16 sm:h-20 px-4 sm:px-8 md:px-16 py-4 sm:py-8 md:py-12 bg-slate-50 sticky top-0 z-30">
      <div className="hidden sm:flex">
        <Link to="/">
          <button onClick={handleHomeClick}>
            <Logo className="h-8 w-24 sm:h-10 sm:w-32 md:h-12 md:w-36 lg:h-16 lg:w-52" />
          </button>
        </Link>
      </div>

      <form
        onSubmit={handleSearch}
        className="flex flex-1 items-center justify-end gap-4"
      >
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(e);
              }
            }}
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
            id="my-drawer-cart"
            type="checkbox"
            className="drawer-toggle"
            ref={drawerCheckboxRef}
          />
          <div className="drawer-content">
            <button
              htmlFor="my-drawer-cart"
              className="drawer-button"
              aria-label="Open cart"
              onClick={handleCartClick}
            >
              <FontAwesomeIcon
                icon={faShoppingCart}
                className="text-black hover:text-[--primary-color]"
                 size="md"
              />
            </button>
          </div>
          <div className="drawer-side z-[999] ">
            <label
              htmlFor="my-drawer-cart"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <Cart
              closeDrawer={closeDrawer}
              cartItems2={cartItems}
              setCartItems={setCartItems}
            />
          </div>
        </div>
        <button 
      onClick={toggleChat} 
      aria-label={`Open chat${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      className="relative"
    >
      <FontAwesomeIcon
        icon={faMessage}
        className="text-black hover:text-[--primary-color] transition-colors duration-200"
        size="md"
      />
      
      {unreadCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 min-w-5 flex items-center justify-center px-1 border border-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}
    </button>
        <button onClick={handleAuth} aria-label="User account">
          {user ? (
            <FontAwesomeIcon
              icon={faUser}
              className="text-black hover:text-[--primary-color]"
                size="md"
            />
          ) : (
            <span className=" text-[--primary-color] hover:text-gray-300 hover:underline ">
              Login/Register
            </span>
          )}
        </button>
      </div>

      {openChat && <ChatList profile={user} onSelectChat={handleSelectChat} />}
      {selectedChat && (
        <ChatBox
          profile={user}
          chat={selectedChat}
          onClose={() => handleCloseChat(selectedChat)}
          onMinimize={() => handleMinimizeChat(selectedChat)}
        />
      )}
      {minimizedChats.map((chat, index) => (
        <div
          key={index}
          className="fixed bottom-60 right-4 flex flex-col gap-2"
          onClick={() => setSelectedChat(chat)}
        >
          <img
            src={chat?.merch?.shop_image}
            alt="Avatar"
            className="rounded-full w-12 h-12"
          />
        </div>
      ))}
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
