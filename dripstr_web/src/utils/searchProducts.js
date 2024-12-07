export const searchProducts = (query, products) => {
  if (!query) return products;
  
  const regex = new RegExp(query, 'i'); 
  
  return products.filter((product) =>
    product.product_name && regex.test(product.product_name) 
  );
};
