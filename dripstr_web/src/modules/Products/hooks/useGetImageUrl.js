
const useGetImage = (item) => {
  if (!item) return [];


  const variantImages = item.item_Variant && item.item_Variant.length > 0 
    ? item.item_Variant.map(variant => variant.imagePath)
    : [];

  return [...variantImages];  
};

export default useGetImage;
