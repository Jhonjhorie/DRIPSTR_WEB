import { useState, useEffect } from 'react';
import { supabase } from '@/constants/supabase';

const useFollowedStore = (profile) => {
  const [fShop, setFShop] = useState([]);
  const [loadingfShop, setLoadingfShop] = useState(true);
  const [errorfShop, setErrorfShop] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      setLoadingfShop(true);
      try {
        const { data, error } = await supabase
          .from('merchant_Followers')
          .select('shop:shop_id(*)')
          .eq('acc_id', profile.id);

        if (error) throw error;

        const shops = data.map((item) => item.shop);
        setFShop(shops);
      } catch (err) {
        setErrorfShop(err?.message || 'An error occurred');
      } finally {
        setLoadingfShop(false);
      }
    };

    if (profile) fetchData();
  }, [profile]);

  return { fShop, loadingfShop, errorfShop };
};

export default useFollowedStore;
