import React from 'react';
import { products } from '@/constants/sampleData'; // Ensure you have a products array
import { Link } from 'react-router-dom';
import useResponsiveItems from '../../../shared/hooks/useResponsiveItems';
import { ReactComponent as Logo } from '@/assets/images/BlackLogo.svg'; 
import FilterProducts from './FilterProducts';




const ProductsView = () => {
  const itemsToShow = useResponsiveItems({ mb: 2, sm: 2, md: 4, lg: 6 }); 
  const numColumns = itemsToShow;

  const dataWithPlaceholders = [...products];
  while (dataWithPlaceholders.length % numColumns !== 0) {
    dataWithPlaceholders.push({ empty: true }); 
  }

  return (
    <div className="w-full flex flex-col items-center pb-24">
      <div className='relative -top-3 flex flex-row w-full items-center p-6 justify-end'>
        <p className="absolute left-40 text-lg text-slate-500 ">
          DRIP NOW // STAR LATER
        </p>
        <FilterProducts />
      </div>

      <div className="grid gap-1 items-center justify-center" style={{ gridTemplateColumns: `repeat(${numColumns}, 1fr)` }}>
        {dataWithPlaceholders.map((item, index) =>
          item.empty ? (
            // Placeholder item for alignment
            <div
              key={`placeholder-${index}`}
              className="flex flex-col mx-1 mb-2 p-2 rounded-md"
              style={{ visibility: 'hidden' }}
            />
          ) : (
            <Link
              key={item.prodId || `product-${index}`}
              to="/"
              className="flex flex-col flex-1 max-w-[13.5rem] items-center mx-1 mb-2 rounded-md bg-slate-100 shadow-sm hover:shadow-lg gap-1 hover:scale-105 relative transition-transform duration-300 group"
            >
              {item.str && (
                <Logo
                  className="absolute top-2 left-2 group-hover:opacity-100 duration-300 transition-all opacity-50 w-7 h-7"
                />
              )}

              <div className="absolute flex flex-row right-2 top-2 ">
                {item.voucher && (
                  <span className="text-xs border border-primary-color px-0.5 font-thin">
                    SHOP VOUCHER
                  </span>
                )}
                {item.discount > 0 && (
                  <span className="text-xs text-white bg-primary-color border border-primary-color px-0.5 font-bold">
                    {item.discount}%
                  </span>
                )}
              </div>
              <img
                src={item.url}
                alt={item.product}
                className="object-contain mb-2 mt-1 w-[180px] h-[200px]"
                
              />
              <div className="w-full flex flex-col px-3 py-2 bg-slate-200 rounded-b-md">
                {item.product && (
                  <p className="text-secondary-color text-md font-medium truncate">
                    {item.product}
                  </p>
                )}
                <div className="flex flex-row justify-between items-center">
                  {/* Price */}
                  {item.price && (
                    <p className="text-primary-color text-md font-medium">₱{item.price}</p>
                  )}

                  {/* Ratings and Sales */}
                  <div className="flex flex-row items-center just gap-0.5">
                  <p className="text-primary-color text-md">{item.rate.toFixed(1)}</p>
                    {item.rate >= 4 && (
                      <img src={require('@/assets/images/others/fillfull.png')} className='w-4 h-5 object-contain'/>
                    )}
                    {item.rate < 4 && item.rate > 2 && (
                    <img src={require('@/assets/images/others/fillhalf.png')}  className='w-4 h-5 object-contain'/>
                    )}
                    {item.rate < 2 && (
                      <img src={require('@/assets/images/others/fillno.png')} className='w-4 h-5 object-contain'/>
                  
                    )}
                    <span className="text-secondary-color justify-center text-sm ">
                      | {item.sold} sold
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default ProductsView;
