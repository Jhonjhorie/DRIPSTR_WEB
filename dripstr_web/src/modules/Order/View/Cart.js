import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash, faStore, faTimes } from '@fortawesome/free-solid-svg-icons'; // Added faTimes
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
        shippingFee: 9.99,
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
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 1.2,
        shopName: 'Dripstr Official',
        title: 'Pain Hoodie',
        description: 'Ultimate Pain Hoodie for fans.',
        image: 'https://via.placeholder.com/150',
        price: 49.99,
        quantity: 1,
        shippingFee: 9.99,
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
        shippingFee: 9.99,
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
        shippingFee: 9.99,
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
        shippingFee: 9.99,
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
        shippingFee: 9.99,
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
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 3.3,
        shopName: 'Goth Boi Clique',
        title: 'Gojo Pants',
        description: 'I alone am the honored one.',
        image: 'https://via.placeholder.com/150',
        price: 29.99,
        quantity: 1,
        shippingFee: 9.99,
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
        shippingFee: 9.99,
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
        shippingFee: 9.99,
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
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 5,
        shopName: 'Baltazar',
        title: 'Baltazar Hoodie',
        description: 'Comfortable and cozy hoodie.',
        image: 'https://via.placeholder.com/150',
        price: 39.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 5.1,
        shopName: 'Baltazar',
        title: 'Baltazar T-shirt',
        description: 'The perfect casual T-shirt for your daily wear.',
        image: 'https://via.placeholder.com/150',
        price: 19.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 5.2,
        shopName: 'Baltazar',
        title: 'Baltazar Sneakers',
        description: 'Stylish and comfortable sneakers.',
        image: 'https://via.placeholder.com/150',
        price: 59.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 6,
        shopName: 'StreetVibe',
        title: 'Vibe Check Sweatshirt',
        description: 'Be a vibe on the streets.',
        image: 'https://via.placeholder.com/150',
        price: 39.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 7,
        shopName: 'Hype Beast',
        title: 'Yeezy Inspired Shoes',
        description: 'Take your drip to the next level with these Yeezy-inspired kicks.',
        image: 'https://via.placeholder.com/150',
        price: 89.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 7.1,
        shopName: 'Hype Beast',
        title: 'Playboi Carti Hoodie',
        description: 'FWAEH!!!',
        image: 'https://via.placeholder.com/150',
        price: 89.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 7.1,
        shopName: 'Hype Beast',
        title: 'XXXTENTACION Hoodie',
        description: 'Look at me!',
        image: 'https://via.placeholder.com/150',
        price: 89.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 7.1,
        shopName: 'Hype Beast',
        title: 'Central Cee Pro Club Shirt',
        description: 'How can I be homophobic?',
        image: 'https://via.placeholder.com/150',
        price: 89.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 8,
        shopName: 'FlexGear',
        title: 'Camo Cargo Pants',
        description: 'For those who want to flex in comfort.',
        image: 'https://via.placeholder.com/150',
        price: 49.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 8.1,
        shopName: 'FlexGear',
        title: 'Drifit Long Sleeves',
        description: 'For those who want to flex in comfort.',
        image: 'https://via.placeholder.com/150',
        price: 49.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 9,
        shopName: 'Street Ink',
        title: 'Tattoo Print Hoodie',
        description: 'Show off your street art with this hoodie.',
        image: 'https://via.placeholder.com/150',
        price: 49.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 10,
        shopName: 'DripGrail',
        title: 'Grail Snapback Cap',
        description: 'The perfect snapback cap to complete your drip.',
        image: 'https://via.placeholder.com/150',
        price: 24.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 11,
        shopName: 'Vibe Nation',
        title: 'Street Kings T-shirt',
        description: 'Rule the streets in style.',
        image: 'https://via.placeholder.com/150',
        price: 22.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 11.1,
        shopName: 'Vibe Nation',
        title: 'El Chapo T-shirt',
        description: 'Rule the streets in style.',
        image: 'https://via.placeholder.com/150',
        price: 22.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 12,
        shopName: 'Hype Streetwear',
        title: 'Supreme Joggers',
        description: 'Get comfy with these sleek joggers.',
        image: 'https://via.placeholder.com/150',
        price: 49.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 12.1,
        shopName: 'Hype Streetwear',
        title: 'LV inspired Sneakers',
        description: 'Bootleg LV sneakers.',
        image: 'https://via.placeholder.com/150',
        price: 49.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },      
      {
        id: 13,
        shopName: 'Flexwear',
        title: 'Glow in the Dark Sneakers',
        description: 'Sneakers that shine bright at night.',
        image: 'https://via.placeholder.com/150',
        price: 79.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 14,
        shopName: 'Street Legends',
        title: 'Graffiti Hoodie',
        description: 'Express your street art vibe.',
        image: 'https://via.placeholder.com/150',
        price: 54.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 15,
        shopName: 'Urban Flow',
        title: 'Neon Tracksuit',
        description: 'Stay fresh and glowing with this neon tracksuit.',
        image: 'https://via.placeholder.com/150',
        price: 69.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 16,
        shopName: 'Rogue Clothing',
        title: 'Drip Squad Hoodie',
        description: 'Perfect for the squad that stays dripping.',
        image: 'https://via.placeholder.com/150',
        price: 59.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 17,
        shopName: 'Drip Society',
        title: 'Street Fighter Jacket',
        description: 'For those who fight in style.',
        image: 'https://via.placeholder.com/150',
        price: 89.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 18,
        shopName: 'Vibe City',
        title: 'Bubblegum Pink Crocs',
        description: 'The streetwear classic with a pop of color.',
        image: 'https://via.placeholder.com/150',
        price: 34.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 19,
        shopName: 'The Drip Lab',
        title: 'Panda Print Sweatpants',
        description: 'Cute and comfy for your street style.',
        image: 'https://via.placeholder.com/150',
        price: 39.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 20,
        shopName: 'Vibe Wave',
        title: 'Skull and Roses T-shirt',
        description: 'A mix of danger and beauty.',
        image: 'https://via.placeholder.com/150',
        price: 24.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 21,
        shopName: 'Urban Legends',
        title: 'Cyber Punk Beanie',
        description: 'A stylish beanie for futuristic vibes.',
        image: 'https://via.placeholder.com/150',
        price: 19.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 22,
        shopName: 'Flex Culture',
        title: 'Blackout Mask',
        description: 'Keep it mysterious with this blackout mask.',
        image: 'https://via.placeholder.com/150',
        price: 14.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 23,
        shopName: 'Street Stylz',
        title: 'Camo Snapback Cap',
        description: 'Complete your outfit with this camo snapback.',
        image: 'https://via.placeholder.com/150',
        price: 24.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 24,
        shopName: 'Vibe Nation',
        title: 'Midnight Tracksuit',
        description: 'A sleek and dark tracksuit for late-night vibes.',
        image: 'https://via.placeholder.com/150',
        price: 79.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 25,
        shopName: 'Gothic Drip',
        title: 'Vampire Hoodie',
        description: 'For those who live life on the edge.',
        image: 'https://via.placeholder.com/150',
        price: 59.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 26,
        shopName: 'Street Couture',
        title: 'Luxury Tracksuit',
        description: 'A track jacket that brings out the drip.',
        image: 'https://via.placeholder.com/150',
        price: 89.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 27,
        shopName: 'Graffiti Wear',
        title: 'Tag Crewneck Sweater',
        description: 'Represent your graffiti roots.',
        image: 'https://via.placeholder.com/150',
        price: 39.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 28,
        shopName: 'Vibe Lab',
        title: 'Street X T-shirt',
        description: 'Perfect for the streetwear aficionado.',
        image: 'https://via.placeholder.com/150',
        price: 29.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 29,
        shopName: 'Elite Drip',
        title: 'Limited Edition Drip Hoodie',
        description: 'Be exclusive with this limited edition hoodie.',
        image: 'https://via.placeholder.com/150',
        price: 89.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 30,
        shopName: 'DripCity',
        title: 'All-Black Everything T-shirt',
        description: 'Keep it simple but classy with all black.',
        image: 'https://via.placeholder.com/150',
        price: 19.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 31,
        shopName: 'Fresh Drip',
        title: 'DripWave Tracksuit',
        description: 'Surf the streets in this sleek tracksuit.',
        image: 'https://via.placeholder.com/150',
        price: 79.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 32,
        shopName: 'Vibe Lab',
        title: 'Rising Star Hoodie',
        description: 'For those who shine bright like a star.',
        image: 'https://via.placeholder.com/150',
        price: 49.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 33,
        shopName: 'Hype Legends',
        title: 'Street Royalty Shirt',
        description: 'Feel like a king on the streets.',
        image: 'https://via.placeholder.com/150',
        price: 22.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 34,
        shopName: 'Flex Nation',
        title: 'Urban Legend Cap',
        description: 'Top off your drip with this classic cap.',
        image: 'https://via.placeholder.com/150',
        price: 24.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 35,
        shopName: 'Vibe Wear',
        title: 'Skater Jacket',
        description: 'For skaters who want to stand out.',
        image: 'https://via.placeholder.com/150',
        price: 69.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 36,
        shopName: 'Fresh Wave',
        title: 'Glow Up Sneakers',
        description: 'These sneakers will have you glowing.',
        image: 'https://via.placeholder.com/150',
        price: 79.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 37,
        shopName: 'Drip Society',
        title: 'Psychedelic Hoodie',
        description: 'Turn heads with this psychedelic hoodie.',
        image: 'https://via.placeholder.com/150',
        price: 59.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 38,
        shopName: 'Urban Essentials',
        title: 'Minimalist Backpack',
        description: 'Perfect for keeping your essentials.',
        image: 'https://via.placeholder.com/150',
        price: 39.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 39,
        shopName: 'Drip Dream',
        title: 'City Life Sweatshirt',
        description: 'For those who love the city grind.',
        image: 'https://via.placeholder.com/150',
        price: 49.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 40,
        shopName: 'Flex Flow',
        title: 'Vibe King Hat',
        description: 'Feel like royalty with this crown-like cap.',
        image: 'https://via.placeholder.com/150',
        price: 24.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 41,
        shopName: 'Vibe Vision',
        title: 'Street Kings Snapback',
        description: 'A snapback for the kings of the street.',
        image: 'https://via.placeholder.com/150',
        price: 27.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 42,
        shopName: 'Hype Streetwear',
        title: 'Laser Cut Drip Pants',
        description: 'Sleek, stylish, and futuristic.',
        image: 'https://via.placeholder.com/150',
        price: 59.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 43,
        shopName: 'Flex Legends',
        title: 'Maverick Tracksuit',
        description: 'For the bold and adventurous.',
        image: 'https://via.placeholder.com/150',
        price: 69.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 44,
        shopName: 'Vibe Nation',
        title: 'Electric Blue Hoodie',
        description: 'Brighten up your day with this electric blue hoodie.',
        image: 'https://via.placeholder.com/150',
        price: 49.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 45,
        shopName: 'Street Couture',
        title: 'Camo Cargo Shorts',
        description: 'For the street-ready summer days.',
        image: 'https://via.placeholder.com/150',
        price: 39.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 46,
        shopName: 'Fresh Vibes',
        title: 'Drip Star Socks',
        description: 'Rock these socks for that extra drip.',
        image: 'https://via.placeholder.com/150',
        price: 9.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 47,
        shopName: 'Vibe Vision',
        title: 'Tech Drip Backpack',
        description: 'Keep your gear in this tech-inspired backpack.',
        image: 'https://via.placeholder.com/150',
        price: 49.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 48,
        shopName: 'Urban Flex',
        title: 'Future Boy Sneakers',
        description: 'Sneakers made for tomorrow’s street style.',
        image: 'https://via.placeholder.com/150',
        price: 79.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 49,
        shopName: 'Street Legends',
        title: 'Retro Drip Jacket',
        description: 'A blast from the past with a fresh drip.',
        image: 'https://via.placeholder.com/150',
        price: 69.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
      {
        id: 50,
        shopName: 'Hype Streetwear',
        title: 'Neon Green Joggers',
        description: 'Brighten up your joggers game with neon green.',
        image: 'https://via.placeholder.com/150',
        price: 39.99,
        quantity: 1,
        shippingFee: 9.99,
        checked: false,
      },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showCard, setShowCard] = useState(false);

  const groupedItems = cartItems.reduce((acc, item) => {
    if (!acc[item.shopName]) {
      acc[item.shopName] = [];
    }
    acc[item.shopName].push(item);
    return acc;
  }, {});

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(
      cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = id => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleCheckboxChange = id => {
    setCartItems(
      cartItems.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleCheckAll = () => {
    const allChecked = cartItems.every(item => item.checked);
    setCartItems(cartItems.map(item => ({ ...item, checked: !allChecked })));
  };

  const handleDeleteAll = () => {
    setCartItems(cartItems.filter(item => !item.checked));
  };

  const calculateTotalProducts = () => {
    return cartItems.filter(item => item.checked).length;
  };

  const calculateShopTotal = shopName => {
    return groupedItems[shopName]
      .reduce((total, item) => {
        if (item.checked) {
          return total + item.price * item.quantity;
        }
        return total;
      }, 0)
      .toFixed(2);
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => {
        if (item.checked) {
          return total + item.price * item.quantity;
        }
        return total;
      }, 0)
      .toFixed(2);
  };

  const handleShopCheckboxChange = shopName => {
    const isShopChecked = groupedItems[shopName].every(item => item.checked);
    const updatedItems = cartItems.map(item =>
      item.shopName === shopName
        ? { ...item, checked: !isShopChecked }
        : item
    );
    setCartItems(updatedItems);
  };

  const handleProceedToCheckout = () => {
    const selectedItems = cartItems.filter(item => item.checked);
    if (selectedItems.length === 0) {
      setShowCard(true);
      setTimeout(() => setShowCard(false), 3000); // Card disappears after 3 seconds
    } else {
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-purple-600">
        Shopping Cart
      </h1>
      <div className="bg-slate-600 flex items-center justify-between p-4 rounded-md mb-4">
        <p className="text-white text-lg">
          Total Products: {calculateTotalProducts()}
        </p>
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
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div>
          <div className="mb-4">
            {Object.keys(groupedItems).map(shopName => (
              <div
                key={shopName}
                className="mb-6 bg-slate-500 p-4 rounded-sm"
              >
                <div className="flex items-center mb-4">
                  <FontAwesomeIcon
                    icon={faStore}
                    className="text-white mr-2"
                  />
                  <h2 className="text-2xl font-bold text-white flex-grow">
                    {shopName}
                  </h2>
                  <input
                    type="checkbox"
                    checked={groupedItems[shopName].every(
                      item => item.checked
                    )}
                    onChange={() => handleShopCheckboxChange(shopName)}
                    className="w-5 h-5"
                  />
                </div>
                {groupedItems[shopName].map(item => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center mb-4 p-4 border-b bg-purple-100 rounded-sm"
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => handleCheckboxChange(item.id)}
                      className="w-5 h-5 mr-4"
                    />
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover mr-4"
                    />
                    <div className="flex-grow">
                      <h2 className="text-xl font-semibold text-purple-900">
                        {item.title}
                      </h2>
                      <p className="text-purple-900">{item.description}</p>
                      <p className="text-purple-900">
                        Price: ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <div className="flex items-center mt-2">
                        <label className="mr-2 text-purple-900">Quantity:</label>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          className="bg-gray-200 text-gray-800 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-300"
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <span className="mx-4 text-lg text-purple-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          className="bg-gray-200 text-gray-800 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-300"
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
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
                  <p className="text-xl font-bold text-white">
                    Shop Total: ${calculateShopTotal(shopName)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-8 sticky z-100 bottom-2 bg-slate-600 p-4 rounded-lg">
            <p className="text-2xl font-bold text-white">
              Total: ${calculateTotal()}
            </p>
            <Button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
      {showCard && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded shadow">
          No items selected, please add a product first.
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-slate-700 text-white p-6 rounded-md w-full max-w-4xl relative max-h-screen overflow-hidden">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white text-lg"
              onClick={closeModal}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>

            {/* Order Preview Header */}
            <h2 className="text-2xl font-bold mb-4">Order Preview</h2>

            {/* Scrollable Area for the entire order preview if products > 3 */}
            <div
              className={`overflow-y-auto max-h-80 ${
                Object.values(groupedItems).flat().filter(item => item.checked).length > 3
                  ? "h-80"
                  : ""
              }`}
            >
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
                      <div
                        key={item.id}
                        className="flex flex-wrap items-center mb-4 p-4 border-b bg-purple-100 rounded-sm"
                      >
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
                <p className="text-lg font-bold text-white">Total Product Price:</p>
                <p className="text-lg text-white">
                  ${cartItems
                    .filter(item => item.checked)
                    .reduce((total, item) => total + item.price * item.quantity, 0)
                    .toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between items-center gap-2.5 mt-2.5">
                <p className="text-lg font-bold text-white">Total Shipping Fees:</p>
                <p className="text-lg text-white">
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
              onClick={closeModal}
            >
              Place Order
            </button>
          </div>
        </div>
      )}    
    </div>
  );
}

export default Cart;
