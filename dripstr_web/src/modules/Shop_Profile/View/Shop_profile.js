import React, { useState, useEffect } from 'react';
import SideBar from '../Component/Sidebars'
import logo from '../../../assets/shop/shoplogo.jpg';
import logo1 from '../../../assets/shop/s1.jpg';
import logo2 from '../../../assets/shop/s2.jpg';
import logo3 from '../../../assets/shop/s3.jpg';
import logo4 from '../../../assets/shop/s4.jpg';

function Shop_profile() { 

  
  return (
  <div className="h-full w-full overflow-y-scroll  bg-slate-300 custom-scrollbar px-2  lg:px-20 md:flex ">
    <div className='absolute mx-3 right-0 z-10'>
      <SideBar/>
    </div>
    <div className='w-[90%] md:w-[35%] lg:overflow-hidden  overflow-y-scroll lg:w-[25%] md:fixed h-full shadow-md bg-slate-100 gap-2 mx-auto '>
        <div className='w-full h-auto p-2'>
          <div className='bg-gradient-to-r from-violet-500 to-fuchsia-500 h-1/2 w-full rounded-sm shadow-md mt-2'>
            <div className='lg:flex w-full h-[70%] place-items-center justify-center  '>
              <div className=' p-2 h-1/2 lg:h-[120px] w-1/2 lg:w-1/3'>
                <div className='rounded-md bg-primary-color p-1 h-full w-full'>
                  <img
                    src={logo}
                    alt="Shop Logo"
                    className="drop-shadow-custom object-cover rounded-md h-full w-full"
                  />
                </div>
              </div>
              <div className=' w-2/3 place-content-center place-items-center lg:place-items-start '>
                <div className='text-slate-100 text-sm lg:text-lg font-semibold'> Saint Mercy Apparel </div>
                <div className='text-slate-100 text-sm font-semibold flex place-items-center gap-2'> 
                  <div className='bg-green-400 h-2 w-2 rounded-md pl-4' />
                  <div className='text-sm font-normal'> Active </div>  
                </div>
                <div className='text-slate-100 text-sm font-semibold flex gap-2 place-items-center'> 
                 <box-icon name='group' size="16px" color='#FFFFFF'></box-icon> 
                 <div className='text-sm font-normal'> Followers: <a className='text-yellow-300'>100k</a></div> 
                </div>
                <div className='text-slate-100 text-sm font-semibold flex gap-2 place-items-center'> 
                 <box-icon size="15px" name='message-dots' color='#FFFFFF'></box-icon>
                 <div className='text-sm font-normal'> Chat response rating: <a className='text-yellow-300'>4.5%</a> </div> 
                </div>
              </div>
            </div>
            <div className='w-full h-[30%]  flex'>
              <div className=' h-full w-1/2 p-1 '>
                <div className='border-slate-50 w-full p-1 h-full border-2 hover:bg-purple-700 hover:duration-300 cursor-pointer rounded-sm flex justify-center place-items-center gap-3'>
                  <box-icon name='bookmark-alt-plus' size="20px" color='#FFFFFF'></box-icon>
                  <a className='text-white text-sm'>Follow</a>
                </div>
              </div>
              <div className=' h-full w-1/2 p-1'>
                <div className='border-slate-50 w-full p-1 h-full border-2 hover:bg-purple-700 hover:duration-300 cursor-pointer rounded-sm flex justify-center place-items-center gap-3'>
                  <box-icon name='message-square-dots' size="20px" color="#FFFFFF"></box-icon>
                  <a className='text-white text-sm'>Chat Now</a>
                </div>  
              </div>
            </div>
          </div>
        </div>
        <div className=' w-full h-[75%] md:mt-0 mt-2 p-2'>
        <div className="carousel w-full h-[80%] mt-1 rounded-md border-primary-color border-[5px] ">
          <div id="slide1" className="carousel-item relative w-full ">
            <img
              src={logo1}
              className="w-full " />
            <div className="absolute left-2 right-2 top-1/2 flex -translate-y-1/2 transform justify-between">
              <a href="#slide4" className="btn rounded-md bg-transparent hover:bg-primary-color hover:glass hover:opacity-80 text-slate-950 text-lg ">❮</a>
              <a href="#slide2" className="btn rounded-md bg-transparent hover:bg-primary-color hover:glass hover:opacity-80 text-slate-950 text-lg">❯</a>
            </div>
          </div>
          <div id="slide2" className="carousel-item relative w-full">
            <img
              src={logo2}
              className="w-full" />
            <div className="absolute left-2 right-2 top-1/2 flex -translate-y-1/2 transform justify-between">
              <a href="#slide1" className="btn rounded-md bg-transparent hover:bg-primary-color hover:glass hover:opacity-80 text-slate-950 text-lg ">❮</a>
              <a href="#slide3" className="btn rounded-md bg-transparent hover:bg-primary-color hover:glass hover:opacity-80 text-slate-950 text-lg ">❯</a>
            </div>
          </div>
          <div id="slide3" className="carousel-item relative w-full">
            <img
              src={logo3}
              className="w-full" />
            <div className="absolute left-2 right-2 top-1/2 flex -translate-y-1/2 transform justify-between">
              <a href="#slide2" className="btn rounded-md bg-transparent hover:bg-primary-color hover:glass hover:opacity-80 text-slate-950 text-lg ">❮</a>
              <a href="#slide4" className="btn rounded-md bg-transparent hover:bg-primary-color hover:glass hover:opacity-80 text-slate-950 text-lg text-slate-950 text-lg">❯</a>
            </div>
          </div>
          <div id="slide4" className="carousel-item relative w-full">
            <img
              src={logo4}
              className="w-full" />
            <div className="absolute left-2 right-2 top-1/2 flex -translate-y-1/2 transform justify-between">
              <a href="#slide3" className="btn rounded-md bg-transparent hover:bg-primary-color hover:glass hover:opacity-80 text-slate-950 text-lg ">❮</a>
              <a href="#slide1" className="btn rounded-md bg-transparent hover:bg-primary-color hover:glass hover:opacity-80 text-slate-950 text-lg ">❯</a>
            </div>
          </div>
        </div>
       </div>
    </div>
    <div className='h-full w-full md:flex  '>
      <div className='md:h-full w-full md:w-[35%] lg:w-[30%] bg-slate-600'></div>
      <div className='h-[200%] w-full md:w-[65%] lg:w-[75%] md:px-10 px-2 bg-slate-50'>
        <div className="dropdown dropdown-bottom flex justify-between gap-2 mt-2 place-items-center  ">
          <p className='font-semibold text-slate-800 flex gap-5 place-items-center iceland-regular text-3xl md:text-4xl  '> Shop products </p> 
         
          <div className="flex place-items-center dropdown dropdown-bottom dropdown-end">
            <div className='text'>filter items</div>
            <div tabIndex={0} role="button" className="h-8 w-8 jus justify-center place-items-center flex rounded-md
            hover:bg-slate-900 hover:duration-300 bg-slate-700  m-1"><box-icon color="#FFFFFF" name='filter'></box-icon></div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-sm z-[1] w-52 p-2 shadow">
              <li><a>Shirt</a></li>
              <li><a>Brief</a></li>
              <li><a>Boxers</a></li>
              <li><a>Polo</a></li>
              <li><a>Formal</a></li>
            </ul>
           </div> 
        </div>
      </div>

    </div>
  </div>
  );
}



export default Shop_profile;
