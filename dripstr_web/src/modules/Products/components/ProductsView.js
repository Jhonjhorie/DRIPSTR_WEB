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
  sort
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const itemsToShow = useResponsiveItems({ mb: 2, sm: 2, md: 4, lg: 6 });
  const numColumns = itemsToShow;

  const openModal = (item) => {
    setSelectedItem(item);
    setTimeout(() => {
      document.getElementById("my_modal_4").showModal();
    }, 50);
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
        return item.discount != 0 || item.vouchers != null;
      case 4:
        return;
      case 5:
        return item.item_Orders > 99;
      // case 6:
      //   return item?.reviews?.length > 2;
      default:
        return true;
    }
  });

  const filteredProductsC = filteredProducts.filter(
    (item) => categories === "All" || item.item_Category === categories
  );

  const filteredProductsD = sort == "top" ? filteredProductsC.filter(
    (item) => shopFil === 0 || item.shop_Id === shopFil
).sort((a, b) => {
    const weightRating = 0.6; 
    const weightOrders = 0.4; 

    const scoreA = (a.item_Rating * weightRating) + (a.item_Orders * weightOrders); 
    const scoreB = (b.item_Rating  * weightRating) + (b.item_Orders * weightOrders);

    return scoreB - scoreA; 
}): filteredProductsC.filter(
  (item) => shopFil === 0 || item.shop_Id === shopFil
);

  const totalItems = filteredProductsD.length;
  const remainder = totalItems % numColumns;
  const placeholdersNeeded = remainder === 0 ? 0 : numColumns - remainder;

  const dataWithPlaceholders = showItem != 0 ? [
    ...filteredProductsD,
    ...Array(placeholdersNeeded).fill({ empty: true }),
  ].slice(0, showItem) : [
    ...filteredProductsD,
    ...Array(placeholdersNeeded).fill({ empty: true }),
  ];

  if (loading)
    return (
      <div className="min-h-24 flex-col items-center flex">
        <img
          src={require("@/assets/emote/hmmm.png")}
          alt="No Images Available"
          className=" drop-shadow-customViolet animate-pulse"
        />
        <p>Loading...</p>
      </div>
    );
  if (categories == "Choose Categories")
    return (
      <div className="min-h-24">
        <img
          src={require("@/assets/emote/question.png")}
          alt="No Images Available"
          className=" drop-shadow-customViolet animate-bounce"
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
          className=" drop-shadow-customViolet "
        />
        <p>Error: {error}</p>
      </div>
    );

  return (
    <div className="w-full flex flex-col items-center  min-h-[15rem]">
      {selectedItem && (
        <dialog
          id="my_modal_4"
          className="modal modal-bottom sm:modal-middle absolute z-50 right-4 sm:right-0"
        >
          <BuyConfirm item={selectedItem} onClose={closeModal} />
          <form
            method="dialog"
            className="modal-backdrop min-h-full min-w-full absolute "
          >
            <button onClick={closeModal}></button>
          </form>
        </dialog>
      )}
      {filteredProductsD.length > 0 ? (
        <div
          className="grid gap-1 items-center justify-center"
          style={{ gridTemplateColumns: `repeat(${numColumns}, 1fr)` }}
        >
          {dataWithPlaceholders.map((item, index) =>
            item.empty ? (
              <div
                key={`placeholder-${index}`}
                className="flex flex-col mx-1 mb-2 p-2 rounded-md"
                style={{ visibility: "hidden" }}
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
      ) : (
        <div className=" items-center justify-center flex flex-col ">
          <img
            src={require("@/assets/emote/sad.png")}
            alt="Sad"
            className="object-none mb-2 mt-1 w-[180px] h-[200px] drop-shadow-customViolet animate-pulse"
          />
          <h1 className="top-20 font-[iceland] font-semibold text-3xl p-4 rounded-md drop-shadow-lg">
            No Available Products
          </h1>
        </div>
      )}
    </div>
  );
};

export default ProductsView;
