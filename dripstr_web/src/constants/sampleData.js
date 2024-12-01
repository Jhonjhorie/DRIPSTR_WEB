export const Images = [
  { product: "Viscount Blank", rate: 4.1, shop: "Viscount", url: require('@/assets/images/home/blackTshirt.png') },
  { product: "Leather Mercedez", rate: 4.8, shop: "Aest", url: require('@/assets/images/home/brownShoes.png') },
  { product: "Runner Jump", rate: 3.0, shop: "Nike", url: require('@/assets/images/home/orangeShoes.png') },
  { product: "Retro Vans", rate: 1.4, shop: "Vans", url: require('@/assets/images/home/greyShoe.png') },
];


export const orderSample = Images;

export const currUser = {
  userId: "143143143",
  name: "Jolena Magdangal",
  avatarIcon: require('@/assets/images/samples/jolinapic.png'),
  title: "New Star",
  orders: orderSample,
};

export const products = [
  { 
    product: "Viscount Blank", 
    rate: 4.1, 
    reviews: [
      {
        id: 0, 
        userName: 'Anna', 
        date: '11/30/2024', 
        note: 'This is a good product thank you', 
        rate: 3.5, 
        likes: 15,
        images: [
          require('@/assets/images/home/blackTshirt.png'), 
          require('@/assets/images/home/blackTshirt.png')
        ], 
        colorOrder: 'Black', 
        sizeOrder: 'M'
      }
    ], 
    description: "Very Good black tshirt", 
    category: "t-shirt", 
    colorVariant: ['Black', 'Blue', 'Dark Black'], 
    sizeVariant: ['S', 'M', 'L', 'XL', '2XL'], 
    shop: "Viscount", 
    url: require('@/assets/images/home/blackTshirt.png'), 
    str: true, 
    discount: 50, 
    sold: 0, 
    voucher: false, 
    price: 100, 
    prodId: 1245, 
    images: [
      require('@/assets/images/home/orangeShoes.png'), 
      require('@/assets/images/home/greyShoe.png')
    ]
  },
  { 
    product: "Leather Mercedez", 
    rate: 0, 
    reviews: [], 
    description: "Elegant and stylish leather shoes for formal occasions.", 
    category: "shoes", 
    colorVariant: ['Brown'], 
    sizeVariant: ['7', '8', '9', '10'], 
    shop: "Aest", 
    url: require('@/assets/images/home/brownShoes.png'), 
    str: false, 
    discount: 0, 
    sold: 100, 
    voucher: false, 
    price: 400, 
    prodId: 2734, 
    images: [
      require('@/assets/images/home/orangeShoes.png'), 
      require('@/assets/images/home/greyShoe.png')
    ]
  },
  { 
    product: "Runner Jump", 
    rate: 3.0, 
    reviews: [
      {
        id: 1, 
        userName: 'Mike', 
        date: '11/28/2024', 
        note: 'Good for running, but lacks comfort for long durations.', 
        rate: 3.0, 
        likes: 8,
        images: [
          require('@/assets/images/home/orangeShoes.png')
        ], 
        colorOrder: 'Orange', 
        sizeOrder: '9'
      }
    ], 
    description: "High-performance running shoes.", 
    category: "shoes", 
    colorVariant: ['Orange', 'White'], 
    sizeVariant: ['7', '8', '9', '10', '11'], 
    shop: "Nike", 
    url: require('@/assets/images/home/orangeShoes.png'), 
    str: false, 
    discount: 0, 
    sold: 100, 
    voucher: false, 
    price: 100, 
    prodId: 1246, 
    images: [
      require('@/assets/images/home/orangeShoes.png'), 
      require('@/assets/images/home/greyShoe.png')
    ]
  },
  { 

    product: "Retro Vans", 
    rate: 4.4, 
    reviews: [
      {
        id: 1, 
        userName: 'Lisa', 
        date: '11/25/2024', 
        note: 'Perfect size and design. Highly recommend.', 
        rate: 5.0, 
        likes: 20,
        images: [],
        colorOrder: 'Black', 
        sizeOrder: 'One Size'
      },
      {
        id: 2, 
        userName: 'Lisa', 
        date: '11/25/2024', 
        note: 'Perfect size and design. Highly recommend.', 
        rate: 4.8, 
        likes: 20,
        images: [],
        colorOrder: 'Black', 
        sizeOrder: 'One Size'
      },
      {
        id: 3, 
        userName: 'Lisa', 
        date: '11/25/2024', 
        note: 'Perfect size and design. Highly recommend.', 
        rate: 3, 
        likes: 20,
        images: [],
        colorOrder: 'Black', 
        sizeOrder: 'One Size'
      }
    ], 
    description: "Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist. Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.Classic retro design with a modern twist.", 
    category: "shoes", 
    colorVariant: ['Grey', 'Black'], 
    sizeVariant: ['6', '7', '8', '9', '10'], 
    shop: "Vans", 
    url: require('@/assets/images/home/greyShoe.png'), 
    str: true, 
    discount: 0, 
    sold: 100, 
    voucher: false, 
    price: 300, 
    prodId: 1247 
  },
  {  
    product: "Classic Tote Bag", 
    rate: 4.9, 
    reviews: [
      {
        id: 2, 
        userName: 'Lisa', 
        date: '11/25/2024', 
        note: 'Perfect size and design. Highly recommend.', 
        rate: 5.0, 
        likes: 20,
        images: [],
        colorOrder: 'Black', 
        sizeOrder: 'One Size'
      }
    ], 
    description: "Stylish and durable tote bag for everyday use.", 
    category: "bags", 
    colorVariant: ['Black', 'Beige'], 
    sizeVariant: ['One Size'], 
    shop: "The Classics", 
    url: require('@/assets/images/samples/1.png'), 
    str: false, 
    discount: 20, 
    sold: 100, 
    voucher: true, 
    price: 200, 
    prodId: 1248
  },
  { 
 
    product: "Air White America", 
    rate: 3.8, 
    reviews: [
      {
        id: 3, 
        userName: 'John', 
        date: '11/29/2024', 
        note: 'Looks good, but not very comfortable for long wear.', 
        rate: 3.5, 
        likes: 10,
        images: [require('@/assets/images/samples/2.png')], 
        colorOrder: 'White', 
        sizeOrder: 'XL'
      }
    ], 
    description: "Lightweight white shirt inspired by American culture.", 
    category: "t-shirt", 
    colorVariant: ['White', 'Navy Blue'], 
    sizeVariant: ['M', 'L', 'XL'], 
    shop: "America", 
    url: require('@/assets/images/samples/2.png'), 
    str: false, 
    discount: 0, 
    sold: 50, 
    voucher: false, 
    price: 180, 
    prodId: 1299 
  },
  { 
   
    product: "RedCorner White-T", 
    rate: 5, 
    reviews: [
      {
        id: 4, 
        userName: 'Sophia', 
        date: '11/28/2024', 
        note: 'Amazing quality! Fits perfectly.', 
        rate: 5, 
        likes: 30,
        images: [], 
        colorOrder: 'White', 
        sizeOrder: 'L'
      }
    ], 
    description: "Premium white t-shirt with a minimalist design.", 
    category: "t-shirt", 
    colorVariant: ['White', 'Red'], 
    sizeVariant: ['S', 'M', 'L', 'XL'], 
    shop: "RedCorner", 
    url: require('@/assets/images/samples/3.png'), 
    str: true, 
    discount: 0, 
    sold: 150, 
    voucher: false, 
    price: 120, 
    prodId: 1335 
  },
  { 
  
    product: "Classic Aesthetic Cap", 
    rate: 4.7, 
    reviews: [
      {
        id: 5, 
        userName: 'David', 
        date: '11/27/2024', 
        note: 'Perfect for outdoor wear. Love the material.', 
        rate: 4.7, 
        likes: 12,
        images: [], 
        colorOrder: 'Black', 
        sizeOrder: 'One Size'
      }
    ], 
    description: "Trendy cap with a classic look.", 
    category: "caps", 
    colorVariant: ['Black', 'Gray'], 
    sizeVariant: ['One Size'], 
    shop: "Plains", 
    url: require('@/assets/images/samples/4.png'), 
    str: false, 
    discount: 50, 
    sold: 150, 
    voucher: true, 
    price: 100, 
    prodId: 1445 
  },
  { 
 
    product: "Japanese Aesthetic Black T-shirt", 
    rate: 4.8, 
    reviews: [
      {
        id: 6, 
        userName: 'Hiro', 
        date: '11/26/2024', 
        note: 'Soft fabric, very comfortable!', 
        rate: 4.8, 
        likes: 25,
        images: [require('@/assets/images/samples/5.png')], 
        colorOrder: 'Black', 
        sizeOrder: 'M'
      }
    ], 
    description: "Stylish black t-shirt with Japanese-inspired design.", 
    category: "t-shirt", 
    colorVariant: ['Black', 'White'], 
    sizeVariant: ['S', 'M', 'L'], 
    shop: "Japanese Aesthetic", 
    url: require('@/assets/images/samples/5.png'), 
    str: false, 
    discount: 0, 
    sold: 50, 
    voucher: false, 
    price: 250, 
    prodId: 1255 
  },
  { 
  
    product: "Japanese Aesthetic White T-shirt", 
    rate: 4.9, 
    reviews: [
      {
        id: 7, 
        userName: 'Ken', 
        date: '11/24/2024', 
        note: 'Simple yet elegant design. Highly recommend!', 
        rate: 4.9, 
        likes: 18,
        images: [], 
        colorOrder: 'White', 
        sizeOrder: 'L'
      }
    ], 
    description: "Premium white t-shirt with Japanese aesthetic.", 
    category: "t-shirt", 
    colorVariant: ['White', 'Black'], 
    sizeVariant: ['M', 'L', 'XL'], 
    shop: "Japanese Aesthetic", 
    url: require('@/assets/images/samples/6.png'), 
    str: true, 
    discount: 80, 
    sold: 150, 
    voucher: true, 
    price: 150, 
    prodId: 1645 
  },
  { 
    
    product: "Painter Cap", 
    rate: 4.1, 
    reviews: [
      {
        id: 8, 
        userName: 'Emily', 
        date: '11/23/2024', 
        note: 'Love the design, very artistic.', 
        rate: 4.1, 
        likes: 9,
        images: [], 
        colorOrder: 'Blue', 
        sizeOrder: 'One Size'
      }
    ], 
    description: "Creative painter cap for artistic looks.", 
    category: "caps", 
    colorVariant: ['Blue', 'Black'], 
    sizeVariant: ['One Size'], 
    shop: "PainterDrip", 
    url: require('@/assets/images/samples/7.png'), 
    str: false, 
    discount: 20, 
    sold: 100, 
    voucher: true, 
    price: 200, 
    prodId: 1145 
  },
  { 
    
    product: "Plain Shorts", 
    rate: 4.0, 
    reviews: [
      {
        id: 9, 
        userName: 'Mark', 
        date: '11/22/2024', 
        note: 'Comfortable and fits well.', 
        rate: 4.0, 
        likes: 11,
        images: [require('@/assets/images/samples/8.png')], 
        colorOrder: 'Gray', 
        sizeOrder: 'M'
      }
    ], 
    description: "Simple, plain shorts for everyday wear.", 
    category: "shorts", 
    colorVariant: ['Gray', 'Blue'], 
    sizeVariant: ['S', 'M', 'L'], 
    shop: "Litex Bazaar", 
    url: require('@/assets/images/samples/8.png'), 
    str: false, 
    discount: 0, 
    sold: 50, 
    voucher: false, 
    price: 180, 
    prodId: 1115 
  },
  { 
   
    product: "Hypebeast Original Pants", 
    rate: 4.7, 
    reviews: [
      {
        id: 10, 
        userName: 'James', 
        date: '11/21/2024', 
        note: 'These pants are very trendy and comfortable.', 
        rate: 4.7, 
        likes: 14, 
        images: [], 
        colorOrder: 'Black', 
        sizeOrder: 'L'
      }
    ], 
    description: "Trendy pants for a hypebeast look.", 
    category: "pants", 
    colorVariant: ['Black', 'Navy Blue'], 
    sizeVariant: ['M', 'L', 'XL'], 
    shop: "Hypebeast", 
    url: require('@/assets/images/samples/9.png'), 
    str: true, 
    discount: 0, 
    sold: 150, 
    voucher: false, 
    price: 120, 
    prodId: 1355 
  },
  { 
  
    product: "Trend Genggeng Shorts", 
    rate: 4.6, 
    reviews: [
      {
        id: 11, 
        userName: 'Lara', 
        date: '11/20/2024', 
        note: 'Good quality and affordable.', 
        rate: 4.6, 
        likes: 19, 
        images: [require('@/assets/images/samples/10.png')], 
        colorOrder: 'Red', 
        sizeOrder: 'S'
      }
    ], 
    description: "Stylish shorts with vibrant colors.", 
    category: "shorts", 
    colorVariant: ['Red', 'Black'], 
    sizeVariant: ['S', 'M', 'L'], 
    shop: "GenggengDrip", 
    url: require('@/assets/images/samples/10.png'), 
    str: false, 
    discount: 50, 
    sold: 150, 
    voucher: true, 
    price: 100, 
    prodId: 9845 
  },
  { 
  
    product: "Plain Assorted Shorts", 
    rate: 4.5, 
    reviews: [
      {
        id: 12, 
        userName: 'Mike', 
        date: '11/19/2024', 
        note: 'Decent quality and fits well.', 
        rate: 4.5, 
        likes: 13, 
        images: [], 
        colorOrder: 'Green', 
        sizeOrder: 'M'
      }
    ], 
    description: "Simple shorts available in various colors.", 
    category: "shorts", 
    colorVariant: ['Green', 'Blue', 'Gray'], 
    sizeVariant: ['S', 'M', 'L', 'XL'], 
    shop: "Litex Bazaar", 
    url: require('@/assets/images/samples/11.png'), 
    str: false, 
    discount: 0, 
    sold: 50, 
    voucher: false, 
    price: 250, 
    prodId: 1845 
  },
  { 
  
    product: "Anime ToteBag", 
    rate: 4.1, 
    reviews: [
      {
        id: 13, 
        userName: 'Yuki', 
        date: '11/18/2024', 
        note: 'Great bag for anime fans!', 
        rate: 4.1, 
        likes: 22, 
        images: [require('@/assets/images/samples/12.png')], 
        colorOrder: 'White', 
        sizeOrder: 'One Size'
      }
    ], 
    description: "Tote bag featuring anime-themed prints.", 
    category: "bags", 
    colorVariant: ['White', 'Black'], 
    sizeVariant: ['One Size'], 
    shop: "WeabooDrip", 
    url: require('@/assets/images/samples/12.png'), 
    str: true, 
    discount: 0, 
    sold: 150, 
    voucher: true, 
    price: 150, 
    prodId: 1288 
  },
  { 
 
    product: "Trend Anime Shoes", 
    rate: 5, 
    reviews: [
      {
        id: 14, 
        userName: 'Kenji', 
        date: '11/17/2024', 
        note: 'These shoes are amazing and unique!', 
        rate: 5, 
        likes: 30, 
        images: [], 
        colorOrder: 'White', 
        sizeOrder: '42'
      }
    ], 
    description: "Trendy anime-inspired shoes.", 
    category: "shoes", 
    colorVariant: ['White', 'Red'], 
    sizeVariant: ['40', '41', '42', '43'], 
    shop: "WeabooDrip", 
    url: require('@/assets/images/samples/13.png'), 
    str: false, 
    discount: 50, 
    sold: 150, 
    voucher: true, 
    price: 100, 
    prodId: 1111 
  },
  { 
    
    product: "Magical Fabric", 
    rate: 4.4, 
    reviews: [
      {
        id: 15, 
        userName: 'Emma', 
        date: '11/16/2024', 
        note: 'Soft and smooth texture, really love it.', 
        rate: 4.4, 
        likes: 15, 
        images: [require('@/assets/images/samples/14.jpg')], 
        colorOrder: 'Beige', 
        sizeOrder: 'L'
      }
    ], 
    description: "Fabric with a magical, silky touch.", 
    category: "fabric", 
    colorVariant: ['Beige', 'White'], 
    sizeVariant: ['M', 'L', 'XL'], 
    shop: "MagicDrip", 
    url: require('@/assets/images/samples/14.jpg'), 
    str: false, 
    discount: 0, 
    sold: 50, 
    voucher: false, 
    price: 250, 
    prodId: 1225 
  },
  { 
   
    product: "Black Plain T-shirt", 
    rate: 4.4, 
    reviews: [
      {
        id: 16, 
        userName: 'Noah', 
        date: '11/15/2024', 
        note: 'Basic and goes well with everything.', 
        rate: 4.4, 
        likes: 20, 
        images: [], 
        colorOrder: 'Black', 
        sizeOrder: 'M'
      }
    ], 
    description: "Classic black plain t-shirt.", 
    category: "t-shirt", 
    colorVariant: ['Black', 'Gray'], 
    sizeVariant: ['S', 'M', 'L', 'XL'], 
    shop: "Litex Bazaar", 
    url: require('@/assets/images/samples/15.png'), 
    str: true, 
    discount: 0, 
    sold: 150, 
    voucher: true, 
    price: 150, 
    prodId: 1545 
  }

];
