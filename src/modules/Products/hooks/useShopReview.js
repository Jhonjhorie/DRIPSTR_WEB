import { useState, useEffect } from "react";
import { supabase } from "@/constants/supabase";

const useReviews = (shopId) => {
  const [reviews, setReviews] = useState([]);
  const [loadingRev, setLoadingRev] = useState(true);
  const [shopRating, setShopRating] = useState(0); // Add shopRating state

  const fetchReviews = async () => {
    try {
      // Fetch all products of the shop
      const { data: products, error: productsError } = await supabase
        .from("shop_Product")
        .select("id")
        .eq("shop_Id", shopId);

      if (productsError) throw productsError;

      // Extract product IDs
      const productIds = products.map((product) => product.id);

      // Fetch all reviews for the products of the shop
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select(`
          *,
          user:user_id (
            full_name,
            profile_picture
          ),
          product:product_id (
            item_Name
          )
        `)
        .in("product_id", productIds)
        .eq("is_hidden", false)
        .order("created_at", { ascending: false });

      if (reviewsError) throw reviewsError;

      // Format reviews
      const formattedReviews = reviewsData.map((review) => ({
        id: review.id,
        userName: review.user?.full_name || "Anonymous",
        profilePicture: review.user?.profile_picture || null,
        rate: review.rating,
        date: new Date(review.created_at).toLocaleDateString(),
        note: review.comment,
        likes: review.likes || [],
        productName: review.product?.item_Name || "Unknown Product", // Include product name
      }));

      const totalRating = formattedReviews.reduce((sum, review) => sum + review.rate, 0);
      const averageRating = formattedReviews.length > 0 ? totalRating / formattedReviews.length : 0;

   
      setReviews(formattedReviews);
      setShopRating(averageRating); 
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingRev(false);
    }
  };

  useEffect(() => {
    if (shopId) {
      fetchReviews();
    }
  }, [shopId]);

  return { reviews, loadingRev, shopRating, fetchReviews }; 
};

export default useReviews;