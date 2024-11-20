import React from 'react';
import SideBar from '../Component/Sidebars';
import logo from '../../../assets/shop/shoplogo.jpg';
import boy from '../../../assets/shop/sample2.jpg';
import girl from '../../../assets/shop/erica.jpg';
import drip from '../../../assets/shop/drip.png';
import '../../../assets/shop/fonts/font.css';

function MerchantDashboard() {
  return (
    <div className="h-screen w-full bg-slate-300 overflow-y-scroll custom-scrollbar  ">
      <div className="absolute mx-3 right-0 z-10">
        <SideBar />
      </div>
      {/* First Container -- Logo Shop -- Notification */}
      <div className="h-auto w-full md:flex gap-2  place-items-center p-2 align-middle ">
        <div className=' h-full w-full p-2  md:pl-10'>
          <div className=' text-5xl font-bold text-custom-purple mb-5 flex justify-center md:justify-start' >Dashboard </div>
            <div className='flex flex-wrap w-full justify-center  h-auto gap-2 md:gap-5 '>

            {/* BOXES STATS */}
            <div className='bg-custom-purple glass rounded-md h-28 w-40 md:w-44 p-1  '>
              <div className='text-white text-xl iceland-regular '> ORDERS </div>
              <div className='text-slate-950 text-6xl iceland-regular '
               style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
              > 212 </div>
              <div className='absolute bottom-0 right-0 blur-[2.5px] -z-10'>
                <box-icon name='package' type='solid' size='70px' color='white' className='' ></box-icon>
              </div>
             
            </div>
            <div className='bg-custom-purple glass rounded-md h-28 w-40 md:w-44 p-1'>
              <div className='text-white text-xl iceland-regular'> PRODUCTS </div>
              <div className='text-slate-950 text-6xl iceland-regular '
               style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
              > 22 </div>
              <div className='absolute bottom-0 right-0 blur-[2.5px] -z-10 '>
                <box-icon type='solid' name='category' size='70px' color='white' className='' ></box-icon>
              </div>
            </div>
            <div className='bg-custom-purple glass rounded-md h-28 w-40 md:w-44 p-1'>
              <div className='text-white text-xl iceland-regular'> FOLLOWERS </div>
              <div className='text-slate-950 text-6xl iceland-regular '
               style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
              > 1.5k </div>
              <div className='absolute bottom-0 right-0 blur-[2.5px] -z-10'>
                <box-icon name='group' type='solid' size='70px' color='#F3F3E0' className='' ></box-icon>
              </div>
            </div>
            <div className='bg-custom-purple glass rounded-md h-28 w-40 md:w-44 p-1'>
              <div className='text-white text-xl iceland-regular'> TOT INCOME </div>
              <div className='text-slate-950 text-6xl iceland-regular '
               style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
              > 500k </div>
              <div className='absolute bottom-0 right-0 blur-[2.5px] -z-10'>
                <box-icon type='solid' name='coin-stack' size='70px' color='white' ></box-icon>    
              </div>
            </div>
            </div>
        </div>
        <div className='bg-custom-purple glass rounded-md md:h-[200px] h-[170px] w-[70%] sm:w-[50%] md:w-[35%] lg:w-[25%] lg:mr-16  p-2 mb-2 md:mb-0 '>
          <div className="bg-slate-400 h-full w-auto rounded-md">
            <img
              src={logo}
              alt="Shop Logo"
              className="drop-shadow-custom h-full w-full object-cover rounded-md"
              sizes="100%"
            />
          </div>
        </div>
      </div>

      {/* Right Container */}
      <div className="w-full h-[70%] bg-sky-400 p-2 lg:px-16 gap-2  md:flex mb-14 md:mb-0 ">
        <div className=' md:w-[65%] lg:w-[78%] h-[400px] bg-slate-600 rounded-md'></div>
        {/* Notificatoin div */}
        <div className='md:w-[35%] lg:w-[22%] h-[400px] md:h-full mt-2 md:mt-0 lg:h-[400px] bg-custom-purple rounded-md p-2'>
          <div className='flex justify-between align-middle'>
            <div className='text-white text-xl'>Notification</div>
            <div>
              <box-icon type='solid' name='bell' color='white'></box-icon>
            </div>
          </div>
         
          <div className="h-[92%] rounded-sm w-full bg-slate-100 overflow-y-scroll custom-scrollbar p-1">
            {/* Sample Order Notif */}
            <div className='w-full h-12 hover:bg-primary-color cursor-pointer bg-custom-purple hover:duration-200 glass mb-1 flex rounded-sm p-1'>
              <div className='rounded-md bg-white h-full w-10'>
                <img
                  src={girl}
                  alt="Shop Logo"
                  className="drop-shadow-custom h-full w-full object-cover rounded-md"
                  sizes="100%"
                />
              </div>
              <div className=''>
                <div className=' text-white pl-2'> Erica mae </div>
                <div className=' text-slate-200 text-sm pl-2 -mt-1'> Just order an item. </div>
              </div>
            </div>
            <div className='w-full h-12  hover:bg-primary-color cursor-pointer bg-custom-purple hover:duration-200 glass  mb-1 flex rounded-sm p-1'>
              <div className='rounded-md bg-white h-full w-10'>
                <img
                  src={boy}
                  alt="Shop Logo"
                  className="drop-shadow-custom h-full w-full object-cover rounded-md"
                  sizes="100%"
                />
              </div>
              <div className=''>
                <div className=' text-white pl-2'> Paolo </div>
                <div className=' text-slate-200 text-sm pl-2 -mt-1'> Just order an item. </div>
              </div>
            </div>
            <div className='w-full h-12 hover:bg-primary-color cursor-pointer bg-violet-950 hover:duration-200 glass  mb-1 flex rounded-sm p-1'>
              <div className='rounded-md bg-primary-color h-full w-10'>
                <img
                  src={drip}
                  alt="Shop Logo"
                  className="drop-shadow-custom h-full w-full object-cover rounded-md"
                  sizes="100%"
                />
              </div>
              <div className=''>
                <div className=' text-white pl-2'> Dripstr </div>
                <div className=' text-slate-200 text-sm pl-2 -mt-1'> New Updates... </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default MerchantDashboard;
