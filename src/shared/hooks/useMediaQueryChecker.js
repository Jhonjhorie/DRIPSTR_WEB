import React, { useEffect, useState } from 'react';

const useMediaQueryChecker = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 724);

  const updateScreen = () => {
    setIsMobile(window.innerWidth <= 724); 
  };

  useEffect(() => {
    updateScreen();
    window.addEventListener('resize', updateScreen);

    return () => {
      window.removeEventListener('resize', updateScreen); 
    };
  }, []);

  return isMobile; 
};

export default useMediaQueryChecker;
