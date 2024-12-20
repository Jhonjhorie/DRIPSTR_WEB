import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import RateSymbol from "@/shared/products/rateSymbol";
import { averageRate } from "../hooks/useRate.ts";
import BuyConfirm from "./buyConfirm.js";
import ItemOptions from "./itemOptions.js";
import useGetImage from "../hooks/useGetImageUrl.js";


const ProductModal = ({ item, onClose }) => {
  const [selectedAction, setSelectedAction] = useState(null);
  const navigate = useNavigate();
  const imageUrls = useGetImage(item); 

  const handleProductClick = () => {
    navigate(`/product/${item.product_name}`, { state: { item } });
  };

  const openModal = (action) => {
    setSelectedAction(action);  
    setTimeout(() => {
      document.getElementById('buyConfirm_Modal').showModal();
    }, 50);
  };
  const closeModal = () => {
    document.getElementById('buyConfirm_Modal').close();
  };

  const allImages = [
    ...imageUrls,  
    ...(item.variant && item.variant.length > 0 
      ? item.variant.map(variant => variant.image)  // Add variant images
      : [])
  ];



  return (
    <div className="lg:w-[70rem] lg:max-w-[70rem] p-0 h-[40rem] overflow-y-auto overflow-x-hidden lg:overflow-hidden custom-scrollbar  modal-box">
      {item  && <dialog id="buyConfirm_Modal" className=" modal modal-bottom sm:modal-middle absolute right-4 sm:right-0">
                   <BuyConfirm action={selectedAction} item={item} onClose={closeModal}/>
                   <form method="dialog" class="modal-backdrop">
                    <button onClick={closeModal}></button>
                  </form>
      </dialog>}

      <div className=" place-items-stretch hero bg-slate-300 h-full ">
        <div className="hero-content flex-col h-full lg:flex-row ">
          <div className="flex flex-col">
            <img
              src={require("@/assets/images/starDrp.png")}
              className=" absolute -top-24 -right-16 lg:right-[30%] -z-10 opacity-30  w-[35%] h-[50%] object-contain"
            />
            <img
              src={require("@/assets/images/streetbg.png")}
              className=" absolute top-[55%] lg:top-[60%] -left-[10%] -z-10 opacity-30  w-[35%] h-[40%] object-contain "
            />
            <div className="carousel w-full h-full bg-slate-50 rounded-md overflow-y-hidden">
              {allImages.map((image, imageIndex) => {
                const slideId = `slide${imageIndex}`;
                const prevSlideId = `slide${
                  (imageIndex - 1 + allImages.length) % allImages.length
                }`;
                const nextSlideId = `slide${
                  (imageIndex + 1) % allImages.length
                }`;

                return (
                  <div
                    id={slideId}
                    key={slideId}
                    className="carousel-item relative w-full  justify-center items-center"
                  >
                    <img
                      src={image}
                      alt={`${item.product_name}-${imageIndex}`}
                      className="w-[32rem]  h-[65vh] object-contain"
                    />
                    {allImages.length > 1 && (
                      <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                        <a href={`#${prevSlideId}`} className="btn btn-circle">
                          ❮
                        </a>
                        <a href={`#${nextSlideId}`} className="btn btn-circle">
                          ❯
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {item.str && (
              <div className="bg-primary-color  w-full rounded-md pl-1 z-50">
                <button
                  onClick={() => handleProductClick()}
                  className="btn rounded-md  w-full btn-sm glass   "
                >
                  See in Avatar
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 justify-between  h-full w-full lg:max-w-[50%] lg:min-w-[50%] pt-6 ">
            <div className="flex flex-col gap-1 ">
              <h1 className="text-5xl font-bold text-secondary-color  p-1 pb-2 rounded-t-md ">
                {item.product_name}
              </h1>
              <div className="h-1 mb-2 w-full bg-primary-color"></div>
              <div className="flex flex-col justify-between  gap-4 mb-2">
                <div className="flex justify-between gap-2 items-center">
                  <div className="flex items-center gap-2 ">
                    <p className="text-sm font-medium">Shop:</p>
                    <div className="hover:underline  py-0 min-h-8 h-8 btn-ghost btn duration-300 transition-all ">
                        {item.shop?.shop_name || 'No shop available'}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <h2 className="text-base font-medium">
                      {item.sold} Sold /{" "}
                    </h2>
                    <div className="flex gap-1 items-center">
                      <h2 className="text-base font-medium text-primary-color">
                        {averageRate(item.reviews) || "N/A"}
                      </h2>
                      <RateSymbol item={averageRate(item.reviews)} size={"4"} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <div className="flex flex-col gap-2">
              <ItemOptions item={item} />
                </div>
              </div>
              <p className="mt-2 rounded-md bg-base-300 p-2 max-h-60 overflow-y-auto custom-scrollbar">
                {item.description || "No description available."}
              </p>
            </div>

            <div>
              <button
                onClick={onClose}
                className="btn btn-sm btn-circle btn-ghost fixed right-2 top-2"
              >
                ✕
              </button>
              <div className="justify-end flex my-1 mb-3">
                <div className="flex justify-end items-center gap-0 flex-row">
                  {item.vouchers && (
                    <span className="text-lg bg-slate-50 border border-primary-color px-2 ">
                      SHOP VOUCHER
                    </span>
                  )}
                  {item.discount > 0 && (
                    <span className="text-lg text-white bg-primary-color border border-primary-color px-0.5 font-bold">
                      {item.discount}%
                    </span>
                  )}
                  <div className="flex pl-2">
                    <p className="text-2xl  text-primary-color">₱</p>
                    <h2 className="text-5xl font-bold text-primary-color">
                      {item.price}
                    </h2>
                  </div>
                </div>
              </div>
              <div className=" justify-end gap-2 items-center flex">
                <button
                  onClick={() => openModal('cart')}
              
                  className="btn btn-sm btn-outline btn-secondary  "
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => openModal('order')}
                  className="btn btn-sm btn-outline btn-primary  "
                >
                  Place Order
                </button>
                <button
                  onClick={() => handleProductClick()}
                  className="btn btn-sm  btn-outline "
                >
                  Go to Product Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
