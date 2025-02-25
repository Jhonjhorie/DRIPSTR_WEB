import React, { useState, useEffect } from "react";
import { supabase } from "../../../constants/supabase"; // Import Supabase client
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '@/assets/images/LOGO.svg'; 
import { averageRate } from "@/modules/Products/hooks/useRate.ts";

const Carousel = () => {
  const [images, setImages] = useState([]); // Fetch from Supabase
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch Images from Supabase
  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase.from("carousel_images").select("image_url");
      
      if (error) {
        console.error("Error fetching images from Supabase:", error.message);
      } else {
        setImages(data.map((item) => item.image_url)); // Store only image URLs
      }
    };

    fetchImages();
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="w-[100%] h-96 md:w-[90%] relative rounded-md bg-slate-200 drop-shadow-lg group overflow-hidden">
      
      {/* Images */}
      <div className="w-full h-full flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        
        {images.map((url, index) => (
          <div key={index} className="flex-shrink-0 h-full w-full">
            <img src={url} alt={`Slide ${index}`} 
              className="w-[80%] h-[80%] md:w-[90%] md:h-[90%] lg:w-full lg:h-full object-cover z-20 duration-300 transition-all relative left-10 lg:left-0 lg:top-0 md:left-5 md:top-4 top-4 "
            />
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button onClick={goToPrevious} className="z-40 absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70">
        <FontAwesomeIcon icon={faChevronLeft} size={28} color="#000" />
      </button>

      {/* Right Arrow */}
      <button onClick={goToNext} className="z-40 absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70">
        <FontAwesomeIcon icon={faChevronRight} size={28} color="#000" />
      </button>

      {/* Dots */}
      <div className="z-40 absolute bottom-0 bg-slate-300 rounded-t-lg left-[10%] flex justify-center items-center space-x-2 w-24 h-4 p-1">
        {images.map((_, index) => (
          <button key={index} onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full drop-shadow-lg transition-all duration-300 ${
              currentIndex === index ? "bg-slate-50 w-4" : "bg-secondary-color w-2"
            }`}>
          </button>
        ))}
      </div>

    
      <img src={require('@/assets/images/others/carouselframe.png')} className='z-10 absolute left-[-2rem] bottom-[0rem] w-[100%] h-[100%] opacity-50 object-cover' />
      <img src={require('@/assets/images/others/carouselframe.png')} className='z-10 absolute right-[-2rem] rotate-180 bottom-[0rem] w-[150%] h-[150%] opacity-10 object-cover' />
      <img src={require('@/assets/images/others/name.png')} className='z-10 absolute right-2 bottom-[-1rem] lg:bottom-0 opacity-50 drop-shadow-none group-hover:drop-shadow-lg duration-300 transition-all  w-[15%] h-[50%] object-contain'/>
      <img src={require('@/assets/images/others/crown.png')} className='-z-20 absolute right-24 md:right-16 lg:right-96 top-16 lg:top-10 opacity-50 drop-shadow-none group-hover:drop-shadow-lg duration-300 transition-all  w-[15%] h-[50%] object-contain'/>
    </div>
  );
};

export default Carousel;
