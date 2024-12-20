import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash, faStore, faTimes } from '@fortawesome/free-solid-svg-icons'; 
import Button from '../../../shared/Button';
import cartData from '../Model/CartData';
import Pagination from '../Controller/Pagination';


function Cart() {
  const [cartItems, setCartItems] = useState(cartData);
  const [showModal, setShowModal] = useState(false);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    // Get the cart data
    const storedItems = localStorage.getItem('cartItems');
    if (storedItems) {
      const items = JSON.parse(storedItems);
      setCartItems(items); // Set the items to the cart state
    }
  }, []);

  const handlePlaceOrder = (cartItems, groupedItems) => {
    // Filter the cartItems to get only those that are checked
    const selectedItems = cartItems.filter(item => item.checked);
  
    // Create a new groupedItems object that groups selected items by shopName
    const groupedSelectedItems = selectedItems.reduce((acc, item) => {
      if (!acc[item.shopName]) acc[item.shopName] = [];
      acc[item.shopName].push(item);
      return acc;
    }, {});
  
    // Prepare order details
    const orderDetails = {
      items: selectedItems.map(item => ({
        shopName: item.shopName,
        productName: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
      totalProductPrice: selectedItems.reduce((total, item) => total + item.price * item.quantity, 0),
      totalShippingFees: Object.keys(groupedSelectedItems).reduce(
        (total, shopName) =>
          total + groupedSelectedItems[shopName].reduce((shopTotal, item) => shopTotal + item.shippingFee, 0),
        0
      ),
      grandTotal: selectedItems.reduce((total, item) => total + item.price * item.quantity, 0) +
        Object.keys(groupedSelectedItems).reduce(
          (total, shopName) =>
            total + groupedSelectedItems[shopName].reduce((shopTotal, item) => shopTotal + item.shippingFee, 0),
          0
        ),
    };
  
    // Save order details to localStorage or send them to the server
    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
  
    // Redirect to Orders page
    window.location.href = '/account/orders';
  };
  
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Number of shop names to show per page

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const groupedItems = cartItems.reduce((acc, item) => {
    if (!acc[item.shopName]) acc[item.shopName] = [];
    acc[item.shopName].push(item);
    return acc;
  }, {});

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleCheckboxChange = (id) => {
    setCartItems(cartItems.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleCheckAll = () => {
    const allChecked = cartItems.every((item) => item.checked);
    setCartItems(cartItems.map((item) => ({ ...item, checked: !allChecked })));
  };

  const handleDeleteAll = () => {
    setCartItems(cartItems.filter((item) => !item));
  };

  const calculateTotalProducts = () => {
    return cartItems.filter((item) => item.checked).length;
  };

  const calculateAllProducts = () => {
    return cartItems.length;
  }

  const calculateShopTotal = (shopName) => {
    return groupedItems[shopName]
      .reduce((total, item) => {
        if (item.checked) return total + item.price * item.quantity;
        return total;
      }, 0)
      .toFixed(2);
  };  

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => {
        if (item.checked) return total + item.price * item.quantity;
        return total;
      }, 0)
      .toFixed(2);
  };

  const handleShopCheckboxChange = (shopName) => {
    const isShopChecked = groupedItems[shopName].every((item) => item.checked);
    setCartItems(cartItems.map((item) =>
      item.shopName === shopName ? { ...item, checked: !isShopChecked } : item
    ));
  };

  const handleProceedToCheckout = () => {
    const selectedItems = cartItems.filter((item) => item.checked);
    if (selectedItems.length === 0) {
      setShowCard(true);
      setTimeout(() => setShowCard(false), 3000); 
    } else {
      setShowModal(true);
    }
  };

  const closeModal = () => setShowModal(false);

  // Pagination logic
  const shopNames = Object.keys(groupedItems);
  const indexOfLastShop = currentPage * itemsPerPage;
  const indexOfFirstShop = indexOfLastShop - itemsPerPage;
  const currentShops = shopNames.slice(indexOfFirstShop, indexOfLastShop);
  const totalPages = Math.ceil(shopNames.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  
  
  return (
    <>
    <div className="p-3 bg-slate-200 h-full">
      <h1 className="text-3xl font-bold mb-8 text-center text-purple-600 ">Shopping Cart</h1>
      <div className="bg-slate-600 flex items-center justify-between p-4 rounded-md mb-4">
        <p className="text-white text-lg">Cart Products: {calculateAllProducts()}</p>
        <div className="flex items-center gap-4">
          <button
            onClick={handleCheckAll}
            className="text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Check / Uncheck All
          </button>
          <button
            onClick={handleDeleteAll}
            className="text-white bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
          >
            Delete All
          </button>
        </div>
      </div>
      {cartItems.length === 0 ? (
        <p className="text-center flex items-start justify-center mt-[18rem] font-extrabold text-purple-600 text-2xl">Your cart is empty.</p>
      ) : (
        <div className="flex flex-col">
          <div className="mb-4">
            {currentShops.map((shopName) => (
              <div key={shopName} className="mb-6 bg-slate-500 p-4 rounded-sm">
                <div className="flex items-center mb-4">
                  <FontAwesomeIcon icon={faStore} className="text-white mr-2" />
                  <h2 className="text-2xl font-bold text-white flex-grow">{shopName}</h2>
                  <input
                    type="checkbox"
                    checked={groupedItems[shopName].every((item) => item.checked)}
                    onChange={() => handleShopCheckboxChange(shopName)}
                    className="w-5 h-5"
                  />
                </div>
                {groupedItems[shopName].map((item) => (
                  <div key={item.id} className="flex flex-wrap items-center mb-4 p-4 border-b bg-purple-100 rounded-sm">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleCheckboxChange(item.id)}
                      className="w-5 h-5 mr-4"
                    />
                    <img src={item.image} alt={item.title} className="w-20 h-20 object-cover mr-4" />
                    <div className="flex-grow">
                      <h2 className="text-xl font-semibold text-purple-900">{item.title}</h2>
                      <p className="text-purple-900">{item.description}</p>
                      <p className="text-purple-900">Price: ${(item.price * item.quantity).toFixed(2)}</p>
                      <div className="flex items-center mt-2">
                        <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)} className="bg-gray-200 text-gray-800 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-300">
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <span className="mx-4 text-lg text-purple-900">{item.quantity}</span>
                        <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} className="bg-gray-200 text-gray-800 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-300">
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                        <button onClick={() => handleRemoveItem(item.id)} className="ml-4 text-red-600 hover:text-red-800">
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between mt-4">
                  <p className="text-xl font-bold text-white">
                    Shop Total: ${calculateShopTotal(shopName)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          <Pagination totalPages={totalPages} handlePageChange={handlePageChange} />

          {/* Sticky Total and Proceed Section */}
          <div className="flex justify-between items-center mt-8 sticky z-100 bottom-2 bg-slate-600 p-4 rounded-lg">
            <p className="text-2xl font-bold text-white">
              Total: ${calculateTotal()}
            </p>
            <Button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout ({calculateTotalProducts()})
            </Button>
          </div>
        </div>
 
      )}
      {showCard && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded shadow fade-in-out z-60">
          No items selected, please add a product first.
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center fade-in">
          <div className="absolute flex flex-col bg-slate-700 text-white p-6 rounded-md h-[40rem] w-[45rem] top-[6.5rem] overflow-hidden">
            <div className='flex flex-row items-center justify-between'>
              {/* Order Preview Header */}
              <h2 className="text-2xl font-bold mb-4">Order Preview</h2>
              <button className="text-white text-lg" onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Scrollable Area for the entire order preview if products > 3 */}
            <div className={`overflow-y-auto max-h-[80vh]`}>
              {/* Order Preview: Group Items by Shop */}
              {Object.keys(groupedItems).map(shopName => {
                const selectedShopItems = groupedItems[shopName].filter(item => item.checked);
                if (selectedShopItems.length === 0) return null;

                const shopTotal = selectedShopItems.reduce(
                  (total, item) => total + item.price * item.quantity,
                  0
                );

                return (
                  <div key={shopName} className="mb-6 bg-purple-800 p-4 rounded-sm">
                    {/* Shop Name and Products */}
                    <div className="flex items-center mb-4">
                      <FontAwesomeIcon icon={faStore} className="text-white mr-2" />
                      <h3 className="text-xl font-bold text-white flex-grow">{shopName}</h3>
                    </div>

                    {/* Products inside the shop */}
                    {selectedShopItems.map(item => (
                      <div key={item.id} className="flex flex-wrap items-center mb-4 p-4 border-b bg-purple-100 rounded-sm">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-20 h-20 object-cover mr-4"
                        />
                        <div className="flex-grow">
                          <h2 className="text-lg font-semibold text-purple-900">{item.title}</h2>
                          <p className="text-purple-900">Quantity: {item.quantity}</p>
                          <p className="text-purple-900">
                            Price: ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-purple-900">
                            Shipping Fee: ${item.shippingFee.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

          {/* Order Summary Section */}
          <div className="mt-6 bg-slate-800 p-4 rounded-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Order Summary</h3>
            </div>
            <div className="flex justify-between items-center gap-2.5 mt-2.5">
              <p className="text-md font-bold text-white">Payment Option:</p>
              <div className="flex gap-4">
                <label className="flex items-center text-white">
                  <input
                    type="radio"
                    name="paymentOption"
                    value="cashOnDelivery"
                    className="mr-2"
                  />
                  Cash on Delivery
                </label>
                <label className="flex items-center text-white">
                  <input
                    type="radio"
                    name="paymentOption"
                    value="paypal"
                    className="mr-2"
                  />
                  Paypal
                </label>
              </div>
            </div>
            <div className="flex justify-between items-center gap-2.5 mt-2.5">
                <p className="text-md font-bold text-white">Total Product Price:</p>
                <p className="text-md text-white">
                  ${cartItems
                    .filter(item => item.checked)
                    .reduce((total, item) => total + item.price * item.quantity, 0)
                    .toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between items-center gap-2.5 mt-2.5">
                <p className="text-md font-bold text-white">Total Shipping Fees:</p>
                <p className="text-md text-white">
                  ${Object.keys(groupedItems)
                    .reduce(
                      (total, shopName) =>
                        total +
                        groupedItems[shopName]
                          .filter(item => item.checked)
                          .reduce((shopTotal, item) => shopTotal + item.shippingFee, 0),
                      0
                    )
                    .toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between items-center gap-2.5 mt-2.5">
                <p className="text-lg font-bold text-white">Grand Total:</p>
                <p className="text-lg text-white">
                  ${(
                    cartItems.reduce((total, item) => {
                      if (item.checked) {
                        return total + item.price * item.quantity;
                      }
                      return total;
                    }, 0) +
                    Object.keys(groupedItems).reduce(
                      (total, shopName) =>
                        total +
                        groupedItems[shopName]
                          .filter(item => item.checked)
                          .reduce((shopTotal, item) => shopTotal + item.shippingFee, 0),
                      0
                    )
                  ).toFixed(2)}
                </p>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-6 w-full"
            onClick={() => handlePlaceOrder(cartItems, groupedItems)}
          >
            Place Order
          </button>
        </div>
      </div>
    )}
    </div>
    </>
  );
}

export default Cart;