import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/constants/supabase";
import useUserProfile from "@/shared/mulletCheck.js";

const useCarts = () => {
  const [cartItems, setCartItems] = useState([]);
  const [orderCart, setOrderCart] = useState([]);
  const { profile } = useUserProfile();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart data
  const fetchDataCart = useCallback(async () => {
    if (!profile?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("cart")
        .select(
          `
            id, qty, variant, size, acc_id, prod_id, to_order,
            prod:prod_id (id, item_Name, item_Variant, shop_Name, reviews, item_Orders, discount),
            profile:acc_id (id)
          `
        )
        .eq("acc_id", profile?.id);

      if (error) throw error;

      const sortedData = data.sort((a, b) => a.id - b.id);
      setCartItems(sortedData || []);
      setOrderCart(sortedData.filter((item) => item.to_order === true) || []);
      console.log("Fetched Cart Items:", data);
    } catch (err) {
      console.error("Error fetching cart:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [profile?.id]);

  // Toggle "to_order" for a cart item
  const handleToggleOrder = async (cartId, newValue) => {
    try {
      const { error } = await supabase
        .from("cart")
        .update({ to_order: newValue })
        .eq("id", cartId);

      if (error) throw error;

      // Optimistically update the state
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === cartId ? { ...item, to_order: newValue } : item
        )
      );

      setOrderCart((prevItems) => {
        if (newValue) {
          const updatedItem = cartItems.find((item) => item.id === cartId);
          return updatedItem ? [...prevItems, { ...updatedItem, to_order: newValue }] : prevItems;
        } else {
          return prevItems.filter((item) => item.id !== cartId);
        }
      });

      console.log(`Cart item ${cartId} updated to_order: ${newValue}`);
    } catch (err) {
      console.error("Error updating cart item:", err.message);
      setError(err.message);
    }
  };

  // Edit a cart item
  const handleEdit = async (item, quantity, selectedColor, selectedSize) => {
    if (!profile || !item) return;

    try {
      const { data, error } = await supabase
        .from("cart")
        .update({
          qty: quantity,
          variant: selectedColor,
          size: selectedSize,
        })
        .eq("id", item.id)
        .eq("acc_id", profile.id);

      if (error) throw error;

      // Optimistically update the state
      setCartItems((prevItems) =>
        prevItems.map((prevItem) =>
          prevItem.id === item.id
            ? { ...prevItem, qty: quantity, variant: selectedColor, size: selectedSize }
            : prevItem
        )
      );

      setOrderCart((prevItems) =>
        prevItems.map((prevItem) =>
          prevItem.id === item.id
            ? { ...prevItem, qty: quantity, variant: selectedColor, size: selectedSize }
            : prevItem
        )
      );

      console.log("Item updated successfully:", data);
    } catch (err) {
      console.error("Error updating cart item:", err.message);
      setError(err.message);
    }
  };

 
  useEffect(() => {
    fetchDataCart();
  }, [fetchDataCart]);

  return {
    cartItems,
    orderCart,
    loading,
    error,
    fetchDataCart,
    handleToggleOrder,
    handleEdit,
  };
};

export default useCarts;