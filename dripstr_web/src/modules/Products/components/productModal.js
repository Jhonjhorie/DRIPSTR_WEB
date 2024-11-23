import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductModal = ({ item }) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/product/${item.product}`, { state: { item } });
   
  };

  return (
    <div className="modal-box w-11/12 max-w-5xl">
      <h3 className="font-bold text-lg">Product Details</h3>
      <p className="py-4">Product Name: {item.product}</p>
      <p className="py-2">Price: ₱{item.price}</p>
      <p className="py-2">Rating: {item.rate.toFixed(1)}</p>

      <form method="dialog" >
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >
          ✕
        </button>
       
        <button
          onClick={() => handleProductClick()}
          className="btn btn-sm btn-primary"
        >
          Go to Product Page
        </button>
        </form>

    </div>
  );
};

export default ProductModal;
