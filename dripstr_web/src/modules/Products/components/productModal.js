import React from 'react';
import { useNavigate } from 'react-router-dom';
import RateSymbol from '@/shared/products/rateSymbol';

const ProductModal = ({ item, onClose }) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/product/${item.product}`, { state: { item } });
   
  };

  return (
    <div className="lg:w-[70rem] lg:max-w-[70rem] p-0 max-h-[40rem] overflow-y-auto custom-scrollbar mx-4 modal-box">
      <div className="hero bg-slate-300 ">
        <div className="hero-content flex-col h-full lg:flex-row">
        <div class="carousel w-full h-full bg-slate-50 rounded-md overflow-y-hidden">
                <div id="slide1" class="carousel-item relative w-full justify-center items-center ">
                  <img
                    src={item.url}
                    class="w-[40rem] h-[50vh]  object-contain" />
                  <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide4" class="btn btn-circle">❮</a>
                    <a href="#slide2" class="btn btn-circle">❯</a>
                  </div>
                </div>
                <div id="slide2" class="carousel-item relative w-full  justify-center items-center ">
                  <img
                    src={require('@/assets/images/home/blackTshirt.png')}
                    class="w-[40rem] h-[65vh]  object-contain" />
                  <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide1" class="btn btn-circle">❮</a>
                    <a href="#slide3" class="btn btn-circle">❯</a>
                  </div>
                </div>
                <div id="slide3" class="carousel-item relative w-full justify-center items-center ">
                  <img
                    src={require('@/assets/images/home/brownShoes.png')}
                    class="w-[40rem] h-[65vh]  object-contain" />
                  <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide2" class="btn btn-circle">❮</a>
                    <a href="#slide4" class="btn btn-circle">❯</a>
                  </div>
                </div>
                <div id="slide4" class="carousel-item relative w-full justify-center items-center ">
                  <img
                    src={require('@/assets/images/home/greyShoe.png')}
                    class="w-[40rem] h-[65vh]  object-contain" />
                  <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide3" class="btn btn-circle">❮</a>
                    <a href="#slide1" class="btn btn-circle">❯</a>
                  </div>
                </div>
              </div>
          <div className='flex flex-col gap-1 justify-between h-full '>
            <div className='flex flex-col gap-1'>
            <h1 className="text-6xl font-bold text-secondary-color ">{item.product}</h1>
            <div className='flex flex-row justify-between '>  
            <h2 className="text-5xl font-bold">{item.sold} Sold</h2>    
            <div className='flex gap-1'>   
            
            <h2 className="text-5xl font-bold text-primary-color">{item.rate.toFixed(1)}</h2>
            <RateSymbol item={item.rate} size={'12'}/>
            </div>
            </div> 
            </div>  
            
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
              quasi. In deleniti eaque aut repudiandae et a id nisi.
            </p>
           
            <div  >
                <button
                  onClick={onClose}
                  className="btn btn-sm btn-circle btn-ghost fixed right-2 top-2"
                >
                  ✕
                </button>
              <div className=' justify-end gap-4 items-center flex'>
              <h2 className="text-4xl font-bold text-primary-color">₱{item.price}</h2>
              <button
                  onClick={() => handleProductClick()}
                  className="btn btn-sm btn-outline btn-secondary  "
                >
                  Add to Cart
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
