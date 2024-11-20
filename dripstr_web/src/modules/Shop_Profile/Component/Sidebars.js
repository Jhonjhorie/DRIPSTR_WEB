import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function SideBar() { 
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const navbarRef = useRef(null);
  const navigate = useNavigate();

  const toggleNavbar = () => {
    setIsNavbarVisible(!isNavbarVisible);
  };
  
    useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsNavbarVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    }, []);

  return (
    <div className="relative" ref={navbarRef}>
    {/* Icon button */}
    <button
      className="w-10 h-10 flex items-center m-3 shadow-md justify-center hover:bg-primary-color glass hover:duration-300 bg-slate-100 rounded-md"
      onClick={toggleNavbar}
    >
     <box-icon  size='35px' name='menu-alt-right' ></box-icon>
    </button>

    {/* Navbar */}
    {isNavbarVisible && (
      <div className="absolute top-12 right-0 w-48 mx-3 bg-slate-50 shadow-lg rounded-md p-4">
        <ul className="space-y-2">
          <li>
            <a
            onClick={() => navigate('/shop/MerchantDashboard')}
            className="block text-base text-gray-800 hover:text-violet-900 cursor-pointer ">
              Dashboard
            </a>
          </li>
          <li>
            <a
            onClick={() => navigate('/shop/MerchantProducts')}
            className="block text-base text-gray-800 hover:text-violet-900 cursor-pointer ">
              Products
            </a>
          </li>
          <li>
            <a
            onClick={() => navigate('/shop/MerchantNotifications')}
            className="block text-base text-gray-800 hover:text-violet-900 cursor-pointer ">
              Notifications
            </a>
          </li>
          <li>
            <a
            onClick={() => navigate('/shop/MerchantFollowers')}
            className="block text-base text-gray-800 hover:text-violet-900 cursor-pointer ">
              Followers
            </a>
          </li>
        </ul>
      </div>
    )}
  </div>
  );
}



export default SideBar;