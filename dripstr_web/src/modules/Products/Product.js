import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RateSymbol from "@/shared/products/rateSymbol";

function Product() {
  const location = useLocation();
  const item = location.state?.item; // Safely access item from state
  const navigate = useNavigate();


  if (!item) {
    return <p>No product data found. Please return to the products page.</p>;
  }

  const handlePlaceOrder = () => {
    navigate('/cart/order', { state: { item } }); // Pass the product data to the Order page
  };

  return (
    <div className="w-full relative inset-0 bg-slate-300 flex flex-col gap-2 px-2 py-4 h-100">
      <div className="">
        <div className="hero bg-slate-300 ">
          <div className="hero-content flex-col h-full lg:flex-row">
            <div class="carousel w-full h-full bg-slate-50 rounded-md overflow-y-hidden">
              <div
                id="slide1"
                class="carousel-item relative w-full justify-center items-center "
              >
                <img
                  src={item.url}
                  class="w-[40rem] h-[50vh]  object-contain"
                />
                <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                  <a href="#slide4" class="btn btn-circle">
                    ❮
                  </a>
                  <a href="#slide2" class="btn btn-circle">
                    ❯
                  </a>
                </div>
              </div>
              <div
                id="slide2"
                class="carousel-item relative w-full  justify-center items-center "
              >
                <img
                  src={require("@/assets/images/home/blackTshirt.png")}
                  class="w-[40rem] h-[65vh]  object-contain"
                />
                <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                  <a href="#slide1" class="btn btn-circle">
                    ❮
                  </a>
                  <a href="#slide3" class="btn btn-circle">
                    ❯
                  </a>
                </div>
              </div>
              <div
                id="slide3"
                class="carousel-item relative w-full justify-center items-center "
              >
                <img
                  src={require("@/assets/images/home/brownShoes.png")}
                  class="w-[40rem] h-[65vh]  object-contain"
                />
                <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                  <a href="#slide2" class="btn btn-circle">
                    ❮
                  </a>
                  <a href="#slide4" class="btn btn-circle">
                    ❯
                  </a>
                </div>
              </div>
              <div
                id="slide4"
                class="carousel-item relative w-full justify-center items-center "
              >
                <img
                  src={require("@/assets/images/home/greyShoe.png")}
                  class="w-[40rem] h-[65vh]  object-contain"
                />
                <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                  <a href="#slide3" class="btn btn-circle">
                    ❮
                  </a>
                  <a href="#slide1" class="btn btn-circle">
                    ❯
                  </a>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 justify-between h-full ">
              <div className="flex flex-col gap-1">
                <h1 className="text-6xl font-bold text-secondary-color ">
                  {item.product}
                </h1>
                <div className="flex flex-row justify-between ">
                  <h2 className="text-5xl font-bold">{item.sold} Sold</h2>
                  <div className="flex gap-1">
                    <h2 className="text-5xl font-bold text-primary-color">
                      {item.rate.toFixed(1)}
                    </h2>
                    <RateSymbol item={item.rate} size={"12"} />
                  </div>
                </div>
              </div>

              <p className="py-6">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut
                assumenda excepturi exercitationem quasi. In deleniti eaque aut
                repudiandae et a id nisi.
              </p>

              <form method="dialog  ">
                <button className="btn btn-sm btn-circle btn-ghost fixed right-2 top-2">
                  ✕
                </button>
                <div className=" justify-end gap-4 items-center flex">
                  <h2 className="text-4xl font-bold text-primary-color">
                    ₱{item.price}
                  </h2>
                  <button className="btn btn-sm btn-outline btn-secondary  ">
                    Add to Cart
                  </button>
                  <button className="btn btn-sm  btn-outline "  onClick={handlePlaceOrder}>
                    Place Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
