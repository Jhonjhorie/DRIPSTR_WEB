import React from 'react';
import SideBar from '../Component/Sidebars'
import girl from '../../../assets/shop/erica.jpg';
import boy from '../../../assets/shop/sample2.jpg'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const { useState } = React;

function Notifications() { 
  const [selectedOption, setSelectedOption] = useState("");


  const profiles = Array(5).fill({
    name: "Jane Doe",
    message: "Follow your shop.",
  });
  const profile = Array(5).fill({
    name: "Paolo",
    message: "Order an Item.",
  });
  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };
  
  return (
  <div className="h-full w-full overflow-y-scroll bg-slate-300 custom-scrollbar ">
      <div className="absolute mx-3 right-0 z-10">
        <SideBar />
      </div>
      <div className='w-full  h-full  md:px-10 lg:px-16'>
         <div className='w-full h-full bg-slate-300 px-5 md:px-10 place-items-center'>
          <div className='w-full md:w-2/3 lg:w-1/2 h-full bg-slate-100 p-2 shadow-md mb-16 md:mb-0'>
            <div className='text-3xl text-custom-purple font-bold p-2 justify-between w-full flex place-items-center'>
              Notifications 
              <div className='flex gap-2 place-items-center'>
                <select
                  id="options"
                  value={selectedOption}
                  onChange={handleChange}
                  className="w-full bg-slate-300 text-slate-800 font-medium border py-1 px-2 rounded-md text-sm"
                >
                  <option value="option1" >All</option>
                  <option value="option2">Newest</option>
                  <option value="option3">Month Ago</option>
                  <option value="option4">Year Ago</option>
                  <option value="option5">Oldest</option>
                </select>
                 
                <FontAwesomeIcon icon={faBell}  className='text-xl'/> 
              </div> 
            </div>
            <div className='bg-slate-200 h-[550px] rounded-md w-full custom-scrollbar overflow-y-scroll p-2 '>
            {profiles.map((profile, index) => (
              <div
                key={index}
                className="w-full h-12 hover:bg-custom-purple cursor-pointer bg-slate-400 hover:duration-200 glass mb-1 flex rounded-sm p-1 justify-between"
              >
                <div className='flex'>
                  <div className="rounded-md bg-white h-full w-10">
                    <img
                      src={girl}
                      alt={`Profile picture of ${profile.name}`}
                      className="drop-shadow-custom h-full w-full object-cover rounded-md"
                      sizes="100%"
                    />
                  </div>
                  <div>
                    <div className="text-slate-900 pl-2">{profile.name}</div>
                    <div className="text-slate-800 text-sm pl-2 -mt-1">
                      {profile.message}
                    </div>
                  </div>
                </div>        
              </div>
            ))}
            {profile.map((profile2, index) => (
              <div
                key={index}
                className="w-full h-12 hover:bg-custom-purple cursor-pointer bg-slate-400 hover:duration-200 glass mb-1 flex rounded-sm p-1 justify-between"
              >
                <div className='flex'>
                  <div className="rounded-md bg-white h-full w-10">
                    <img
                      src={boy}
                      alt={`Profile picture of ${profile2.name}`}
                      className="drop-shadow-custom h-full w-full object-cover rounded-md"
                      sizes="100%"
                    />
                  </div>
                  <div>
                    <div className="text-slate-900 pl-2">{profile2.name}</div>
                    <div className="text-slate-800 text-sm pl-2 -mt-1">
                      {profile2.message}
                    </div>
                  </div>
                </div>        
              </div>
            ))}
            {profiles.map((profile, index) => (
              <div
                key={index}
                className="w-full h-12 hover:bg-custom-purple cursor-pointer bg-slate-400 hover:duration-200 glass mb-1 flex rounded-sm p-1 justify-between"
              >
                <div className='flex'>
                  <div className="rounded-md bg-white h-full w-10">
                    <img
                      src={girl}
                      alt={`Profile picture of ${profile.name}`}
                      className="drop-shadow-custom h-full w-full object-cover rounded-md"
                      sizes="100%"
                    />
                  </div>
                  <div>
                    <div className="text-slate-900 pl-2">{profile.name}</div>
                    <div className="text-slate-800 text-sm pl-2 -mt-1">
                      {profile.message}
                    </div>
                  </div>
                </div>        
              </div>
            ))}
            </div>
          </div>
         </div>
      </div>
      
  </div>
  );
}



export default Notifications;
