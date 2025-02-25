import { supabase } from '@/constants/supabase';

const addToCart = async (profileId, itemId, quantity, selectedColor, selectedSize) => {
  try {
    // Step 1: Check if the item already exists in the cart
    const { data: existingCartItem, error: fetchError } = await supabase
      .from("cart")
      .select("*")
      .eq("acc_id", profileId) // Match user ID
      .eq("prod_id", itemId) // Match product ID
      .eq("variant->>variant_Name", selectedColor.variant_Name) // Compare JSON field "color" in "variant"
      .eq("size->>id", selectedSize.id) // Compare JSON field "value" in "size"
      .maybeSingle(); // Use maybeSingle() to avoid throwing an error if no rows are found

    if (fetchError) {
      console.error("Error fetching cart item:", fetchError.message);
      return { success: false, error: fetchError.message };
    }

    if (existingCartItem) {
      // Step 2: If the item exists, update the quantity
      const updatedQuantity = existingCartItem.qty + quantity;
      const { data: updatedCartItem, error: updateError } = await supabase
        .from("cart")
        .update({ qty: updatedQuantity })
        .eq("id", existingCartItem.id); // Update the specific cart item

      if (updateError) {
        console.error("Error updating cart item:", updateError.message);
        return { success: false, error: updateError.message };
      }

      return { success: true, data: updatedCartItem };
    } else {
      // Step 3: If the item does not exist, insert a new item
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