import { useState, useEffect } from 'react';
import { supabase } from '@/constants/supabase';
import useUserProfile from "@/shared/mulletCheck.js";

const useCarts = () => {
    const [cartItems, setCartItems] = useState([]);
    const { profile } = useUserProfile(); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      if (!profile?.id) return;  
  
      const fetchData = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from("cart")
            .select(`
              id, qty, variant, size, acc_id, prod_id,
              prod:prod_id (id, item_Name, item_Variant, shop_Name),
              profile:acc_id (id)
            `)
            .eq("acc_id", profile?.id);  
  
          if (error) throw error;
          setCartItems(data || []); 
          console.log("Fetched Cart Items:", data); // Debugging
        } catch (err) {
            console.error("Error fetching cart:", err.message);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [profile?.id]);  
  
    return { cartItems, loading, error };
  };
  
  export default useCarts;
