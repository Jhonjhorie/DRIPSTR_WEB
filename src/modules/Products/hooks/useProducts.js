import { useState, useEffect } from "react";
import { supabase } from "@/constants/supabase";

const useProducts = (profile) => {
  const [products, setProducts] = useState([]);
  const [premiumShop, setPremiumShop] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch reviews for a product
  const fetchReviews = async (productId) => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("product_id", productId)
        .eq("is_hidden", false);

      if (error) throw error;

      return data;
    } catch (err) {
      console.error("Error fetching reviews:", err);
      return [];
    }
  };

  // Function to calculate average rating
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from("shop_Product")
          .select("*, shop(*)")
          .eq("is_Post", true);

        if (productsError) throw productsError;

        // Fetch premium shops
        const { data: premiumShops, error: premiumError } = await supabase
          .from("merchant_Subscription")
          .select("merchant_Id");

        if (premiumError) throw premiumError;

        const premiumShopIds = new Set(premiumShops.map((shop) => shop.merchant_Id));

        // Fetch reviews for each product and calculate average rating
        const productsWithReviews = await Promise.all(
          productsData.map(async (item) => {
            const reviews = await fetchReviews(item.id);
            const averageRating = calculateAverageRating(reviews);

            return {
              ...item,
              isOwner: profile ? item.shop?.owner_Id === profile.id : false,
              isPremium: premiumShopIds.has(item.shop.id),
              shop: {
                ...item.shop,
                isPremiumShop: premiumShopIds.has(item.shop.id),
              },
              reviews,
              averageRating, // Add average rating to the product
            };
          })
        );

        setProducts(productsWithReviews);
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