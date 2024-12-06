import React from 'react';
import ArtistSideBar from '../../Component/ArtistSB'
import { useNavigate } from 'react-router-dom';

function ArtistOrders() {
  const navigate = useNavigate();
  return (
    <div className="h-full w-full bg-slate-300 overflow-y-scroll custom-scrollbar  ">
      <div className="absolute mx-3 right-0 z-10">
        <ArtistSideBar></ArtistSideBar>
      </div>
     Orders


    </div>
    
  );
}

export default ArtistOrders;
