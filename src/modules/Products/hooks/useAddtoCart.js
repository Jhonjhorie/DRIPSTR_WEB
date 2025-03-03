import { supabase } from '@/constants/supabase';

const addToCart = async (profileId, itemId, quantity, selectedColor, selectedSize) => {
  try {
   
    const { data: existingCartItem, error: fetchError } = await supabase
      .from("cart")
      .select("*")
      .eq("acc_id", profileId) 
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

      return { success: true, data: updatedCartItem };
    } else {
     
      const { data: newCartItem, error: insertError } = await supabase
        .from("cart")
        .insert([
          {
            acc_id: profileId,
            prod_id: itemId,
            qty: quantity,
            variant: selectedColor,
            size: selectedSize,
          },
        ]);

      if (insertError) {
        console.error("Error adding item to cart:", insertError.message);
        return { success: false, error: insertError.message };
      }

      return { success: true, data: newCartItem };
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    return { success: false, error: err.message };
  }
};

export default addToCart;