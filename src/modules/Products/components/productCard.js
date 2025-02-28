import React, { useState, useEffect } from 'react';
import { ReactComponent as Logo } from '@/assets/images/BlackLogo.svg';
import { averageRate } from '../hooks/useRate.ts';
import RateSymbol from '@/shared/products/rateSymbol';
import useGetImage from '../hooks/useGetImageUrl.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

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
      className="flex flex-col flex-1 max-w-[13rem] w-[12rem] items-center mb-2 rounded-sm bg-white shadow-sm hover:shadow-lg hover:border-[1px] border-primary-color hover:scale-105 relative transition-transform duration-300 group"
    >

      <div className="absolute flex flex-row right-2 top-2 ">
        {item.vouchers && (
          <span className="text-xs border border-primary-color px-0.5 font-thin">
            SHOP VOUCHER
          </span>
        )}
      
      </div>

      {currentImage ? (
        <img
          src={currentImage}
          alt={item.item_Name}
          className="object-contain  w-[190px] h-[190px]"
        />
      ) : (
        <div>
        <img
        src={require("@/assets/emote/hmmm.png")}
          alt="No Images Available"
          className="object-none  w-[200px] h-[200px]"
        />
                        <p className="font-semibold text-sm absolute bottom-20 left-6">No image provided.</p>
        </div>
      )}

      <div className="w-full flex flex-col px-2 py-1 gap-1  bg-slate-50  rounded-b-md">
        {item.item_Name && (
        <div className='h-10 flex'>
         
          <p className="text-secondary-color text-sm line-clamp-2 break-words">
          {item.texture_3D && (
              <span className='rounded-sm bg-primary-color text-xs mr-0.5 text-white px-0.5'>Drip3D</span>
            )}
            {item.item_Name}
          </p>
          </div>
        )}
        <div className="flex flex-col justify-between gap-2">
          
           <p className="text-primary-color text-xs  flex items-center">
          
           ₱<span className='text-[1.10rem] font-semibold'>{
            item?.item_Variant[0]?.sizes[0]?.price != null ?  item.discount > 0
            ? (Number(item?.item_Variant[0]?.sizes[0]?.price) * (1 - item.discount / 100)).toFixed(2)
            : Number(item?.item_Variant[0]?.sizes[0]?.price).toFixed(2) : (0).toFixed(2)
           }</span>
             {item.discount > 0 && (
          <span className="text-[0.65rem] items-center ml-1 text-primary-color bg-purple-200 px-0.5 ">
            -{item.discount}%
          </span>
        )}
         </p>
          
         <div className="flex flex-row items-center gap-0.5">
            <p className="text-primary-color text-xs">
              {averageRate(item.reviews)}
            </p>
            <RateSymbol item={averageRate(item.reviews)} size="4" />
            <span className="text-secondary-color justify-center text-xs">
              | {item.item_Orders} sold
            </span>
          </div>
          <div className='flex text-slate-400 text-[0.5rem] gap-1 '>
          <FontAwesomeIcon icon={faLocationDot}/> 
          <p className=" truncate">
              {item.shop.address}
            </p>
          </div>
        
        </div>
    
      </div>
    </div>
  );
};

export default ProductCard;
