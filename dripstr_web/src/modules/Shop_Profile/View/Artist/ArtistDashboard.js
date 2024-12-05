import React from 'react';
import ArtistSideBar from '../../Component/ArtistSB'
import Lego from '../../../../assets/maintenance.png'
import { useNavigate } from 'react-router-dom';

function MerchantDashboard() {
  const navigate = useNavigate();
  return (
    <div className="h-full w-full bg-slate-300 overflow-y-scroll custom-scrollbar px-20  ">
      <div className="absolute mx-3 right-0 z-10">
        <ArtistSideBar></ArtistSideBar>
      </div>
      <div className='w-full h-full place-items-center justify-items-center  bg-slate-100'>
        <div className='w-72 h-72 pt-24'>
        <img
              src={Lego}
              alt="Shop Logo"
              className="drop-shadow-custom object-cover rounded-full h-full w-full"
            />
        </div>
        <div className=' text-slate-800 iceland-regular text-3xl font-semibold  '>Building Artist Soon to rise... </div>

      </div>
    </div>
    
  );
}

export default MerchantDashboard;
