import { useState, useEffect } from 'react';
import { supabase } from '@/constants/supabase';

const useAds = () => {
  const [ads, setAds] = useState([]);
  const [loading2, setLoading2] = useState(true);
  const [error2, setError2] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading2(true);
      try {
        const { data, error } = await supabase
          .from('merchant_Subscription')
          .select('*, shop:merchant_Id(shop_Ads)')
  
        if (error) throw error2;
  

        const today = new Date(); // Get the current date

        const uniqueAds = data
        .filter((s) => {
            const endDate = s.subs_Enddate ? new Date(s.subs_Enddate) : null;
            return endDate && endDate >= today; 
          })
          .filter((s) => s.status != "Expired")
          .flatMap((s) => s.shop?.shop_Ads || [])
          .filter((ad, index, self) => self.findIndex(a => a.id === ad.id) === index);
  
        setAds(uniqueAds); 
      } catch (err) {
        setError2(err.message);
      } finally {
        setLoading2(false);
      }
    };
  
    fetchData();
  }, []);

  return { ads, loading2, error2 }; 
};

export default useAds;
