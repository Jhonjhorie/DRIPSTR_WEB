import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const CategoriesRibbon = ({ active, categories, onItemClick }) => {
  const containerRef = useRef(null);
  const [itemsPerScreen, setItemsPerScreen] = useState(1);
  const [currentScreen, setCurrentScreen] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const itemWidth = containerWidth >= 1024 ? 100 : containerWidth >= 768 ? 90 : 80;
        const gap = 16;
        const calculatedItemsPerScreen = Math.floor((containerWidth - 120) / (itemWidth + gap));
        setItemsPerScreen(Math.max(calculatedItemsPerScreen, 1));
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const totalScreens = Math.ceil((categories.length - 1) / itemsPerScreen);
  const getVisibleItems = () => {
    const start = currentScreen * itemsPerScreen;
    return categories.slice(1).slice(start, start + itemsPerScreen);
  };

  const goToPrevious = () => setCurrentScreen(prev => Math.max(prev - 1, 0));
  const goToNext = () => setCurrentScreen(prev => Math.min(prev + 1, totalScreens - 1));

  const CategoryItem = ({ category, isActive, isFirstItem = false }) => (
    <div
      onClick={() => onItemClick(category.label)}
      className={`
        flex flex-col items-center justify-center p-2
        ${isFirstItem ? 'mr-4' : ''}
        ${isActive ? 'bg-white shadow-md border-b-2 border-primary-color rounded-lg' : 'bg-gray-50 hover:bg-white hover:shadow-sm'}
        transition-all duration-300
      `}
    >
      <div className={`p-2 rounded-full mb-2 mx-2 md:mx-2 transition-all duration-300 ${isActive ? 'bg-purple-50' : 'bg-gray-50'}`}>
        <img src={category.icon} alt={category.label} className="w-6 h-6 md:w-8 md:h-8 object-contain" />
      </div>
      <p className={`text-center text-xs md:text-sm whitespace-nowrap ${isActive ? 'text-primary-color font-medium' : 'text-gray-600'}`}>{category.label}</p>
    </div>
  );

  return (
    <div ref={containerRef} className="w-full max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-sm py-3 px-4 overflow-hidden">
      <div className="flex items-center w-full">
        <CategoryItem category={categories[0]} isActive={active === categories[0].label} isFirstItem={true} />
        <div className="flex items-center justify-between flex-grow overflow-hidden">
          {currentScreen > 0 && (
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full flex-shrink-0 mr-2 bg-white shadow-sm hover:bg-gray-100 text-gray-700"
              aria-label="Previous categories"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
            </button>
          )}
          <div className="flex justify-start space-x-6 overflow-hidden px-1">
            {getVisibleItems().map((category, index) => (
              <CategoryItem key={index} category={category} isActive={active === category.label} />
            ))}
          </div>
          {currentScreen < totalScreens - 1 && (
            <button
              onClick={goToNext}
              className="p-2 rounded-full flex-shrink-0 ml-2 bg-white shadow-sm hover:bg-gray-100 text-gray-700"
              aria-label="Next categories"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesRibbon;
