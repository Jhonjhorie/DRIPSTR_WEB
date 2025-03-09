import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft, faShoppingCart } from "@fortawesome/free-solid-svg-icons";


const AdsCarousel = (ads) => {
  const [images, setImages] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(0);
useEffect(() => {
    setImages(ads)
}, [ads])
  


  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className=" h-full w-full relative rounded-md bg-slate-200 drop-shadow-lg group overflow-hidden">
      
      {/* Images */}
      <div className="w-full h-full flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        
        {images.map((url, index) => (
          <div key={index} className="flex-shrink-0 h-full w-full">
            <img src={url} alt={`Slide ${index}`} 
              className="w-full h-full md:w-[90%] md:h-[90%] lg:w-full lg:h-full object-cover z-20 duration-300 transition-all relative  left-0 top-0 "
            />
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button onClick={goToPrevious} className="z-40 absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70">
        <FontAwesomeIcon icon={faChevronLeft} size={28} color="#fff" />
      </button>

      {/* Right Arrow */}
      <button onClick={goToNext} className="z-40 absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70">
        <FontAwesomeIcon icon={faChevronRight} size={28} color="#fff" />
      </button>

      {/* Dots */}
      <div className="z-40 absolute bottom-0 bg-slate-300 rounded-t-lg left-5 flex justify-center items-center space-x-2 w-24 h-4 p-1">
        {images.map((_, index) => (
          <button key={index} onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full drop-shadow-lg transition-all duration-300 ${
              currentIndex === index ? "bg-slate-50 w-4" : "bg-secondary-color w-2"
            }`}>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdsCarousel;
