import React from 'react';
import { useLocation } from 'react-router-dom';

function Product() {
  const location = useLocation();
  const productData = location.state?.item; // Safely access item from state

  if (!productData) {
    return <p>No product data found. Please return to the products page.</p>;
  }

  return (
    <div className="w-full relative inset-0 bg-slate-300 flex flex-col gap-2 px-2 py-4">
      <h1 className="text-xl font-bold">Product Details</h1>
      <p><strong>Name:</strong> {productData.product}</p>
      <p><strong>Price:</strong> ₱{productData.price}</p>
      <p><strong>Sold:</strong> {productData.sold}</p>
    </div>
  );
}

export default Product;
