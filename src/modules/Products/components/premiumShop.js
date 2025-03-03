import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const PremShop = ({ shops }) => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
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
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Correct totalScreens calculation
  const totalScreens = Math.ceil(shops.length / itemsPerScreen);
  
  // Fixed slicing logic
  const getVisibleItems = () => {
    const start = currentScreen * itemsPerScreen;
    return shops.slice(start, start + itemsPerScreen);
  };

  const goToPrevious = () => setCurrentScreen((prev) => Math.max(prev - 1, 0));
  const goToNext = () => setCurrentScreen((prev) => Math.min(prev + 1, totalScreens - 1));

  const Shop = ({ shop }) => (
    <div
      onClick={() => navigate(`/product/merchant-shop/${shop.shop_Name}`, { state: { shop } })}
      className="flex flex-col items-center justify-center p-2 bg-secondary-color hover:bg-[#323232]  shadow-md border-b-2 border-slate-50 rounded-lg transition-all duration-300 cursor-pointer"
    >
      <div className=" py-1 px-1  mb-2 mx-2 md:mx-2 transition-all duration-300 bg-purple-50">
        <img src={shop.shop_image} alt={shop.shop_name} className="w-8 h-8 md:w-10 md:h-10 object-cover" />
      </div>
      <p className="text-center text-xs md:text-sm whitespace-nowrap w-28 truncate text-slate-50 font-medium">
        {shop.shop_name}
      </p>
    </div>
  );

  return (
    <div ref={containerRef} className="w-full max-w-md mx-auto bg-[#141414] rounded-lg shadow-sm py-3 px-4 overflow-hidden">
      <div className="flex items-center w-full">
        <div><p className="font-serif tracking-widest text-lg text-white font-light">Dripstr's <br/> Choice</p></div>
        <div className="flex items-center ml-4 justify-between flex-grow overflow-hidden">
          {currentScreen > 0 && (
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full flex-shrink-0 mr-2 bg-white shadow-sm hover:bg-gray-100 text-gray-700"
              aria-label="Previous Shops"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-sm" />
            </button>
          )}
          <div className="flex justify-start space-x-6 overflow-hidden px-1">
            {getVisibleItems().map((shop, index) => (
              <Shop key={shop.id || index} shop={shop} />
            ))}
          </div>
          {currentScreen < totalScreens - 1 && (
            <button
              onClick={goToNext}
              className="p-2 rounded-full flex-shrink-0 ml-2 bg-white shadow-sm hover:bg-gray-100 text-gray-700"
              aria-label="Next Shops"
            >
              <FontAwesomeIcon icon={faChevronRight} className="text-sm" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PremShop;
