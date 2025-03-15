import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

const SectionWrapper = ({
  title,
  icon,
  buttonText,
  bgColor = 'bg-gray-50',
  textColor = 'text-gray-800',
  filterM,
  children,
  shopFil
}) => {
  const navigate = useNavigate();
  
  const gotoMall = (filterM, title, icon, shopFil) => {
    navigate(`/mall`, { state: { filterM, title, icon, shopFil } });
  };
  
  return (
    <div className={`w-full ${bgColor} shadow-sm rounded-lg overflow-hidden flex flex-col`}>
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
        <h2 className={`font-medium ${textColor} flex items-center gap-2`}>
          {title}
          {icon && <FontAwesomeIcon icon={icon} className="text-secondary-color" />}
        </h2>
        
        {buttonText && (
          <button 
            onClick={() => gotoMall(filterM, title, icon, shopFil)}
            className="text-sm px-3 py-1 bg-[#141414] hover:bg-secondary-color text-white rounded transition-colors duration-200 flex items-center"
          >
            {buttonText}
          </button>
        )}
      </div>
      
      <div className="py-2 px-1 md:p-4">
        {children}
      </div>
    </div>
  );
};

export default SectionWrapper;