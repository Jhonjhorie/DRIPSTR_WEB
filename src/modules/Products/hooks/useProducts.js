import { useState, useEffect } from "react";
import { supabase } from "@/constants/supabase";

const useProducts = (profile) => {
  const [products, setProducts] = useState([]);
  const [premiumShop, setPremiumShop] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
        
        const filteredProducts = profile
          ? productsData.filter((item) => item.shop?.owner_Id !== profile.id)
          : productsData;

          const productsWithPremium = filteredProducts.map((product) => ({
            ...product,
            isPremium: premiumShopIds.has(product.shop.id),
            shop: {
              ...product.shop,
              isPremiumShop: premiumShopIds.has(product.shop.id),
            },
          }));

        setProducts(productsWithPremium);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (profile !== undefined) {
      fetchData();
    }
  }, [profile]);

  return { products, loading, error };
};

export default useProducts;
