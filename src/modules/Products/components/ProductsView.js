import React, { useState } from "react";
import useResponsiveItems from "../../../shared/hooks/useResponsiveItems";
import BuyConfirm from "./buyConfirm";
import ProductCard from "./productCard";

const ProductsView = ({
  products,
  categories,
  filter,
  loading,
  error,
  shopFil,
  showItem,
  sort,
  isSmall,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const itemsToShow = useResponsiveItems({ mb: 2, sm: 2, md: 4, lg: 6 });
  const numColumns = itemsToShow;

  const openModal = (item) => {
    setSelectedItem(item);
    const modal = document.getElementById("my_modal_4");
    if (modal) {
      setTimeout(() => {
      modal.showModal();
    }, 50);
    }
   
    
  };

  const closeModal = () => {
    const modal = document.getElementById("my_modal_4");
    if (modal) {
      modal.close();
      setSelectedItem(null);
    }
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
        return item.discount > 0 || null || item.vouchers != null;
      case 4:
        return;
      case 5:
        return item.item_Orders > 99;
      default:
        return true;
    }
  });

  const filteredProductsC = filteredProducts.filter(
    (item) => categories === "All" || item.item_Category === categories
  );

  
  const filteredProductsD =
  sort === "top"
    ? filteredProductsC
        .filter((item) =>
          shopFil === 0 || 
          (Array.isArray(shopFil) ? shopFil.includes(item.shop_Id) : item.shop_Id === shopFil)
        )
        .sort((a, b) => {
          const weightRating = 0.6;
          const weightOrders = 0.4;

          const scoreA = a.item_Rating * weightRating + a.item_Orders * weightOrders;
          const scoreB = b.item_Rating * weightRating + b.item_Orders * weightOrders;

          return scoreB - scoreA;
        })
    : filteredProductsC.filter((item) =>
        shopFil === 0 || 
        (Array.isArray(shopFil) ? shopFil.includes(item.shop_Id) : item.shop_Id === shopFil)
      );

  // Calculate placeholders for grid layout
  const totalItems = filteredProductsD.length;
  const remainder = totalItems % numColumns;
  const placeholdersNeeded = remainder === 0 ? 0 : numColumns - remainder;

  let dataWithPlaceholders;

  if (isSmall && totalItems < 2 && numColumns < 2 ) {
    dataWithPlaceholders = [
      { empty: true },
      filteredProductsD[0] || { empty: true },
      { empty: true },
    ];
  } else {
    dataWithPlaceholders =
      showItem !== 0
        ? [...filteredProductsD, ...Array(placeholdersNeeded).fill({ empty: true })].slice(0, showItem)
        : [...filteredProductsD, ...Array(placeholdersNeeded).fill({ empty: true })];
  }

  if (loading)
    return (
      <div className="min-h-24 flex-col min-w-full items-center flex">
        <img
          src={require("@/assets/emote/hmmm.png")}
          alt="No Images Available"
          className="drop-shadow-customViolet animate-pulse"
        />
        <p>Loading...</p>
      </div>
    );

  if (categories === "Choose Categories")
    return (
      <div className="min-h-24">
        <img
          src={require("@/assets/emote/question.png")}
          alt="No Images Available"
          className="drop-shadow-customViolet animate-bounce"
        />
        <p>Please Choose a Category</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-24">
        <img
          src={require("@/assets/emote/error.png")}
          alt="No Images Available"
          className="drop-shadow-customViolet"
        />
        <p>Error: {error}</p>
      </div>
    );

 return (
    <div className="w-full py-1">
      {/* BuyConfirm Modal */}
      {selectedItem && (
        <dialog
          id="my_modal_4"
          className="modal modal-bottom sm:modal-middle"
        >
          <BuyConfirm item={selectedItem} onClose={closeModal} />
          <form
            method="dialog"
            className="modal-backdrop min-h-full min-w-full absolute"
          >
            <button onClick={closeModal}></button>
          </form>
        </dialog>
      )}

      {/* Product Grid */}
      {filteredProductsD.length > 0 ? (
        <div className="grid gap-3 px-4" style={{ gridTemplateColumns: `repeat(${isSmall ? numColumns > 2 ? 3 : numColumns : numColumns}, minmax(0, 1fr))` }}>
          {dataWithPlaceholders.map((item, index) =>
            item.empty ? (
              <div
                key={`placeholder-${index}`}
                className="invisible"
              />
            ) : (
              <ProductCard
                key={item.id || `product-${index}`}
                item={item}
                onClick={() => openModal(item)} 
                isSmall={isSmall}
              />
            )
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <img
            src={require("@/assets/emote/sad.png")}
            alt="No Products Available"
            className="w-24 h-24 object-contain drop-shadow-md"
          />
          <p className="text-xl text-gray-600">No Products Available</p>
        </div>
      )}
    </div>
  );
};

export default ProductsView;