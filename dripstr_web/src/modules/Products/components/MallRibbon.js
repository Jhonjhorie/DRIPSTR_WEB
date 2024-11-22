import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as LogoB     } from '@/assets/images/BlackLogo.svg'; 
import { ReactComponent as Logo } from '@/assets/images/LOGO.svg'; 

const MallRibbon = ({ active }) => {

  return (
    <div
      className="relative w-[95%] md:w-[90%]  justify-evenly items-center px-2 md:px-3 gap-2 md:gap-8 flex flex-row "
    >
        <Link to={'/mall'} className='h-24 flex-1  bg-primary-color text-slate-50 rounded-lg items-center justify-center flex py-4 px-16 font-bold drop-shadow-lg btn glass group hover:text-secondary-color overflow-hidden' >
        {active == "0" ? (<Logo className='h-32 w-32 absolute -left-4 top-1 shadow-lg group-hover:scale-150 duration-500 transition-all '/>) : (<LogoB className='h-32 w-32 absolute -left-4 group-hover:scale-150 duration-500 transition-all top-1 shadow-lg opacity-50 '/>) }
        Drip Mall</Link>
        <Link to={'/mall'}  className='h-24 flex-1  bg-secondary-color group text-slate-50 rounded-lg items-center justify-center flex py-4 px-16 font-bold drop-shadow-lg btn glass hover:text-secondary-color overflow-hidden' >
        {active == "1" ? (<Logo className='h-32 w-32 absolute -left-4 top-1 shadow-lg group-hover:scale-150 duration-500 transition-all '/>) : (<LogoB className='h-32 w-32 absolute -left-4 group-hover:scale-150 duration-500 transition-all top-1 shadow-lg opacity-50 '/>) }Just for You</Link>
        <Link to={'/mall'}  className='h-24 flex-1  bg-blue-700 group text-slate-50 rounded-lg items-center justify-center flex py-4 px-16 font-bold drop-shadow-lg btn glass hover:text-secondary-color overflow-hidden' >
        {active == "2" ? (<Logo className='h-32 w-32 absolute -left-4 top-1 shadow-lg group-hover:scale-150 duration-500 transition-all '/>) : (<LogoB className='h-32 w-32 absolute -left-4 group-hover:scale-150 duration-500 transition-all top-1 shadow-lg opacity-50 '/>) }Followed Store</Link>
        <Link to={'/mall'}  className='h-24 flex-1  bg-red-700 text-slate-50 rounded-lg items-center justify-end text-lg flex py-4 px-16 font-bold drop-shadow-lg btn glass hover:text-secondary-color duration-300 transition-all group overflow-hidden' >
        {active == "3" ? (<Logo className='h-32 w-32 absolute -left-4 top-1 shadow-lg group-hover:scale-150 duration-500 transition-all '/>) : (<LogoB className='h-32 w-32 absolute -left-4 group-hover:scale-150 duration-500 transition-all top-1 shadow-lg opacity-50 '/>) }Popular/Trending</Link>
      
    </div>
  );
};

export default MallRibbon;
