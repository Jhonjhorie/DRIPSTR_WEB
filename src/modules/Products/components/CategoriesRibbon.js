import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const CategoriesRibbon = ({ active, categories, onItemClick }) => {
 
  const containerRef = useRef(null); // Reference to the container
  const [itemsPerScreen, setItemsPerScreen] = useState(1); // Default to 1 to avoid division by 0
  const [currentScreen, setCurrentScreen] = useState(0);

  const calculateItemWidth = () => {
    const screenWidth = window.innerWidth;
    return screenWidth >= 1025 ? 125 : screenWidth >= 768 ? 140 : screenWidth >= 640 ? 80 : 60; 
  };

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;

        const itemWidth = calculateItemWidth();
        const gap = 8;
        const totalItemWidth = itemWidth + gap;

       
        const calculatedItemsPerScreen = Math.floor(containerWidth / totalItemWidth);
        setItemsPerScreen(calculatedItemsPerScreen > 0 ? calculatedItemsPerScreen : 1);
      }
    };

    updateDimensions();

    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  const totalScreens = Math.ceil(categories.length / itemsPerScreen);

  // Get the items visible on the current screen
  const getVisibleItems = () => {
    const start = currentScreen * itemsPerScreen;
    
    return categories.slice(1).slice(start, start + itemsPerScreen);
  };

  const goToPrevious = () => {
    setCurrentScreen((prev) => Math.max(prev - 1, 0));
  };

  const goToNext = () => {
    setCurrentScreen((prev) => Math.min(prev + 1, totalScreens - 1));
  };

  return (
    <div
      ref={containerRef}
      className="relative w-[96%] md:w-[56%] h-16 md:h-20 justify-center  items-center bg-slate-50 rounded-md shadow-lg pr-2 md:pr-3 gap-2 md:gap-8 flex overflow-hidden pl-0"
    >
       <div className=" w-full bg-gradient-to-r top-0 absolute left-0 from-violet-500 to-fuchsia-500 h-1 rounded-t-md z-20">
              {" "}
            </div>
      {/* Title */}
   

      {/* Categories */}
      <div className="flex items-center w-full ">
      <div
              onClick={() => onItemClick(categories[0].label)} 
              key={categories[0]}
              className={`${
                active === categories[0].label
                  ? "opacity-100 border-2 border-primary-color rounded-lg"
                  : "opacity-70 border-secondary-color hover:border-[1px] rounded-none hover:rounded-lg"
              } hover:opacity-100 mr-4 px-1 md:px-4 md:min-w-20 md:h-20 sm:w-16 sm:h-16 w-16 h-16 flex flex-col items-start justify-center bg-slate-50 shadow-sm hover:shadow-lg  duration-300 transition-all ease-in-out`}
            >
              <img
                src={categories[0].icon}
                alt={categories[0].label}
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain mb-1"
              />
              <p
                className={`${
                  active === categories[0].label ? "text-primary-color text-sm md:text-base" : "text-gray-700 text-xs md:text-sm"
                }  font-medium place-content-center justify-center flex items-center duration-300 transition-all`}
              >
                {categories[0].label}
              </p>
            </div>
        {/* Left Arrow */}
        {currentScreen > 0 && (
          <button
            onClick={goToPrevious}
            className="p-1 md:p-2 bg-gray-200 hover:bg-gray-300 rounded-full mr-1 lg:mr-4"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-sm md:text-lg" />
          </button>
        )}

        {/* Categories List */}
        <div className="flex flex-wrap justify-start w-full space-x-4 overflow-hidden">
        
          {getVisibleItems().map((category, index) => (
            <div
              onClick={() => onItemClick(category.label)} 
              key={index}
              className={`${
                active === category.label
                  ? "opacity-100 border-2 border-primary-color  rounded-lg"
                  : "opacity-70 border-secondary-color hover:border-[1px] rounded-none hover:rounded-lg"
              } hover:opacity-100 md:w-20 md:h-20 sm:w-16 sm:h-16 w-10 h-16 flex flex-col items-center justify-center bg-slate-50 shadow-sm hover:shadow-lg  duration-300 transition-all ease-in-out`}
            >
              <img
                src={category.icon}
                alt={category.label}
                className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain mb-1"
              />
              <p
                className={`${
                  active === category.label ? "text-primary-color text-[0.65rem] sm:text-xs md:text-[0.85rem] md:text-base font-semibold" : "text-gray-700 text-[0.65rem] sm:text-xs md:text-[0.80rem]  font-normal"
                }   duration-300 transition-all`}
              >
                {category.label}
              </p>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {currentScreen < totalScreens - 1 && (
          <button
            onClick={goToNext}
            className="p-1 md:p-2 bg-gray-200 hover:bg-gray-300 rounded-full ml-1 lg:mr-4"
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-sm md:text-lg" />
          </button>
        )}
        {currentScreen > 0 && !(currentScreen < totalScreens - 1) && (
          <button
            onClick={goToPrevious}
            className="p-1 md:p-2 bg-gray-200 hover:bg-gray-300 rounded-full ml-1 lg:mr-4"
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-sm md:text-lg" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoriesRibbon;
