import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdsBanner = ({ ads = [] }) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (ads.length === 0) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [ads.length]);

  if (!ads || ads.length < 2) {
    return null; // Require at least 2 ads to display
  }

  const goToAd = (index) => {
    setCurrentAdIndex(index);
  };

  const secondAdIndex = (currentAdIndex + 1) % ads.length;

  return (
    <div className="w-full md:ml-2 mt-1 md:mt-0 md:w-[20rem] h-[20rem] md:h-full max-h-[24rem] overflow-hidden rounded-lg shadow-md bg-white relative flex md:flex-col">
      <div
        className="w-1/2 md:w-full h-full md:h-1/2 relative cursor-pointer"
        onClick={() => {
          navigate(`/product/merchant-shop/${ads[currentAdIndex].shop_Name}`, {
            state: { shop: ads[currentAdIndex].shop }, 
          });
        }}
      >
        <img
          src={ads[currentAdIndex].ad_Image}
          alt={ads[currentAdIndex].ad_Name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-medium text-lg">
            {ads[currentAdIndex].ad_Name}
          </h3>
        </div>
      </div>

      <div
        className="w-1/2 md:w-full h-full md:h-1/2 relative cursor-pointer"
        onClick={() => {
          navigate(`/product/merchant-shop/${ads[secondAdIndex].shop_Name}`, {
            state: { shop: ads[secondAdIndex].shop }, 
          });
        }}
      >
        <img
          src={ads[secondAdIndex].ad_Image}
          alt={ads[secondAdIndex].ad_Name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-medium text-lg">
            {ads[secondAdIndex].ad_Name}
          </h3>
        </div>
      </div>

      {/* Navigation dots */}
      {ads.length > 2 && (
        <div className="absolute bottom-0 left-5  gap-2 z-20 bg-slate-300 rounded-t-lg flex justify-center items-center space-x-2 w-24 h-4 p-1">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => goToAd(index)}
              className={`h-2 rounded-full drop-shadow-lg transition-all duration-300 ${
                index === currentAdIndex ? "bg-slate-50 w-4" : "bg-secondary-color w-2"
              }`}
              aria-label={`Go to advertisement ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdsBanner;
