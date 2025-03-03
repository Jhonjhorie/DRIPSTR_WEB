import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const CategoriesRibbon = ({ active, categories, onItemClick }) => {
  const containerRef = useRef(null);
  const [itemsPerScreen, setItemsPerScreen] = useState(1);
  const [currentScreen, setCurrentScreen] = useState(0);

  // Calculate viewport-responsive dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        
        // Calculate based on container width rather than fixed sizes
        // This gives us more flexibility across different screen sizes
        const itemWidth = containerWidth >= 1024 ? 100 : containerWidth >= 768 ? 90 : 80;
        const gap = 16; // Increased spacing between items
        const calculatedItemsPerScreen = Math.floor((containerWidth - 120) / (itemWidth + gap)); // 120px for arrows and first item
        
        setItemsPerScreen(Math.max(calculatedItemsPerScreen, 1));
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Navigation logic
  const totalScreens = Math.ceil((categories.length - 1) / itemsPerScreen);
  
  const getVisibleItems = () => {
    const start = currentScreen * itemsPerScreen;
    return categories.slice(1).slice(start, start + itemsPerScreen);
  };

  const goToPrevious = () => setCurrentScreen(prev => Math.max(prev - 1, 0));
  const goToNext = () => setCurrentScreen(prev => Math.min(prev + 1, totalScreens - 1));

  // Component for consistent category item rendering
  const CategoryItem = ({ category, isActive, isFirstItem = false }) => (
    <div
      onClick={() => onItemClick(category.label)} 
      className={`
        flex flex-col items-center justify-center p-2
        ${isFirstItem ? 'mr-4' : ''}
        ${isActive 
          ? 'bg-white shadow-md border-b-2 border-primary-color rounded-lg' 
          : 'bg-transparent hover:bg-white hover:shadow-sm'}
        transition-all duration-200 ease-in-out
      `}
    >
      <div className={`
        p-2 rounded-full mb-2
        ${isActive ? 'bg-purple-50' : 'bg-gray-50'}
      `}>
        <img
          src={category.icon}
          alt={category.label}
          className="w-6 h-6 md:w-8 md:h-8 object-contain"
        />
      </div>
      <p className={`
        text-center text-xs md:text-sm whitespace-nowrap
        ${isActive ? 'text-primary-color font-medium' : 'text-gray-600'}
      `}>
        {category.label}
      </p>
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="w-full max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-sm py-3 px-4 overflow-hidden"
    >
    
      
      <div className="flex items-center w-full">
        {/* First category (always visible) */}
        <CategoryItem 
          category={categories[0]} 
          isActive={active === categories[0].label}
          isFirstItem={true}
        />
        
        {/* Navigation area */}
        <div className="flex items-center justify-between flex-grow overflow-hidden">
          {/* Left Arrow */}
          <button
            onClick={goToPrevious}
            className={`
              p-2 rounded-full flex-shrink-0 mr-2
              ${currentScreen > 0 
                ? 'bg-white shadow-sm hover:bg-gray-100 text-gray-700' 
                : 'hidden'}
            `}
            aria-label="Previous categories"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
          </button>

          {/* Scrollable categories */}
          <div className="flex justify-start space-x-6 overflow-hidden px-1">
            {getVisibleItems().map((category, index) => (
              <CategoryItem 
                key={index}
                category={category} 
                isActive={active === category.label} 
              />
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={currentScreen < totalScreens - 1 ? goToNext : goToPrevious}
            className={`
              p-2 rounded-full flex-shrink-0 ml-2
              ${(currentScreen < totalScreens - 1) || (currentScreen > 0)
                ? 'bg-white shadow-sm hover:bg-gray-100 text-gray-700' 
                : 'hidden'}
            `}
            aria-label={currentScreen < totalScreens - 1 ? "Next categories" : "Previous categories"}
          >
            <FontAwesomeIcon 
              icon={currentScreen < totalScreens - 1 ? faChevronRight : faChevronLeft} 
              className="text-sm" 
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriesRibbon;