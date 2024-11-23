import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/shop/shoplogo.jpg';

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
    <div className="relative flex  md:mr-0" ref={navbarRef}>
    {/* Icon button */}
 
    <div className="dropdown dropdown-bottom dropdown-end bg-slate-100 shadow-md border-2 border-primary-color 
    shadow-primary-color h-12 w-20 mt-2 rounded-md  ">
      <div tabIndex={0} role="button" className="">
          <img
            src={logo}
            alt="Shop Logo"
            className="drop-shadow-custom object-cover rounded-md h-11 w-full"
          />
      </div>
      <ul tabIndex={0} className="dropdown-content  h-72 bg-base-100 rounded-md z-[1] w-72 p-2 mt-2 shadow">
        <div className='bg-slate-100 h-full w-full relative '>
          <div className='bg-primary-color h-1/4 w-full'></div>
          <div className='bg-base-100 h-[75%] w-full'>
            <div className='text-white pt-[30%]  text-center'> Saint Mercy Apparel </div>

            <div className='flex gap-2 mt-12'>
              <button class="btn -ml-1 ">
                Messages
                <div class="badge">+99</div>
              </button>
              <button class="btn">
                Inbox
                <div class="badge badge-secondary">+99</div>
              </button>
            </div>
          </div>
          <div className='bg-slate-100 absolute top-3 mx-[25%] h-1/2 w-1/2  rounded-full border-[3px]  border-custom-purple ' >
            <img
              src={logo}
              alt="Shop Logo"
              className="drop-shadow-custom object-cover rounded-full h-full w-full"
            />
          </div>
         
          
          
        </div>
      </ul>
    </div>

    <button
      className="w-10 h-10 flex items-center m-3 shadow-sm shadow-primary-color  justify-center
       rounded-md"
     
    >
      <label
      
      className="btn w-11 h-10  bg-primary-color glass hover:duration-300 hover:bg-slate-100 swap swap-rotate">
        {/* this hidden checkbox controls the state */}
        <input
        onClick={toggleNavbar}
        type="checkbox" />

        {/* hamburger icon */}
        <svg
          className="swap-off fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          color='black'
          viewBox="0 0 512 512">
          <path d="M64,384H448V341.33H64Zm0-106.67H448V234.67H64ZM64,128v42.67H448V128Z" />
        </svg>

        {/* close icon */}
        <svg
          className="swap-on fill-current"
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          color='black'
          viewBox="0 0 512 512">
          <polygon
            points="400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49" />
        </svg>
      </label>


    </button>
   
    {/* Navbar */}
    {isNavbarVisible && (
      <div className="absolute top-16 right-0 w-48 mx-3 bg-slate-50 shadow-lg rounded-md p-4">
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
            onClick={() => navigate('/shop/MerchantOrders')}
            className="block text-base text-gray-800 hover:text-violet-900 cursor-pointer ">
              Orders
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