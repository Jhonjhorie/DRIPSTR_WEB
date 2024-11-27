import React from 'react';
import SideBar from '../Component/Sidebars'
  
function Followers() { 

  
  return (
  <div className="h-full w-full overflow-y-scroll bg-slate-300 custom-scrollbar  md:flex">
    <div className='absolute mx-3 right-0 z-10'>
      <SideBar/>
    </div>
    <div className='w-full h-full bg-slate-300 px-5 md:px-10 lg:px-16 '>
        <a className='absolute z-10 text-custom-purple text-3xl m-2 font-bold'>SHOP FOLLOWERS</a>
        <div className='bg-slate-100 w-full h-full md:flex gap-5 px-10 '>
          <div className='  w-full md:w-1/2 h-full p-1'>
            <div className='mt-12 w-full bg-slate-300 h-[85%] rounded-md shadow-md p-1'>
              <div className='w-full bg-custom-purple rounded-t-md p-1 text-white font-semibold'>Followers</div>
              <div className='h-[94%] w-full bg-slate-100 rounded-b-md overflow-y-scroll relative'></div>
            </div>
          </div>
          <div className=' w-full md:w-1/2 h-full p-1'>
            <div className='mt-12 w-full bg-slate-300 h-[85%] rounded-md shadow-md p-1'>
              <div className='w-full bg-custom-purple rounded-t-md p-1 text-white font-semibold'>Following</div>
              <div className='h-[94%] w-full bg-slate-100 rounded-b-md overflow-y-scroll relative'></div>
            </div>
          </div>
        </div>
    </div>
   
  </div>
  );
}



export default Followers;
