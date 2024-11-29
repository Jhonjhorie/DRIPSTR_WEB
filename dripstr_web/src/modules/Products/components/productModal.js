import React from "react";
import { useNavigate } from "react-router-dom";
import RateSymbol from "@/shared/products/rateSymbol";

const ProductModal = ({ item, onClose }) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/product/${item.product}`, { state: { item } });
  };

  const allImages = [item.url, ...(item.images || [])];
  return (
    <div className="lg:w-[70rem] lg:max-w-[70rem] p-0 max-h-[40rem] overflow-y-auto custom-scrollbar  modal-box">
      <div className="hero bg-slate-300 ">
        <div className="hero-content flex-col h-full lg:flex-row">
        {item.str && (
                  <div className="bg-primary-color rounded-md absolute bottom-6  pl-1 z-50 left-[45%]">
                    <button
                      onClick={() => handleProductClick()}
                      className="btn rounded-md btn-sm glass   "
                    >
                      Wear Avatar
                    </button>
                  </div>
                )}
          <div className="carousel w-full h-full bg-slate-50 rounded-md overflow-y-hidden">
            {allImages.map((image, imageIndex) => {
              const slideId = `slide${imageIndex}`;
              const prevSlideId = `slide${
                (imageIndex - 1 + allImages.length) % allImages.length
              }`;
              const nextSlideId = `slide${(imageIndex + 1) % allImages.length}`;

              return (
                <div
                  id={slideId}
                  key={slideId}
                  className="carousel-item relative w-full justify-center items-center"
                >
                  <img
                    src={image}
                    alt={`${item.product}-${imageIndex}`}
                    className="w-[40rem] h-[65vh] object-contain"
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

          <div className="flex flex-col gap-2 justify-between h-full md:w-full lg:max-w-[45%] pt-6 ">
            <div className="flex flex-col gap-1">
              <h1 className="text-5xl font-bold text-secondary-color  p-1 pb-2 rounded-t-md ">
                {item.product}
              </h1>
              <div className="h-1 mb-2 w-full bg-primary-color"></div>
              <div className="flex flex-row justify-between ">
                <h2 className="text-2xl font-medium">{item.sold} Sold</h2>
                <div className="flex gap-1">
                  <h2 className="text-2xl font-medium text-primary-color">
                    {item.rate.toFixed(1)}
                  </h2>
                  <RateSymbol item={item.rate} size={"8"} />
                </div>
              </div>
              <p className="mt-2 rounded-md bg-base-300 p-2 max-h-64 overflow-y-auto custom-scrollbar">
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
              <div className="justify-end flex my-2">
                <div className="flex justify-end items-center gap-0 flex-row">
                  {item.voucher && (
            
                      <span className="text-lg border border-primary-color px-2 ">
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
                  onClick={() => handleProductClick()}
                  className="btn btn-sm btn-outline btn-secondary  "
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleProductClick()}
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
