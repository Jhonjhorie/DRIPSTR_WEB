import React, { useState, useEffect } from 'react';
import { ReactComponent as Logo } from '@/assets/images/BlackLogo.svg';
import { averageRate } from '../hooks/useRate.ts';
import RateSymbol from '@/shared/products/rateSymbol';
import useGetImage from '../hooks/useGetImageUrl.js';

const ProductCard = ({ item, onClick }) => {
  
  const [currentImage, setCurrentImage] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const imageUrls = useGetImage(item); 

  useEffect(() => {
    let interval;
    
    if (isHovered && imageUrls.length > 1) {
      interval = setInterval(() => {
    
        setImageIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % imageUrls.length;
          setCurrentImage(imageUrls[nextIndex]);
          return nextIndex;
        });
      }, 1000);
    } else if (imageUrls.length > 0) {
      setCurrentImage(imageUrls[0]);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isHovered, imageUrls]); 

  

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="flex flex-col flex-1 max-w-[13.5rem] w-[13.5rem] items-center mx-1 mb-2 rounded-md bg-slate-100 shadow-sm hover:shadow-lg gap-1 hover:scale-105 relative transition-transform duration-300 group"
    >
      {item.str && (
        <Logo className="absolute top-2 left-2 group-hover:opacity-100 duration-300 transition-all opacity-50 w-7 h-7" />
      )}

      <div className="absolute flex flex-row right-2 top-2 ">
        {item.vouchers && (
          <span className="text-xs border border-primary-color px-0.5 font-thin">
            SHOP VOUCHER
          </span>
        )}
        {item.discount > 0 && (
          <span className="text-xs text-white bg-primary-color border border-primary-color px-0.5 font-bold">
            {item.discount}%
          </span>
        )}
      </div>

      {currentImage ? (
        <img
          src={currentImage}
          alt={item.item_Name}
          className="object-contain mb-2 mt-1 w-[180px] h-[200px]"
        />
      ) : (
        <img
          src={require('@/assets/images/blackLogo.png')}
          alt="No Images Available"
          className="object-contain mb-2 mt-1 w-[180px] h-[200px]"
        />
      )}

      <div className="w-full flex flex-col px-3 py-2 bg-slate-200 rounded-b-md">
        {item.item_Name && (
          <p className="text-secondary-color text-md font-medium truncate">
            {item.item_Name}
          </p>
        )}
        <div className="flex flex-row justify-between items-center">
          {/* {item?.item_Variant[0]?.sizes[0]?.price && (
            <p className="text-primary-color text-md font-medium">
              ₱{item.item_Variant[0].sizes[0].price}
            </p>
          )} */}
          <div className="flex flex-row items-center gap-0.5">
            <p className="text-primary-color text-md">
              {averageRate(item.reviews)}
            </p>
            <RateSymbol item={averageRate(item.reviews)} size="4" />
            <span className="text-secondary-color justify-center text-sm">
              | {item.item_Orders} sold
            </span>
          </div>
        
        </div>
    
      </div>
    </div>
  );
};

export default ProductCard;
