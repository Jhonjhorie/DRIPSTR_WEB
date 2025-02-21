import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';


const SectionWrapper = ({
  title,
  icon,
  buttonText,
  bgColor,
  textColor = 'text-slate-50',
  width = 'w-[100%]',
  filter,
  children,
}) => {
   const navigate = useNavigate();
   const gotoMall = (filterM, title, icon) => {
    navigate(`/mall`, { state: { filterM, title, icon } });
  }
  return (
    <div className={`${width} ${bgColor} drop-shadow-lg rounded-md flex justify-center flex-col p-2 `}>
      <div className="flex justify-between text-2xl text-slate-500 items-start mb-1 font-[iceland]">
        <p className={`text-bold ${textColor}`}>
          {title} <FontAwesomeIcon fontSize={16} icon={icon} />
        </p>
        {buttonText &&  <button 
        onClick={() => gotoMall(filter, title, icon)}
        className="btn btn-outline bg-primary-color text-white min-h-7 h-7 px-4">
          {buttonText}
        </button>}
       
      </div>
      <div className='ml-3'>
      {children}
      </div>
    </div>
  );
};

export default SectionWrapper;