import { useState, useEffect } from 'react';
import { supabase } from '@/constants/supabase';

const useProducts = () => { 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch products with associated shop
        const { data: productsData, error: productsError } = await supabase
          .from('shop_Product')
          .select('*, shop(*)')
          .eq('is_Post', true);
        
        if (productsError) throw productsError;

        // Fetch premium merchants
        const { data: premiumShops, error: premiumError } = await supabase
          .from('merchant_Subscription')
          .select('merchant_Id');

        if (premiumError) throw premiumError;

        const premiumShopIds = new Set(premiumShops.map((shop) => shop.merchant_Id));

        const productsWithPremium = productsData.map((product) => ({
          ...product,
          isPremium: premiumShopIds.has(product.shop.id), 
        }));

        setProducts(productsWithPremium);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { products, loading, error };
};

export default useProducts;
