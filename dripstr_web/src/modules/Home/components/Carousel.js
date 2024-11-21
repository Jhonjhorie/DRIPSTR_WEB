import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { faChevronRight, faChevronLeft, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { ReactComponent as Logo } from '../../../assets/LOGO.svg'; 

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    setCurrentIndex(isFirstSlide ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    setCurrentIndex(isLastSlide ? 0 : currentIndex + 1);
  };

  return (
    <div className="w-[100%] h-80 md:w-[65%] relative rounded-md bg-slate-200 drop-shadow-lg group overflow-hidden">
        
      {/* Images */}
      <div
        className="w-full h-full flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        
      >
        {images.map((item, index) => (
          <div key={index} className="flex-shrink-0 h-full w-full ">
            <img
              src={typeof item.url === 'string' ? item.url : item.url.default}
              className="w-[80%] h-[80%] md:w-[90%] md:h-[90%] lg:w-full lg:h-full object-contain z-20 group-hover:scale-90 duration-300 transition-all relative left-10 lg:left-0 lg:top-0 md:left-5 md:top-4 top-8 group-hover:left-24"
            />
            {item.product && (
             <p className={`relative text-secondary-color text-4xl bottom-0 left-4 md:text-6xl lg:text-8xl lg:bottom-28 md:bottom-10 sm:left-2 font-bold group-hover:bottom-1 lg:group-hover:bottom-16 md:group-hover:bottom-8 group-hover:text-[2.5rem] md:group-hover:text-5xl line-clamp-1 group-hover:text-primary-color  duration-300 transition-all`}>
                {item.product}
              </p>
            )}
            {item.rate && (
              <div className='bottom-72 md:bottom-[22rem] lg:bottom-96 right-0 lg:right-4 flex flex-row relative justify-end space-x-0 md:space-x-[-1rem] group-hover:bottom-[19rem] md:group-hover:bottom-[22rem] group-hover:right-0 duration-300 transition-all items-start'>
              <p className='text-6xl lg:text-8xl text-primary-color drop-shadow-2xl  font-bold'>
                {item.rate.toFixed(1)}  
              </p>
              {item.rate >= 4 && (
                 <img src={require('../../../assets/images/others/fillfull.png')} className='-z-10 relative w-24 md:w-28 lg:w-32 object-contain'
                 />
              )}
                {item.rate < 4 && item.rate > 2 && (
                 <img src={require('../../../assets/images/others/fillhalf.png')} className='-z-10 relative w-24 md:w-32 object-contain'
                 />
                )}
                {item.rate < 2 && (
                 <img src={require('../../../assets/images/others/fillno.png')} className='-z-10 relative w-24 md:w-32 object-contain'
                 />
                )} 
              </div>
            )}
            {item.shop && (
              <Link to='/'
              className='relative bottom-[24.25rem] md:bottom-[28rem] lg:bottom-[33rem] group-hover:bottom-[25rem] md:group-hover:bottom-[28rem] lg:group-hover:bottom-[31rem] w-fit left-0 sm:left-2 group-hover:left-0 flex  rounded-lg md:rounded-r-lg group-hover:rounded-l-none  md:group-hover:rounded-tr-none hover:bg-primary-color bg-secondary-color p-3 group-hover:p-4  duration-300 transition-all'
              >
                <p className=' group-hover:text-2xl text-lg font-bold text-slate-50 duration-300 transition-all drop-shadow-2xl'>
                {item.shop}
                </p>
              </Link>
              
            )}
            <Link
            to='/'
            className='flex flex-row w-fit relative bottom-[7.9rem] sm:bottom-[7.8rem]  md:bottom-[12rem] lg:bottom-[17.3rem] group-hover:bottom-[10rem] sm:group-hover:bottom-[10rem] md:group-hover:bottom-[13.5rem] lg:group-hover:bottom-[16.5rem] transition-all duration-300 left-60 sm:left-[50vw] md:left-[27vw]  lg:left-[38vw] bg-secondary-color px-6 lg:px-8  justify-end gap-2 rounded-t-md py-0.5 hover:bg-primary-color items-center'
            >
               <p className='text-xl font-bold text-slate-50'>
                TAP TO DRIP</p>
                <FontAwesomeIcon icon={faShoppingCart} size={24} color="#fff" />
            </Link>
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70"
      >
         <FontAwesomeIcon icon={faChevronLeft} size={28} color="#000" />
      </button>

      {/* Right Arrow */}
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70"
      >
         <FontAwesomeIcon icon={faChevronRight} size={28} color="#000" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-0 bg-slate-300 rounded-t-lg left-[10%]  flex justify-center space-x-2 w-24 h-4 p-1">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full drop-shadow-lg ${
              currentIndex === index
                ? "bg-slate-50"
                : currentIndex === index-1 || currentIndex === index+1  ? "bg-primary-color":"bg-secondary-color"
            }`}
          ></button>
        ))}
      </div>
      <Logo
            className='-z-10 absolute left-2 top-16 lg:top-10 opacity-100 drop-shadow-none group-hover:drop-shadow-lg duration-300 transition-all group-hover:scale-110 w-[50%] h-[50%] object-contain'
           />
        <img src={require('../../../assets/images/others/carouselframe.png')} 
            className='-z-20 absolute left-[-2rem] bottom-[0rem] w-[100%] h-[100%] opacity-50 object-cover'
            />
            <img src={require('../../../assets/images/others/carouselframe.png')} 
            className='-z-20 absolute right-[-2rem] rotate-180 bottom-[0rem] w-[150%] h-[150%] opacity-10 object-cover'
            />
            <img src={require('../../../assets/images/others/name.png')} 
            className='-z-10 absolute right-2 bottom-[-1rem] lg:bottom-0 opacity-50 drop-shadow-none group-hover:drop-shadow-lg duration-300 transition-all group-hover:scale-110 w-[15%] h-[50%] object-contain'/>
            <img src={require('../../../assets/images/others/crown.png')}  
            className='-z-10 absolute right-24 lg:right-96 top-16 lg:top-10 opacity-50 drop-shadow-none group-hover:drop-shadow-lg duration-300 transition-all group-hover:scale-110 w-[15%] h-[50%] object-contain'/>
      
    </div>
  );
};
export default Carousel;
