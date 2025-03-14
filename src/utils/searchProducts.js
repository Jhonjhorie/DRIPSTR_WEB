export const searchProducts = (query, products) => {
  if (!query) return products;

  const regex = new RegExp(query, 'i');

  return products.filter((product) => {
    
    const nameMatch = product.item_Name && regex.test(product.item_Name);

    const tagsMatch = product.item_Tags && product.item_Tags.some(tag => regex.test(tag));
    
    return nameMatch || tagsMatch;
  });
};