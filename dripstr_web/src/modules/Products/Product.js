import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RateSymbol from "@/shared/products/rateSymbol";
import {averageRate} from "./hooks/useRate.ts";
import RatingSection from "./components/RatingSection.js";
import BuyConfirm from "./components/buyConfirm.js";
import ItemOptions from "./components/itemOptions.js";
import useGetImage from "./hooks/useGetImageUrl.js";



function Product() {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item;
  const imageUrls = useGetImage(item); 

  //Pass the product to cart through add to cart button
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    navigate("/cart");
  }

  const allImages = [
    ...imageUrls,  
    ...(item.variant && item.variant.length > 0 
      ? item.variant.map(variant => variant.image)  // Add variant images
      : [])
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedAction, setSelectedAction] = useState(null);


  if (!item) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">
          No product data found. Please return to the products page.
        </p>
      </div>
    );
  }

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % allImages.length);
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

  return (
    <div className="w-full relative pb-16 items-start justify-start bg-slate-300 flex flex-col gap-2 px-2 lg:px-8 py-4">
       {item  && <dialog id="buyConfirm_Modal" className=" modal modal-bottom sm:modal-middle absolute right-4 sm:right-0">
                   <BuyConfirm action={selectedAction} item={item} onClose={closeModal}/>
                   <form method="dialog" class="modal-backdrop">
                    <button onClick={closeModal}></button>
                  </form>
      </dialog>}
        <img src={require('@/assets/images/starDrp.png')}  
            className=' absolute top-[-320px] -right-16 lg:right-[30%] z-0 opacity-30  w-[35%] h-[50%] object-contain'/>
      <img src={require('@/assets/images/streetbg.png')}  
            className=' absolute top-[60rem] lg:top-[40rem] -left-[10%] z-0 opacity-30  w-[35%] h-[40%] object-contain '/>
      <div className=" justify-start  w-full">
        
        <div className="max-w-[120rem] flex items-start justify-center gap-8 p-4  hero-content flex-col h-full  w-full lg:flex-row">
          <div className="flex flex-col w-full">
        
            <div className="carousel w-full h-[70vh] bg-slate-50 z-10 rounded-md overflow-y-hidden">
              {allImages.length > 0 ? (
                <div className="carousel-item relative w-full  justify-center items-center">
                  <img
                    src={allImages[currentSlide]}
                    alt={`${item.product}-${currentSlide}`}
                    className="w-[40rem] h-[90%] object-contain"
                  />
                  {allImages.length > 1 && (
                    <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                      <button
                        onClick={handlePrevSlide}
                        className="btn btn-circle"
                      >
                        ❮
                      </button>
                      <button
                        onClick={handleNextSlide}
                        className="btn btn-circle"
                      >
                        ❯
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-center w-full py-4">No images available.</p>
              )}
            </div>
            {item.str && (
              <div className="bg-primary-color w-full rounded-md pl-1">
                <button className="btn rounded-md w-full hover:text-primary-color  btn-sm glass">
                  See in Avatar
                </button>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col  justify-between z-10 lg:items-end min-h-[74vh]  h-full w-full  pt-6">
            <div className="flex flex-col w-full gap-1">
              <h1 className="text-5xl font-bold text-secondary-color  p-1 pb-2 rounded-t-md">
                {item.product_name}
              </h1>
              <div className="h-1 mb-2 w-full bg-primary-color"></div>
              <div className="flex flex-col justify-between gap-4">
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
                      <RateSymbol item={item.rate} size={"4"} />
                    </div>
                  </div>
                </div>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col gap-2">
                   <ItemOptions item={item} />
                  </div>
                </div>
                <div className="flex justify-end pl-2 mt-2 md:mt-8">
                  <p className="text-2xl text-primary-color">₱</p>
                  <h2 className="text-6xl font-bold text-primary-color">
                    {item.discount > 0
                      ? (item.price * (1 - item.discount / 100)).toFixed(2)
                      : item.price.toFixed(2)}
                  </h2>
                </div>
                <div className="justify-end flex flex-col items-end gap-2 ">
                  <div className="flex justify-end items-center gap-2 flex-col">
                    {item.discount > 0 && (
                      <div className="flex items-center">
                        <span className="text-lg text-white bg-primary-color border border-primary-color px-0.5 font-bold">
                          {item.discount}%
                        </span>
                        <span className="text-3xl text-secondary-color px-1 font-bold opacity-50 line-through ">
                          ₱{item.price.toFixed(2) || "N/A"}
                        </span>
                      </div>
                    )}
                  </div>
                  {item.vouchers && (
                    <span className="text-lg font-bold border border-primary-color px-2 ">
                      SHOP VOUCHER
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="justify-end gap-2 mt-4 items-center flex">
              <button
                  onClick={handleAddToCart}
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col z-10 w-full px-4">
      <div class="my-0 divider"></div>
        <p className="text-2xl font-bold">Product Description</p>
    
        <p className="mt-2 rounded-md bg-slate-100 p-2 max-h-60 overflow-y-auto custom-scrollbar">
          {item.description || "No description available."}
        </p>
      </div>
      <RatingSection item={item} />
    </div>
  );
}

export default Product;
