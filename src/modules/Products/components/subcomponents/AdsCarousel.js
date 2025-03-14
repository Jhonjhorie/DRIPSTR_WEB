import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";

const AdsCarousel = ({ shop }) => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    console.log("Shop data received:", shop);

    if (!shop || !shop.shop_Ads) return;
    const adImages = shop.shop_Ads.map((ad) => ad.ad_Image);
    setImages(adImages);
  }, [shop]);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length < 2) return null; 

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  const secondImageIndex = (currentIndex + 1) % images.length;
 if(images){
  return (
    
    <div className="h-full md:min-w-[32rem] w-full md:w-1/2 relative rounded-md bg-slate-200 drop-shadow-lg group overflow-hidden">
      {/* Two Images Side by Side */}
      <div className="w-full h-full flex">
        {/* First Image */}
        <div className="w-1/2 h-40 relative">
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex}`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Second Image */}
        <div className="w-1/2 h-40 relative">
          <img
            src={images[secondImageIndex]}
            alt={`Slide ${secondImageIndex}`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Left Arrow */}
      <button
        onClick={goToPrevious}
        className="z-40 absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70"
      >
        <FontAwesomeIcon icon={faChevronLeft} size="lg" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={goToNext}
        className="z-40 absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70"
      >
        <FontAwesomeIcon icon={faChevronRight} size="lg" />
      </button>

      {/* Dots */}
      <div className="z-40 absolute bottom-0 bg-slate-300 rounded-t-lg left-5 flex justify-center items-center space-x-2 w-24 h-4 p-1">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full drop-shadow-lg transition-all duration-300 ${
              currentIndex === index ? "bg-slate-50 w-4" : "bg-secondary-color w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
 }
  
};

export default AdsCarousel;