import React from 'react';
import SideBar from '../Component/sideBar'
  
function MerchantDashboard() { 

  return (
  <div className="h-screen w-full overflow-y-scroll bg-slate-300 md:px-12 p-2">
    {/* SIDEBAR ABSOLUTE */}
    <div className=' w-auto h-full absolute  z-10 bg-slate-100'>
      <SideBar></SideBar>
    </div>
    

    <div className='bg-slate-500'>This is  a admin Dashboard</div>
  </div>
  );
}



export default MerchantDashboard;
