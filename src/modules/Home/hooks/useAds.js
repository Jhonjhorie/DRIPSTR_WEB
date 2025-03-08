import { useState, useEffect } from 'react';
import { supabase } from '@/constants/supabase';

const useAds = () => {
  const [ads, setAds] = useState([]);
  const [pShop, setPShop] = useState([]);
  const [loading2, setLoading2] = useState(true);
  const [error2, setError2] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading2(true);
      try {
        const { data, error } = await supabase
          .from('merchant_Subscription')
          .select('subs_Enddate, status, shop:merchant_Id(*)');

        if (error) throw error;

        const today = new Date();

        const filteredData = data.filter((s) => {
          const endDate = s.subs_Enddate ? new Date(s.subs_Enddate) : null;
          return endDate && endDate >= today && s.status !== "Expired";
        });

        const uniqueAds = filteredData
          .flatMap((s) => (s.shop?.shop_Ads || []).map((ad) => ({
            ...ad,
            shop_Name: s.shop.shop_name,
            shop: s.shop,
          })))
          .filter((ad, index, self) => self.findIndex((a) => a.id === ad.id) === index);

        setAds(uniqueAds);

        const uniqueShops = Array.from(
          new Map(
            filteredData.map((s) => [s.shop.id, { ...s.shop, isPremiumShop: true }])
          ).values()
        );

        setPShop(uniqueShops);
      } catch (err) {
        setError2(err?.message || 'An error occurred');
      } finally {
        setLoading2(false);
        console.log("arrerer")
        console.log(pShop)
      }
    };

    fetchData();
  }, []);

  return { ads, pShop, loading2, error2 };
};

export default useAds;
