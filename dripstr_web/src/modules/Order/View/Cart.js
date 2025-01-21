import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faStore, faTrash } from '@fortawesome/free-solid-svg-icons'; 
import Pagination from '../Controller/Pagination.js';

function Cart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;  // Set to 5 for pagination of 5 items per page
  const [selectedProducts, setSelectedProducts] = useState([]); //Handles checkbox change

  // Ensure each item has a 'count' property, defaulting to 1 if not present
  const [cartItems, setCartItems] = useState(
    cart.map(item => ({
      ...item,
      count: item.count || 1, // Initialize count if it's not set
    }))
  );

  useEffect(() => {
    // Persist cart items back to local storage whenever they change
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  if (cartItems.length === 0) {
    return (
      <div className='flex flex-col bg-slate-200 p-6 h-full'>
        <h1 className='text-4xl font-bold text-primary-color mb-6'>
          Shopping Cart
        </h1>
        <h1 className='text-2xl font-bold text-primary-color mb-6 flex justify-center items-center mt-[17rem]'>Your cart is empty</h1>
      </div>
    );
  }

  const minusCount = (itemId) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, count: Math.max(1, item.count - 1) } : item
      )
    );
  };

  const plusCount = (itemId) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, count: item.count + 1 } : item
      )
    );
  };

  // Determine pagination for cart items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cartItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(cartItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

    const handleCheckboxChange = (productId) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.includes(productId)
        ? prevSelected.filter((id) => id !== productId) // Deselect
        : [...prevSelected, productId] // Select
    );
    };

  return (
    <div className="flex flex-col bg-slate-200 p-6 h-full">
      <h1 className="text-4xl font-bold text-primary-color mb-6">Shopping Cart</h1>
      <div>
        <h1 className="text-md font-bold text-primary-color mb-6 flex justify-start">
          Total Products: {cartItems.length}
        </h1>
      </div>
      <div>
        {currentItems.map((item) => (
          <div key={item.id} className="flex bg-slate-400 p-4 gap-2 mb-4">
            <div>
              <h1 className="text-xl font-bold text-black mb-2 ml-3">
              <input type='checkbox'
              className='mr-2 w-4 h-4'
              checked={selectedProducts.includes(item.id)}
              onChange={() => handleCheckboxChange(item.id)}
              />
              <FontAwesomeIcon icon={faStore} /> {item.shop?.shop_name}
              </h1>
              <img
                src={item.url}
                alt={item.product_name}
                className="w-20 h-20 object-cover ml-3"
              />
            </div>
            <div className="text-black font-bold mt-8">
              <h2>{item.product_name}</h2>
              <div className="flex flex-row">
                <h2>Quantity:</h2>
                <div className="ml-2">
                  <FontAwesomeIcon icon={faMinus} className='cursor-pointer' onClick={() => minusCount(item.id)} />
                  <span> {item.count} </span>
                  <FontAwesomeIcon icon={faPlus} className='cursor-pointer' onClick={() => plusCount(item.id)} />
                </div>
              </div>
              <p>Price: ₱{item.price * item.count}</p>
            </div>
            {/* Trash Icon Container */}
            <div className=" ml-auto flex items-center">
              <FontAwesomeIcon
                icon={faTrash}
                className="text-red-500 cursor-pointer text-[2rem] mr-4"
                onClick={() =>
                  setCartItems((prevItems) =>
                    prevItems.filter((cartItem) => cartItem.id !== item.id)
                  )
                }
              />
            </div>
          </div>
        ))}
      </div>
      <div className='flex justify-center'>
        <Pagination totalPages={totalPages} handlePageChange={handlePageChange} />
      </div>
      
      <div className="mt-auto sticky bottom-0 w-full bg-slate-400 p-6 shadow-xl flex justify-between items-center">
        
        {/* Left Side (Shipping and Total Price) */}
        <div className="text-xl flex flex-col gap-4">
          <p className="text-md font-bold text-black">Shipping: ₱</p>
          <p className="text-2xl font-bold text-black">Total Price: ₱{cartItems.reduce((total, item) => total + item.price * item.count, 0)}</p>
        </div>

        {/* Right Side (Voucher and Payment Options) */}
        <div className="flex flex-col gap-4 items-end">
          {/* Apply Voucher */}
          <div className="flex items-center gap-4">
            <h1 className="text-md font-bold text-black">Apply Voucher:</h1>
            <input
              type="text"
              placeholder="Enter Voucher"
              className="p-2 border border-gray-300 bg-gray-300 rounded-md w-40 text-black h-8"
            />
          </div>

          {/* Payment Option */}
          <div className="flex items-center gap-4">
            <p className="text-md font-bold text-black">Payment Option:</p>
            <div className='flex flex-row gap-4'>
              <label className="flex items-center text-black">
                <input type="radio" name="paymentOption" value="cashOnDelivery" />
                Cash on Delivery
              </label>
              <label className="flex items-center text-black">
                <input type="radio" name="paymentOption" value="paypal" />
                Paypal
              </label>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="flex gap-4 items-center">
          <button className="btn btn-lg btn-primary py-2 px-6">
            Checkout ({selectedProducts.length})
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
