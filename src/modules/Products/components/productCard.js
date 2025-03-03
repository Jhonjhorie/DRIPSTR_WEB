import React, { useState, useEffect } from 'react';
import { ReactComponent as Logo } from '@/assets/images/BlackLogo.svg';
import { averageRate } from '../hooks/useRate.ts';
import RateSymbol from '@/shared/products/rateSymbol';
import useGetImage from '../hooks/useGetImageUrl.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

const ProductCard = ({ item, onClick, isSmall }) => {
  const [currentImage, setCurrentImage] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const imageUrls = useGetImage(item);

  // Handle image carousel on hover
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

    return () => clearInterval(interval);
  }, [isHovered, imageUrls]);

  // Calculate discounted price
  const price = item?.item_Variant[0]?.sizes[0]?.price;
  const finalPrice = price != null 
    ? (item.discount > 0 
      ? (Number(price) * (1 - item.discount / 100)).toFixed(2) 
      : Number(price).toFixed(2)) 
    : (0).toFixed(2);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="flex flex-col hover:scale-105  w-full max-w-[12rem] bg-white rounded-md shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
    >
      {/* Image container */}
      <div className="relative h-48">
        {/* Voucher badge */}
        {item.vouchers && (
          <span className="absolute right-2 top-2 text-xs bg-white border border-primary-color px-1 py-0.5 text-primary-color font-medium z-10">
            VOUCHER
          </span>
        )}
        
        {/* Product image */}
        {currentImage ? (
          <img
            src={currentImage}
            alt={item.item_Name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
            <img
              src={require("@/assets/emote/hmmm.png")}
              alt="No Images Available"
              className="w-24 h-24 opacity-70"
            />
            <p className="text-xs text-gray-500 mt-2">No image available</p>
          </div>
        )}
      </div>

      {/* Product info */}
      <div className="p-3 flex flex-col gap-2 bg-white">
        {/* Product name */}
        <div className="h-10">
          <p className="text-gray-800 text-sm line-clamp-2">
          {item.isPremium && (
              <span className="bg-secondary-color h-full text-white font-serif font-thin text-xs px-1 py-0.5 mr-0.5 rounded">DripStr</span>
            )}
            {item.texture_3D && (
              <span className="bg-primary-color h-full font-[iceland] text-white text-sm px-1 py-0.5 mr-0.5 rounded">3D</span>
            )}
            
            {item.item_Name}
          </p>
        </div>
        
        {/* Price section */}
        <div className="flex items-center">
          <span className="text-primary-color text-xs">₱</span>
          <span className="text-primary-color text-lg font-medium">{finalPrice}</span>
          {item.discount > 0 && (
            <span className="ml-2 text-xs bg-purple-100 text-primary-color px-1 py-0.5 rounded">
              -{item.discount}%
            </span>
          )}
        </div>
        {!isSmall && <>
        {/* Ratings and orders */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-gray-700">{averageRate(item.reviews)}</span>
          <RateSymbol item={averageRate(item.reviews)} size="4" />
          <span className="text-gray-500">• {item.item_Orders} sold</span>
        </div>
        
        {/* Location */}
        
        <div className="flex items-center text-gray-400 text-xs gap-1">
          <FontAwesomeIcon icon={faLocationDot} className="w-3 h-3" />
          <p className="truncate">{item.shop.address}</p>
        </div>
        </>
        }
      </div>
    </div>
  );
};

export default ProductCard;
