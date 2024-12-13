import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash, faStore, faTimes } from '@fortawesome/free-solid-svg-icons'; 
import Button from '../../../shared/Button';
import cartData from '../Model/CartData';
import Pagination from '../Controller/Pagination';


function Cart() {

  const cart = JSON.parse(localStorage.getItem('cart')) || [];


  if (cart.length === 0) {
    return (
      <div>
        <h1>Shopping Cart</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }
  
  return (
    <>
      <div className="flex flex-col bg-slate-200 p-6 h-full">
        <h1 className="text-4xl font-bold text-primary-color mb-6">Shopping Cart</h1>
        <div>
          {cart.map((item) => (
            <div key={item.id} className='flex bg-slate-400 p-4 gap-2 mb-4'>
              <div>
                <h1 className = "text-xl font-bold text-black mb-2 ml-3"> <img faStore/> {item.shop?.shop_name}</h1>
                  <img
                    src={item.url}
                    alt={item.product}
                    className="w-20 h-20 object-cover ml-3"
                  />  
              </div>
              <div className='text-black font-bold mt-8'>
                <h2>{item.product_name}</h2>
                <p>Price: ₱{item.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Cart;