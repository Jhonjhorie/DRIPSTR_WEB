import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as LogoB } from '@/assets/images/BlackLogo.svg';
import { ReactComponent as Logo } from '@/assets/images/LOGO.svg';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const MallRibbon = ({ active }) => {
  const items = [
    { label: 'Drip Mall', color: 'bg-primary-color', activeColor: 'text-secondary-color' },
    { label: 'Just for You', color: 'bg-secondary-color', activeColor: 'text-secondary-color' },
    { label: 'Followed Store', color: 'bg-blue-700', activeColor: 'text-secondary-color' },
    { label: 'Popular/ Trend', color: 'bg-red-700', activeColor: 'text-secondary-color' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Show only two items at a time
  const visibleItems = items.slice(currentIndex, currentIndex + 2);

  const next = () => {
    if (currentIndex + 2 < items.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="relative w-[40%] flex flex-col items-center">
      {/* Carousel Wrapper */}
      <div className="flex w-full justify-evenly items-center px-1 md:px-3 gap-1">
        {/* Prev Button */}
        <button
          onClick={prev}
          className={`px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 ${
            currentIndex === 0 ? 'opacity-50 hidden' : ''
          }`}
          disabled={currentIndex === 0}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-sm md:text-lg" />
        </button>
        <div className='justify-evenly items-center  gap-1 md:gap-4 flex'>
        {/* Visible Items */}
        {visibleItems.map((item, index) => (
          <Link
            to={'/'}
            key={currentIndex + index} // Ensure unique keys across transitions
            className={`h-24 flex-1 ${item.color} group text-slate-50 rounded-lg items-center justify-center text-sm md:text-md flex py-4 px-12 md:px-16 font-bold drop-shadow-lg btn glass hover:${item.activeColor} overflow-hidden`}
          >
            {active == index + currentIndex ? (
              <Logo className="h-32 w-28 absolute -left-4 top-1 shadow-lg group-hover:scale-150 duration-500 transition-all -z-10" />
            ) : (
              <LogoB className="h-32 w-28 absolute -left-4 group-hover:scale-150 duration-500 transition-all top-1 shadow-lg opacity-50 -z-10" />
            )}
            {item.label}
          </Link>
        ))}
        </div>

        {/* Next Button */}
        <button
          onClick={next}
          className={`px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 ${
            currentIndex + 2 >= items.length ? 'opacity-50 hidden' : ''
          }`}
          disabled={currentIndex + 2 >= items.length}
        >
          <FontAwesomeIcon icon={faChevronRight} className="text-sm md:text-lg" />
        </button>
      </div>
    </div>
  );
};

export default MallRibbon;
