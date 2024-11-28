import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { categories } from '@/constants/categories.ts';

const CategoriesRibbon = ({ active }) => {
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
        const gap = 48;
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
      className="relative min-w-[96%] md:min-w-[58%] h-20 md:h-28 justify-center items-center bg-slate-50 rounded-full shadow-lg px-2 md:px-3 gap-2 md:gap-8 flex overflow-hidden"
    >
      {/* Title */}
      <div className="flex justify-center gap-2 items-end flex-col">
        <h2 className="text-sm sm:text-lg md:text-2xl font-semibold">Categories</h2>
        <div className="flex justify-center space-x-2">
          {Array.from({ length: totalScreens }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentScreen(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentScreen === index
                  ? "bg-primary-color w-4" // Bar covering 3 dots
                  : "bg-secondary-color w-2"
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center w-full">
      <Link
              to="/"
              key={categories[0]}
              className={`${
                active === categories[0].label
                  ? "opacity-100 border-1 border-primary-color hover:border-[1px] rounded-none hover:rounded-lg"
                  : "opacity-70 border-secondary-color hover:border-[1px] rounded-none hover:rounded-lg"
              } hover:opacity-100 mr-4 ml-1 px-1 md:px-4 md:w-32 md:h-28 sm:w-16 sm:h-20 w-12 h-16 flex flex-col items-start justify-center bg-slate-50 shadow-sm hover:shadow-lg hover:border-[1px] duration-300 transition-all ease-in-out`}
            >
              <img
                src={categories[0].icon}
                alt={categories[0].label}
                className="w-7 h-7 sm:w-10 sm:h-10 md:w-14 md:h-14 object-contain mb-2"
              />
              <p
                className={`${
                  active === categories[0].label ? "text-primary-color" : "text-gray-700"
                } text-xs md:text-sm font-medium place-content-center justify-center flex items-center`}
              >
                {categories[0].label}
              </p>
            </Link>
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
        <div className="flex flex-wrap justify-start w-full space-x-6 md:space-x-4 overflow-hidden">
        
          {getVisibleItems().map((category, index) => (
            <Link
              to="/"
              key={index}
              className={`${
                active === category.label
                  ? "opacity-100 border-1 border-primary-color hover:border-[1px] rounded-none hover:rounded-lg"
                  : "opacity-70 border-secondary-color hover:border-[1px] rounded-none hover:rounded-lg"
              } hover:opacity-100 md:w-24 md:h-28 sm:w-16 sm:h-20 w-12 h-16 flex flex-col items-center justify-center bg-slate-50 shadow-sm hover:shadow-lg hover:border-[1px] duration-300 transition-all ease-in-out`}
            >
              <img
                src={category.icon}
                alt={category.label}
                className="w-7 h-7 sm:w-10 sm:h-10 md:w-14 md:h-14 object-contain mb-2"
              />
              <p
                className={`${
                  active === category.label ? "text-primary-color" : "text-gray-700"
                } text-xs md:text-sm font-medium`}
              >
                {category.label}
              </p>
            </Link>
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
