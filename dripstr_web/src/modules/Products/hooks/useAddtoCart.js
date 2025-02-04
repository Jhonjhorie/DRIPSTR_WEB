import { supabase } from '@/constants/supabase';


const addToCart = async (profileId, itemId, quantity, selectedColor, selectedSize) => {
  try {
    const { data, error } = await supabase.from("cart").insert([
      {
        acc_id: profileId,
        prod_id: itemId,
        qty: quantity,
        variant: selectedColor,
        size: selectedSize,
      },
    ]);

    if (error) {
      console.error("Error adding item to cart:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: err.message };
  }
};

export default addToCart;