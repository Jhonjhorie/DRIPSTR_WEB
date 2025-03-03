import { useState, useEffect } from "react";
import { supabase } from "@/constants/supabase";

const useProducts = (profile) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!profile) return; 

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: productsData, error: productsError } = await supabase
          .from("shop_Product")
          .select("*, shop(*)")
          .eq("is_Post", true);

        if (productsError) throw productsError;

        const { data: premiumShops, error: premiumError } = await supabase
          .from("merchant_Subscription")
          .select("merchant_Id");

        if (premiumError) throw premiumError;

        const premiumShopIds = new Set(premiumShops.map((shop) => shop.merchant_Id));

        const filteredProducts = productsData.filter(
          (item) => item.shop?.owner_Id !== profile.id 
        );

        const productsWithPremium = filteredProducts.map((product) => ({
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
  }, [profile]); 

  return { products, loading, error };
};

export default useProducts;
