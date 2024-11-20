import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash, faStore } from '@fortawesome/free-solid-svg-icons'; // Add faStore or any other icon
import Button from '../../../shared/Button';

function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      shopName: 'Dripstr Official',
      title: 'Dripstr Shirt',
      description: 'This is a great product that you will love.',
      image: 'https://via.placeholder.com/150',
      price: 29.99,
      quantity: 1,
      checked: false,
    },
    {
      id: 1.1,
      shopName: 'Dripstr Official',
      title: 'Almighty Push Shirt',
      description: 'Naruto Pain Shirt.',
      image: 'https://via.placeholder.com/150',
      price: 29.99,
      quantity: 1,
      checked: false,
    },
    {
      id: 2,
      shopName: 'Genghis Chan',
      title: '"I conquered the world" - Genghis',
      description: 'Short for "Greatness"',
      image: 'https://via.placeholder.com/150',
      price: 19.99,
      quantity: 1,
      checked: false,
    },
    {
      id: 2.1,
      shopName: 'Genghis Chan',
      title: 'UwU',
      description: 'U wot m8?',
      image: 'https://via.placeholder.com/150',
      price: 19.99,
      quantity: 1,
      checked: false,
    },
    {
      id: 3,
      shopName: 'Goth Boi Clique',
      title: 'Lil Peep Shirt',
      description: 'Loving you is like a fairytale.',
      image: 'https://via.placeholder.com/150',
      price: 19.99,
      quantity: 1,
      checked: false,
    },
    {
      id: 3.1,
      shopName: 'Goth Boi Clique',
      title: 'Sad Boy Shirt',
      description: 'I am a sad boy.',
      image: 'https://via.placeholder.com/150',
      price: 19.99,
      quantity: 1,
      checked: false,
    },
    {
      id: 3.2,
      shopName: 'Goth Boi Clique',
      title: 'Anti Social Social Clique',
      description: 'anti social.',
      image: 'https://via.placeholder.com/150',
      price: 19.99,
      quantity: 1,
      checked: false,
    },
    {
      id: 3.3,
      shopName: 'Goth Boi Clique',
      title: 'Gojo Pants',
      description: 'I alone am the honored one.',
      image: 'https://via.placeholder.com/150',
      price: 19.99,
      quantity: 1,
      checked: false,
    },
    {
      id: 4,
      shopName: 'DripAnime',
      title: 'Dandadan',
      description: 'Turbo Granny.',
      image: 'https://via.placeholder.com/150',
      price: 19.99,
      quantity: 1,
      checked: false,
    },
    {
      id: 4.1,
      shopName: 'DripAnime',
      title: 'Suguru Geto Compression Shirt',
      description: 'Compression Shirt for Suguru.',
      image: 'https://via.placeholder.com/150',
      price: 19.99,
      quantity: 1,
      checked: false,
    },
    {
      id: 4.2,
      shopName: 'DripAnime',
      title: 'Gun Park Glasses',
      description: 'Be like Gun Park.',
      image: 'https://via.placeholder.com/150',
      price: 19.99,
      quantity: 1,
      checked: false,
    },
  ]);

  // Group cart items by shop name
  const groupedItems = cartItems.reduce((acc, item) => {
    if (!acc[item.shopName]) {
      acc[item.shopName] = [];
    }
    acc[item.shopName].push(item);
    return acc;
  }, {});

  // Update quantity and recalculate total
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      return; // Prevent quantity from going below 1
    }
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Remove item from cart
  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Toggle checkbox selection for a product
  const handleCheckboxChange = (id) => {
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  // Toggle checkbox selection for all items in a shop
  const handleShopCheckboxChange = (shopName) => {
    const updatedItems = cartItems.map(item =>
      item.shopName === shopName ? { ...item, checked: !item.checked } : item
    );
    setCartItems(updatedItems);
  };

  // Calculate total price for a specific shop
  const calculateShopTotal = (shopName) => {
    return groupedItems[shopName].reduce((total, item) => {
      if (item.checked) {
        return total + item.price * item.quantity;
      }
      return total;
    }, 0).toFixed(2);
  };

  // Calculate total price for all checked items
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      if (item.checked) {
        return total + item.price * item.quantity;
      }
      return total;
    }, 0).toFixed(2);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-purple-600">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div>
          <div className="mb-4">
            {Object.keys(groupedItems).map(shopName => (
              <div key={shopName} className="mb-6 bg-slate-500 p-4 rounded-sm">
                <div className="flex items-center mb-4">
                  <FontAwesomeIcon icon={faStore} className="text-white mr-2" />
                  <h2 className="text-2xl font-bold text-white flex-grow">{shopName}</h2>
                  {/* Shop-level checkbox */}
                  <input
                    type="checkbox"
                    checked={groupedItems[shopName].every(item => item.checked)}
                    onChange={() => handleShopCheckboxChange(shopName)}
                    className="w-5 h-5"
                  />
                </div>
                {groupedItems[shopName].map(item => (
                  <div key={item.id} className="flex flex-wrap items-center mb-4 p-4 border-b bg-purple-100 rounded-sm">
                    {/* Product checkbox */}
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleCheckboxChange(item.id)}
                      className="w-5 h-5 mr-4"
                    />
                    <img src={item.image} alt={item.title} className="w-20 h-20 object-cover mr-4" />
                    <div className="flex-grow">
                      <h2 className="text-xl font-semibold text-purple-900">{item.title}</h2>
                      <p className='text-purple-900'>{item.description}</p>
                      <p className="text-purple-900">Price: ${(item.price * item.quantity).toFixed(2)}</p>
                      <div className="flex items-center mt-2">
                        <label className="mr-2 text-purple-900">Quantity:</label>
                        
                        {/* Decrease Quantity Button */}
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="bg-gray-200 text-gray-800 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-300"
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>

                        {/* Display Quantity */}
                        <span className="mx-4 text-lg text-purple-900">{item.quantity}</span>

                        {/* Increase Quantity Button */}
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="bg-gray-200 text-gray-800 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-300"
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>

                        {/* Remove Item Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="ml-4 text-red-600 hover:text-red-800"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between mt-4">
                  <p className="text-xl font-bold text-purple-900">Shop Total: ${calculateShopTotal(shopName)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-8">
            <p className="text-2xl font-bold text-purple-900">Total: ${calculateTotal()}</p>
            <Button className="bg-blue-500 text-white px-4 py-2 rounded">Proceed to Checkout</Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
