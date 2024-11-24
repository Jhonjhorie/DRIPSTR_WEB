import React from 'react';
import SideBar from '../Component/Sidebars'
  
function Followers() { 

  
  return (
  <div className="h-full w-full overflow-y-scroll bg-slate-300 custom-scrollbar  md:flex">
    <div className='absolute mx-3 right-0'>
      <SideBar/>
    </div>
    <div className='w-full md:w-1/2 h-full bg-slate-500'>
        Followers
    </div>
    <div className='w-full md:w-1/2 h-full bg-slate-300'></div>
  </div>
  );
}



export default Followers;
