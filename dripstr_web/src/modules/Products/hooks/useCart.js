import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/constants/supabase';
import useUserProfile from "@/shared/mulletCheck.js";

const useCarts = () => {
    const [cartItems, setCartItems] = useState([]);
    const { profile } = useUserProfile();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDataCart = useCallback(async () => {
        if (!profile?.id) return;

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
            console.log("Fetched Cart Items:", data);
        } catch (err) {
            console.error("Error fetching cart:", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [profile?.id]);

    useEffect(() => {
        fetchDataCart();
    }, [fetchDataCart]);

    return { cartItems, loading, error, fetchDataCart };
};

export default useCarts;
