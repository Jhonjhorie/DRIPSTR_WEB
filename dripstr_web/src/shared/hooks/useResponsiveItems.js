import { useState, useEffect } from 'react';

const useResponsiveItems = ({ mb = 1, sm = 1, md = 2, lg = 3 } = {}) => {
  const [itemsToShow, setItemsToShow] = useState(mb); 

  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.matchMedia('(max-width: 640px)').matches) {
        setItemsToShow(mb);
      }else if (window.matchMedia('(min-width: 641px) and (max-width: 768px)').matches) {
        setItemsToShow(sm);
      }
       else if (window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches) {
        setItemsToShow(md);
      } else {
        setItemsToShow(lg);
      }
    };

    updateItemsToShow();

    window.addEventListener('resize', updateItemsToShow);

    return () => window.removeEventListener('resize', updateItemsToShow);
  }, [mb, sm, md, lg]);

  return itemsToShow;
};

export default useResponsiveItems;
