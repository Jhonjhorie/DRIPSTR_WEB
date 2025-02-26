import { useEffect, useState } from 'react';

const useMediaQueryChecker = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 724);

  const updateScreen = () => {
    setIsMobile(window.innerWidth <= 724); // Mobile if width <= 724, otherwise desktop
  };

  useEffect(() => {
    updateScreen();
    window.addEventListener('resize', updateScreen);

    return () => {
      window.removeEventListener('resize', updateScreen); // Remove the listener on cleanup
    };
  }, []);

  return isMobile; // Return whether it's mobile or not
};

export default useMediaQueryChecker;
