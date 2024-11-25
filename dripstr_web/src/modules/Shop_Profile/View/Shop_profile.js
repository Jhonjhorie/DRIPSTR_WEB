import React, { useState, useEffect } from 'react';
import SideBar from '../Component/Sidebars'
import logo from '../../../assets/shop/shoplogo.jpg';

function Shop_profile() { 

  
  return (
  <div className="h-full w-full overflow-y-scroll bg-slate-300 custom-scrollbar px-5 lg:px-20 ">
    <div className='absolute mx-3 right-0 z-10'>
      <SideBar/>
    </div>
    <div className='w-full h-auto bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-sm gap-2 rounded-sm  md:flex'>
        <div className='w-auto h-full place-items-center  md:mt-0 mt-2  lg:p-7'>
          <div className='bg-gradient-to-r from-violet-500 to-fuchsia-500 h-full w-[400px] rounded-sm shadow-md'>
            <div className='flex w-full h-[70%] '>
              <div className=' p-2 h-[120px] w-1/3'>
                <div className='rounded-md bg-primary-color p-1 h-full w-full'>
                  <img
                    src={logo}
                    alt="Shop Logo"
                    className="drop-shadow-custom object-cover rounded-md h-full w-full"
                  />
                </div>
              </div>
              <div className=' w-2/3 place-content-center'>
                <div className='text-slate-100 text-lg font-semibold'> Saint Mercy Apparel </div>
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
        <div className=' w-full h-full md:mt-0 mt-2 rounded-md md:pr-5'>
        <div className="carousel w-full h-48 mt-3 rounded-sm border-custom-purple border-2 ">
          <div id="slide1" className="carousel-item relative w-full">
            <img
              src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp"
              className="w-full" />
            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
              <a href="#slide4" className="btn btn-circle bg-transparent">❮</a>
              <a href="#slide2" className="btn btn-circle bg-transparent">❯</a>
            </div>
          </div>
          <div id="slide2" className="carousel-item relative w-full">
            <img
              src="https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp"
              className="w-full" />
            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
              <a href="#slide1" className="btn btn-circle bg-transparent">❮</a>
              <a href="#slide3" className="btn btn-circle bg-transparent">❯</a>
            </div>
          </div>
          <div id="slide3" className="carousel-item relative w-full">
            <img
              src="https://img.daisyui.com/images/stock/photo-1414694762283-acccc27bca85.webp"
              className="w-full" />
            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
              <a href="#slide2" className="btn btn-circle bg-transparent">❮</a>
              <a href="#slide4" className="btn btn-circle bg-transparent">❯</a>
            </div>
          </div>
          <div id="slide4" className="carousel-item relative w-full">
            <img
              src="https://img.daisyui.com/images/stock/photo-1665553365602-b2fb8e5d1707.webp"
              className="w-full" />
            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
              <a href="#slide3" className="btn btn-circle bg-transparent">❮</a>
              <a href="#slide1" className="btn btn-circle bg-transparent">❯</a>
            </div>
          </div>
        </div>
       </div>
   
  </div>
  </div>
  );
}



export default Shop_profile;
