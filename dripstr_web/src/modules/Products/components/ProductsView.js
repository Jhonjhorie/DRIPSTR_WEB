import React, { useState, useEffect } from 'react';
import useResponsiveItems from '../../../shared/hooks/useResponsiveItems';
import ProductModal from './productModal';
import ProductCard from './productCard';



const ProductsView = ({ products, categories, filter, loading, error }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const itemsToShow = useResponsiveItems({ mb: 2, sm: 2, md: 4, lg: 6 });
  const numColumns = itemsToShow;

  const openModal = (item) => {
    setSelectedItem(item);
    setTimeout(() => {
      document.getElementById('my_modal_4').showModal();
    }, 50);
  };

  const closeModal = () => {
    document.getElementById('my_modal_4').close();
    setSelectedItem(null);
  };

  const filteredProducts = products.filter((item) => {
    switch (filter) {
      case 0:
        return true;
      case 1:
        return item.str === true;
      case 2:
        return;
      case 3:
        return item.discount != 0 || item.vouchers != null;
      case 4:
        return;
      case 5:
        return item.sold > 99;
      case 6:
        return item.reviews.length > 2;
      default:
        return true;
    }
  });

  const filteredProductsC = filteredProducts.filter(
    (item) => categories === 'All' || item.category === categories
  );

  const totalItems = filteredProductsC.length;
  const remainder = totalItems % numColumns;
  const placeholdersNeeded = remainder === 0 ? 0 : numColumns - remainder;

  const dataWithPlaceholders = [
    ...filteredProductsC,
    ...Array(placeholdersNeeded).fill({ empty: true }),
  ];
  
  if (loading) return (<div className='min-h-24'>
  <p>Loading...</p>
  </div>
  )
  ;
  if (error) return (<div className='min-h-24'> 
  <p>Error: {error}</p>
  </div>
);

  return (
    <div className="w-full flex flex-col items-center pb-24 min-h-20">
      {selectedItem && (
        <dialog
          id="my_modal_4"
          className="modal modal-bottom sm:modal-middle absolute right-4 sm:right-0"
        >
          <ProductModal item={selectedItem} onClose={closeModal} />
          <form method="dialog" className="modal-backdrop">
            <button onClick={closeModal}></button>
          </form>
        </dialog>
      )}

      <div
        className="grid gap-1 items-center justify-center"
        style={{ gridTemplateColumns: `repeat(${numColumns}, 1fr)` }}
      >
        {dataWithPlaceholders.map((item, index) =>
        
          item.empty ? (
            <div
              key={`placeholder-${index}`}
              className="flex flex-col mx-1 mb-2 p-2 rounded-md"
              style={{ visibility: 'hidden' }}
            />
          ) : (
            <ProductCard
              key={item.id || `product-${index}`}
              item={item}
              onClick={() => openModal(item)}
            />
          )
        )}
      </div>
    </div>
  );
};

export default ProductsView;
