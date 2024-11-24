import React from 'react';
import { Link } from 'react-router-dom';
import useResponsiveItems from '@/shared/hooks/useResponsiveItems';

const OrderCard = ({ orders }) => {
  const itemsToShow = useResponsiveItems({ mb:1, sm: 1, md: 2, lg: 2 }); 
  const sorted = orders.slice(0, itemsToShow);

  return (
    <div className="overflow-hidden w-full h-full">
      {sorted.length > 0 ? (
        <div className="flex flex-row md:flex-col gap-1">
          {sorted.map((item, index) => (
            <Link
              to="/"
              key={index}
              className="flex flex-row bg-gray-200 rounded-md group mt-1 py-0 md:py-2 pr-1  hover:shadow-lg transition-all duration-300"
            >
              <img
                src={typeof item.url === 'string' ? item.url : item.url.uri}
                alt="Product"
                className="bg-slate-50 rounded-lg md:rounded-l-none object-contain w-[30%]"
              />
              <div className="ml-1 lg:ml-2 flex flex-col justify-start">
                <p className="text-secondary-color text-lg line-clamp-1 text-ellipsis lg:text-xl">{item.product}</p>
                <p className="text-secondary-color text-sm lg:text-lg">{item.shop}</p>
                <p className="text-primary-color font-bold">TO RECEIVE</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-4">No orders available</p>
      )}
    </div>
  );
};

export default OrderCard;
