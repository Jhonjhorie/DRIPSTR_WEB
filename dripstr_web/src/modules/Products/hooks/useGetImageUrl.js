const SUPABASE_STORAGE_URL = 'https://pbghpzmbfeahlhmopapy.supabase.co/storage/v1/object/public';

const useGetImage = (item) => {
  if (!item) return [];

  const images = item.images ? item.images.map((path) => `${SUPABASE_STORAGE_URL}/${path}`) : [];

  const variantImages = item.color_variant && item.color_variant.length > 0 
    ? item.color_variant
        .map(variant => variant.image && `${SUPABASE_STORAGE_URL}/${variant.image}`)
    : [];

  return [...images, ...variantImages];  
};

export default useGetImage;
