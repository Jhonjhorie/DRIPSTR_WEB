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

  const addToCart = async (itemId, quantity, selectedColor, selectedSize) => {
    if (!profile?.id) {
      console.error("User not logged in.");
      return { success: false, error: "User not logged in." };
    }
  
    try {
      const { data: existingCartItem, error: fetchError } = await supabase
        .from("cart")
        .select("*")
        .eq("acc_id", profile.id)
        .eq("prod_id", itemId)
        .eq("variant->>variant_Name", selectedColor.variant_Name)
        .eq("size->>id", selectedSize.id)
        .maybeSingle();
  
      if (fetchError) {
        console.error("Error fetching cart item:", fetchError.message);
        return { success: false, error: fetchError.message };
      }
  
      if (existingCartItem) {
        const updatedQuantity = existingCartItem.qty + quantity;
        const { data: updatedCartItem, error: updateError } = await supabase
          .from("cart")
          .update({ qty: updatedQuantity })
          .eq("id", existingCartItem.id);
  
        if (updateError) {
          console.error("Error updating cart item:", updateError.message);
          return { success: false, error: updateError.message };
        }
  
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === existingCartItem.id
              ? { ...item, qty: updatedQuantity }
              : item
          )
        );
  
        return { success: true, data: updatedCartItem };
      } else {
        const { data: newCartItem, error: insertError } = await supabase
          .from("cart")
          .insert([
            {
              acc_id: profile.id,
              prod_id: itemId,
              qty: quantity,
              variant: selectedColor,
              size: selectedSize,
            },
          ])
          .select(); 
  
        if (insertError || !newCartItem || newCartItem.length === 0) {
          console.error("Error adding item to cart:", insertError?.message || "No data returned");
          return { success: false, error: insertError?.message || "No data returned" };
        }
  
        setCartItems((prevItems) => [...prevItems, newCartItem[0]]);
        await fetchDataCart();
        return { success: true, data: newCartItem };
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      return { success: false, error: err.message };
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
    addToCart,
    setCartItems
  };
};

export default useCarts;