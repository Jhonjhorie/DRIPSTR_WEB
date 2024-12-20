import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/shop/shoplogo.jpg';
import { supabase } from "../../../constants/supabase";  


function SideBar() { 
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  
  return (
    <div className="relative flex  md:mr-0" ref={navbarRef}>
    
    <div className="dropdown dropdown-bottom dropdown-end bg-slate-100 shadow-md border-2 border-primary-color 
    shadow-primary-color h-12 w-20 mt-2 rounded-md mr-16 ">
          
        <img src={logo} alt="User Profile" className='object-cover h-full w-full rounded-md '/>
      
    </div>


   
    {/* Navbar */}
    <button 
      className="fixed w-12 h-12 right-3 z-10 bg-custom-purple  glass text-white rounded-md m-2 shadow-lg"
      onClick={toggleSidebar}
    >
      <box-icon name='menu' color="#ffffff" ></box-icon>
                    </button>
                    {isSidebarOpen && (
                        <div 
                            className="fixed inset-0 bg-black opacity-50 z-40"
                            onClick={toggleSidebar}
                        ></div>
                    )}
      <div
       className={`fixed top-0 right-0 w-72 h-full bg-slate-200 shadow-lg transform transition-transform duration-300 z-50 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        <ul className=" mt-16  md:mt-24 p-2">
          <div className='h-24 w-full rounded-md bg-slate-900'>
          <div className='bg-slate-100 absolute top-24 md:top-32 mx-[22%]  w-1/2  rounded-full border-[3px]  border-slate-800 ' >
            <img
              src={logo}
              alt="Shop Logo"
              className="drop-shadow-custom object-cover rounded-full h-full w-full"
            />
          </div>
           
          </div>

          <div className='text-slate-900 font-semibold pt-[30%]  text-center'> Saint Mercy Apparel </div>
          <li
          onClick={() => navigate('/shop/MerchantDashboard')}
          className='flex justify-between p-1 hover:bg-slate-300 mt-4 rounded-sm hover:duration-200 hover:text-violet-900 cursor-pointer '>
            <a
            className="block  text-base text-slate-900 w-full hover:text-primary-color cursor-pointer ">
              Dashboard
            </a>
            <box-icon type='solid' name='dashboard' color="#4D077C"></box-icon>
          </li>

          <li 
          onClick={() => navigate('/shop/MerchantProducts')}
          className='flex justify-between p-1 hover:bg-slate-300 rounded-sm hover:duration-200 hover:text-violet-900 cursor-pointer '>
            <a
            className="block  text-base text-slate-900 w-full hover:text-primary-color cursor-pointer ">
              Products
            </a>
            <box-icon type='solid' name='component' color="#4D077C"></box-icon>
          </li>

          <li 
          onClick={() => navigate('/shop/MerchantOrders')}
          className='flex justify-between p-1 hover:bg-slate-300 rounded-sm hover:duration-200 hover:text-violet-900 cursor-pointer '>
            <a
             className="block  text-base text-slate-900 w-full hover:text-primary-color cursor-pointer ">
              Orders
            </a>
            <box-icon name='basket' type='solid' color="#4D077C"></box-icon>
          </li>

          <li
          onClick={() => navigate('/shop/MerchantMessages')}
          className='flex justify-between p-1 hover:bg-slate-300 rounded-sm hover:duration-200 hover:text-violet-900 cursor-pointer '>
            <a
            className="block  text-base text-slate-900 w-full hover:text-primary-color cursor-pointer ">
              Messages
            </a>
            <box-icon type='solid' name='message-dots' color="#4D077C"></box-icon>

          </li>

          <li
          onClick={() => navigate('/shop/MerchantNotifications')}
            className='flex justify-between p-1 hover:bg-slate-300 rounded-sm hover:duration-200 hover:text-violet-900 cursor-pointer '>
            <a
            className="block  text-base text-slate-900 w-full hover:text-primary-color cursor-pointer ">
              Notifications
            </a>
            <box-icon type='solid' name='bell' color="#4D077C"></box-icon>
          </li>
          
          <li
          onClick={() => navigate('/shop/MerchantFollowers')}
          className='flex justify-between p-1 hover:bg-slate-300 rounded-sm hover:duration-200 hover:text-violet-900 cursor-pointer '>
            <a   
             className="block  text-base text-slate-900 w-full hover:text-primary-color cursor-pointer ">
              Followers
            </a>
            <box-icon type='solid' name='group' color="#4D077C"></box-icon>
          </li>

          <li
          onClick={() => navigate('/shop/Shop_profile')}
          className='flex justify-between p-1 hover:bg-slate-300 rounded-sm hover:duration-200 hover:text-violet-900 cursor-pointer '>
            <a   
             className="block  text-base text-slate-900 w-full hover:text-primary-color cursor-pointer ">
              Shop Preview
            </a>
            <box-icon type='solid' name='shopping-bags' color="#4D077C"></box-icon>
          </li>

          
        </ul>
            <div className='flex gap-2 absolute bottom-14  md:bottom-2  justify-end '>
              <button className="btn px-2 mx-2 ">
                Messages
                <div className="badge">+99</div>
              </button>
              <button className="btn">
                Inbox
                <div className="badge badge-secondary">+99</div>
              </button>
            </div>
      </div>
    
  </div>
  );
}



export default SideBar;