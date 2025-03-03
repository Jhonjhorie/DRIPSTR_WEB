import React, { useState, useEffect } from "react";

const AdsBanner = ({ ads = [] }) => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

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

  // Get the second ad (ensure it's not the same as the first one)
  const secondAdIndex = (currentAdIndex + 1) % ads.length;

  return (
    <div className="w-[20rem] max-h-[24rem] overflow-hidden rounded-lg shadow-md bg-white relative flex flex-col">
      <div className="w-full h-1/2 relative">
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

      <div className="w-full h-1/2 relative">
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
        <div className="absolute bottom-3 right-3 flex gap-2 z-20">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => goToAd(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentAdIndex ? "bg-white" : "bg-white/50"
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
