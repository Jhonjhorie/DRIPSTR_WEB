import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import RateSymbol from "@/shared/products/rateSymbol";

function Product() {
  const location = useLocation();
  const item = location.state?.item;

  // Move the hook outside any conditionals
  const allImages = item?.url ? [item.url, ...(item.images || [])] : [];
  const [currentSlide, setCurrentSlide] = useState(0);

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

  return (
    <div className="w-full relative inset-0 bg-slate-300 flex flex-col gap-2 px-2 py-4">
      <div className="hero bg-slate-300 ">
        <div className="hero-content flex-col h-full lg:flex-row">
          {item.str && (
            <div className="bg-primary-color rounded-md absolute bottom-8 pl-1 z-50 left-[45%]">
              <button className="btn rounded-md btn-sm glass">Wear Avatar</button>
            </div>
          )}

          <div className="carousel w-full h-full bg-slate-50 rounded-md overflow-y-hidden">
            {allImages.length > 0 ? (
              <div className="carousel-item relative w-full justify-center items-center">
                <img
                  src={allImages[currentSlide]}
                  alt={`${item.product}-${currentSlide}`}
                  className="w-[40rem] h-[65vh] object-contain"
                />
                {allImages.length > 1 && (
                  <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <button onClick={handlePrevSlide} className="btn btn-circle">
                      ❮
                    </button>
                    <button onClick={handleNextSlide} className="btn btn-circle">
                      ❯
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center w-full py-4">No images available.</p>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-2 justify-between h-full md:w-full lg:max-w-[45%] pt-6">
            <div className="flex flex-col gap-1">
              <h1 className="text-5xl font-bold text-secondary-color  p-1 pb-2 rounded-t-md">
                {item.product}
              </h1>
              <div className="h-1 mb-2 w-full bg-primary-color"></div>
              <div className="flex flex-row justify-between">
                <h2 className="text-2xl font-medium">{item.sold} Sold</h2>
                <div className="flex gap-1">
                  <h2 className="text-2xl font-medium text-primary-color">
                    {item.rate?.toFixed(1) || "N/A"}
                  </h2>
                  <RateSymbol item={item.rate} size={"8"} />
                </div>
              </div>
              <p className="mt-2 rounded-md bg-base-300 p-2 max-h-64 overflow-y-auto custom-scrollbar">
                {item.description || "No description available."}
              </p>
            </div>

            <div>
              <div className="justify-end flex my-2">
                <div className="flex justify-end items-center gap-0 flex-row">
                  {item.voucher && (
                    <span className="text-lg border border-primary-color px-2">
                      SHOP VOUCHER
                    </span>
                  )}
                  {item.discount > 0 && (
                    <span className="text-lg text-white bg-primary-color border border-primary-color px-0.5 font-bold">
                      {item.discount}%
                    </span>
                  )}
                  <div className="flex pl-2">
                    <p className="text-2xl text-primary-color">₱</p>
                    <h2 className="text-5xl font-bold text-primary-color">
                      {item.price || "N/A"}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="justify-end gap-2 items-center flex">
                <button className="btn btn-sm btn-outline btn-secondary">
                  Add to Cart
                </button>
                <button className="btn btn-sm btn-outline btn-primary">
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        
      </div>
    </div>
  );
}

export default Product;
