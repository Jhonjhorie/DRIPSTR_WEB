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
        const { data, error } = await supabase
          .from('products') 
           .select('*, shops(shop_name)');

        if (error) throw error;
        setProducts(data); 
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
