export const searchProducts = (query, products) => {
  if (!query) return products;
  
  const regex = new RegExp(query, 'i'); 
  
  return products.filter((product) =>
    product.item_Name && regex.test(product.item_Name) 
  );
};
