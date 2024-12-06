  import React from 'react';
  import SideBar from '../Component/Sidebars'
  import sample1 from '../../../assets/images/samples/5.png'
  import sample2 from '../../../assets/images/samples/10.png'
  import sample3 from '../../../assets/images/samples/3.png'
  import sample4 from '../../../assets/images/samples/4.png'
  import sample5 from '../../../assets/images/samples/6.png'
  import sample6 from '../../../assets/images/samples/7.png'
  import sample7 from '../../../assets/images/samples/9.png'
  import sample8 from '../../../assets/images/samples/11.png'
  import sample9 from '../../../assets/images/samples/12.png'
  import sampleads from '../../../assets/shop/s2.jpg'

  import { blockInvalidChar } from "../Hooks/ValidNumberInput";
  const { useState } = React;
 

  function Products() { 
    const [activeTabs, setActiveTab] = useState('manage-products');
    const [isModalOpenItems, setIsModalOpenItem] = useState(false);  //Modal for Items
    const [isModalOpenAds, setIsModalOpenAds] = useState(false); //Modal for ads
    const [imageInputs, setImageInputs] = useState([]);
    const [Total, setNumber] = useState('');
    const [category, setCategory] = useState('');
    const [clotheType, setClotheType] = useState('');
    const [customerType, setCustomerType] = useState('');
    const [imageSrc, setImageSrc] = React.useState('');
    const [showAlert, setShowAlert] = React.useState(false); // Alert
    const [viewItem, setViewPost] = React.useState(false); // Confirmation for posting item
    const [selectedItem, setSelectedItem] = React.useState(null);
    const [selectedColors, setSelectedColors] = useState([]);
    const [otherColor, setOtherColor] = useState(""); 

    
    const handleAddItem = () => { //ITEMS
      setIsModalOpenItem(true);
    };
    const handleAddAds = () => { //ADS 
      setIsModalOpenAds(true);
    };
    const handleCloseModal = () => { //Close all modals even the datas
      setIsModalOpenItem(false);
      setIsModalOpenAds(false);
      setViewPost(false);
      setSelectedItem(null);
    };
    const handleViewClick = (item) => {
      setSelectedItem(item);
    };
    const addImageInput = () => {
        setImageInputs([...imageInputs, '']);
    };

    const deleteImageInput = (index) => {
        const newInputs = imageInputs.filter((_, i) => i !== index);
        setImageInputs(newInputs);
    };

    const Totaldigit = (e) => {
      let value = e.target.value;
      value = value.replace(/[^0-9]/g, '').slice(0, 6); 
      setNumber(value);
    };
    {/* Array for categories */}
    const categories = {
      "Complete set": [],
      "Top wear": ["T-Shirts", "Polo Shirts", "Tank Tops", "Sweatshirts", "Hoodies", "Blouses", "Crop Tops", "Tunics"],
      "Bottom wear": ["Jeans", "Shorts", "Skirts", "Trousers", "Leggings"],
      "Undergarment": ["Underwear", "Bras", "Socks"],
      "Accessory": ["Hats", "Belts", "Scarves", "Gloves"],
      "Gadgets": ["Watches", "Fitness Trackers", "Smart Glasses"],
      "Footwear": ["Sneakers", "Boots", "Sandals", "Formal Shoes"],
      "Others": ["Costumes", "Uniforms", "Swimwear"]
    };
    {/* List of Items sizes ADD MORE SIZES*/}
    const sizes = {
      "Kids-Boy": {
        "T-Shirts": ["4-5", "6-7", "8-10", "12-14", "16"],
        "Polo Shirts": ["4-5", "6-7", "8-10", "12-14", "16"],
        "Tank Tops": ["4-5", "6-7", "8-10", "12-14", "16"],
        "Sweatshirts": ["4-5", "6-7", "8-10", "12-14", "16"],
        "Hoodies": ["4-5", "6-7", "8-10", "12-14", "16"],
        "Jeans": [ "2T", "3T", "4T", "5T", "6T", "7T", "8", "10", "12", "14", "16", "18"],
        "Shorts": [ "2T", "3T", "4T", "5T", "6T", "7T", "8", "10", "12", "14", "16", "18"],
        "Skirts": [ "2T", "3T", "4T", "5T", "6T", "7T", "8", "10", "12", "14", "16", "18"],
        "Trousers": [ "2T", "3T", "4T", "5T", "6T", "7T", "8", "10", "12", "14", "16", "18"],
        "Leggings": [ "2T", "3T", "4T", "5T", "6T", "7T", "8", "10", "12", "14", "16", "18"],
        "Underwear": ["2T-3T", "4-5", "6-7", "8-10", "12-14"],
        "Socks": ["XS", "S", "M", "L", "XL"], // Based on shoe size ranges
        "Hats": ["XS", "S", "M", "L"], // Adjustable based on head circumference
        "Belts": ["20 in", "22 in", "24 in", "26 in", "28 in"], // Length in inches
        "Scarves": ["XS", "S", "M", "L"], // General sizes based on age
        "Gloves": ["XS", "S", "M", "L"], // Based on hand length
        "Watches": ["Small", "Medium", "Large"], // Band sizes
        "Fitness Trackers": ["Small", "Medium", "Large"],
        "Smart Glasses": ["Small", "Medium", "Large"],
        "Sneakers": ["4", "5", "6", "7", "8"], // US kids shoe sizes
        "Boots": ["4", "5", "6", "7", "8"],
        "Sandals": ["4", "5", "6", "7", "8"],
        "Formal Shoes": ["4", "5", "6", "7", "8"],    
        "Costumes": ["4-5", "6-7", "8-10", "12-14", "16"],
        "Uniforms": ["4-5", "6-7", "8-10", "12-14", "16"],
        "Swimwear": ["4-5", "6-7", "8-10", "12-14", "16"]
      },
      "Kids-Girl": {
        "T-Shirts": ["4-5", "6-7", "8-10", "12-14", "16"],
        "Polo Shirts": ["4-5", "6-7", "8-10", "12-14", "16"],
        "Tank Tops": ["4-5", "6-7", "8-10", "12-14", "16"],
        "Sweatshirts": ["4-5", "6-7", "8-10", "12-14", "16"],
        "Hoodies": ["4-5", "6-7", "8-10", "12-14", "16"],
        "Jeans": [ "2T", "3T", "4T", "5T", "6T", "7T", "8", "10", "12", "14", "16", "18"],
        "Shorts": [ "2T", "3T", "4T", "5T", "6T", "7T", "8", "10", "12", "14", "16", "18"],
        "Skirts": [ "2T", "3T", "4T", "5T", "6T", "7T", "8", "10", "12", "14", "16", "18"],
        "Trousers": [ "2T", "3T", "4T", "5T", "6T", "7T", "8", "10", "12", "14", "16", "18"],
        "Leggings": [ "2T", "3T", "4T", "5T", "6T", "7T", "8", "10", "12", "14", "16", "18"],
        "Blouses": ["4-5", "6-7", "8-10", "12-14", "16"],
        "Crop Tops": ["4-5", "6-7", "8-10", "12-14", "16"],
        "Underwear": ["2T-3T", "4-5", "6-7", "8-10", "12-14"],
        "Bras": ["30AA", "32AA", "34AA", "36AA"], // For older kids
        "Socks": ["XS", "S", "M", "L", "XL"], // Based on shoe size ranges
        "Hats": ["XS", "S", "M", "L"], // Adjustable based on head circumference
        "Belts": ["20 in", "22 in", "24 in", "26 in", "28 in"], // Length in inches
        "Scarves": ["XS", "S", "M", "L"], // General sizes based on age
        "Gloves": ["XS", "S", "M", "L"], // Based on hand length
        "Watches": ["Small", "Medium", "Large"], // Band sizes
        "Fitness Trackers": ["Small", "Medium", "Large"],
        "Smart Glasses": ["Small", "Medium", "Large"],
        "Sneakers": ["4", "5", "6", "7", "8"], // US kids shoe sizes
        "Boots": ["4", "5", "6", "7", "8"],
        "Sandals": ["4", "5", "6", "7", "8"],
        "Formal Shoes": ["4", "5", "6", "7", "8"],    
        "Costumes": ["4-5", "6-7", "8-10", "12-14", "16"],
        "Uniforms": ["4-5", "6-7", "8-10", "12-14", "16"],
        "Swimwear": ["4-5", "6-7", "8-10", "12-14", "16"]
      },
      "Adults-Man": {
        "T-Shirts": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
        "Polo Shirts": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
        "Tank Tops": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
        "Sweatshirts": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
        "Hoodies": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
        "Blouses": ["S", "M", "L", "XL", "XXL"], // For gender-neutral styles, sizes for men are typically S, M, L
        "Crop Tops": ["S", "M", "L", "XL"], // Unisex sizing, can be styled for men
        "Tunics": ["S", "M", "L", "XL", "XXL"],
        "Jeans": ["28", "29", "30", "31", "32", "33", "34", "35", "36", "38", "40"],
        "Shorts": ["S", "M", "L", "XL", "XXL"],
        "Skirts": ["S", "M", "L", "XL", "XXL"], // Not common for men, but unisex sizes apply
        "Trousers": ["28", "29", "30", "31", "32", "33", "34", "36", "38", "40"],
        "Leggings": ["S", "M", "L", "XL"], // For unisex athletic wear
        "Underwear": ["S", "M", "L", "XL", "XXL"],
        "Socks": ["S", "M", "L", "XL"], // Based on shoe size (typically for men: M - 6-9, L - 9-12, XL - 12+)
        "Hats": ["S", "M", "L"], // Based on head circumference
        "Belts": ["28", "30", "32", "34", "36", "38", "40"], // Waist sizes
        "Scarves": ["One Size"], // Usually one size fits most
        "Gloves": ["S", "M", "L", "XL"], // Based on hand measurement
        "Watches": ["Small", "Medium", "Large"], // Based on wrist size
        "Fitness Trackers": ["Small", "Medium", "Large"],
        "Smart Glasses": ["Small", "Medium", "Large"], // Frame size
        "Sneakers": ["6", "7", "8", "9", "10", "11", "12", "13", "14", "15"],
        "Boots": ["6", "7", "8", "9", "10", "11", "12", "13", "14"],
        "Sandals": ["6", "7", "8", "9", "10", "11", "12", "13"],
        "Formal Shoes": ["6", "7", "8", "9", "10", "11", "12", "13"],
        "Costumes": ["S", "M", "L", "XL", "XXL"],
        "Uniforms": ["S", "M", "L", "XL", "XXL"],
        "Swimwear": ["S", "M", "L", "XL", "XXL"]  
      },
      "Adults-Woman": {
        "T-Shirts": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
        "Polo Shirts": ["XS", "S", "M", "L", "XL", "XXL"],
        "Tank Tops": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
        "Sweatshirts": ["XS", "S", "M", "L", "XL", "XXL"],
        "Hoodies": ["XS", "S", "M", "L", "XL", "XXL"],
        "Blouses": ["XS", "S", "M", "L", "XL", "XXL"],
        "Crop Tops": ["XS", "S", "M", "L", "XL"],
        "Tunics": ["XS", "S", "M", "L", "XL", "XXL"],
        "Jeans": ["24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34"],
        "Shorts": ["XS", "S", "M", "L", "XL", "XXL"],
        "Skirts": ["XS", "S", "M", "L", "XL", "XXL"],
        "Trousers": ["XS", "S", "M", "L", "XL", "XXL"],
        "Leggings": ["XS", "S", "M", "L", "XL", "XXL"],
        "Underwear": ["XS", "S", "M", "L", "XL", "XXL"],
        "Bras": ["30A", "32A", "34A", "36A", "32B", "34B", "36B", "38B", "34C", "36C", "38C", "32D", "34D", "36D"],
        "Socks": ["S", "M", "L", "XL"], // Based on shoe size equivalency  
        "Hats": ["S", "M", "L"], // Based on head circumference
        "Belts": ["26", "28", "30", "32", "34", "36", "38"], // Waist size
        "Scarves": ["One Size"], // Usually adjustable
        "Gloves": ["S", "M", "L", "XL"], // Based on hand size
        "Watches": ["Small", "Medium", "Large"], // Based on wrist size
        "Fitness Trackers": ["Small", "Medium", "Large"],
        "Smart Glasses": ["Small", "Medium", "Large"],
        "Sneakers": ["5", "6", "7", "8", "9", "10", "11", "12"],
        "Boots": ["5", "6", "7", "8", "9", "10", "11", "12"],
        "Sandals": ["5", "6", "7", "8", "9", "10", "11", "12"],
        "Formal Shoes": ["5", "6", "7", "8", "9", "10", "11", "12"],
        "Costumes": ["XS", "S", "M", "L", "XL", "XXL"],
        "Uniforms": ["XS", "S", "M", "L", "XL", "XXL"],
        "Swimwear": ["XS", "S", "M", "L", "XL", "XXL"]
      }
    };
    {/* Will show a sizes choices */}
    const handleCustomerTypeChange = (e) => {
      setCustomerType(e.target.value);
      setCategory(''); // When click remove the content
      setClotheType(''); //''
    
    };
    {/* Function to show the next dropdown hehe */}
    const handleCategoryChange = (e) => {
      setCategory(e.target.value);
      setClotheType('');
    };
    //Pwede pala gantong comment hehe colors
    const colors = [
      "Red", "Green", "Blue", "Yellow", "Purple", "Orange", "Pink", 
      "Brown", "Gray", "Black", "White", "Cyan", "Magenta", "Teal", 
      "Lime", "Indigo", "Violet", "Maroon", "Beige", "Turquoise", 
      "Gold", "Silver", "Bronze", "Lavender", "Peach", "Coral", 
      "Aqua", "Olive", "Emerald", "Ivory", "Chartreuse", "Others"
    ];
    const handleCheckboxChange = (color) => {
      setSelectedColors(prevState => 
          prevState.includes(color) 
          ? prevState.filter(c => c !== color) 
          : [...prevState, color]
      );
  };
    //Ads image appear in the div
    const handleImagePick = (event) => {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
              setImageSrc(e.target.result);
          };
          reader.readAsDataURL(file);
      } else {
          setImageSrc('');
      }
    };
    const cancelImage = () => {
      setImageSrc('');
      document.getElementById('imageInput').value = '';
    }
    const PostNotify = () => { //Notify when post
      setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
      }, 3000);
      setSelectedItem(false);
    }
    const ViewPostEDIT = () => {
      setViewPost(true);
    }
    //Items sample datas
    const sampleData = [
      { id: 1, photo: sample1, name: 'Viscount Black', qty: 10, category: 'Top wear', type: 'T-Shirts', customerType: 'Adults-Man', availableSizes: ["S", "M", "L", "XL", "XXL"], colors: ["Black", "Gray", "White", "Blue", "Red"], rating: 4 },
      { id: 2, photo: sample2, name: 'Duke Blue', qty: 5, category: 'Top wear', type: 'Polo Shirts', customerType: 'Adults-Woman', availableSizes: ["XS", "S", "M", "L", "XL"], colors: ["Blue", "Cyan", "Teal", "White", "Pink"], rating: 5 },
      { id: 3, photo: sample3, name: 'Earl Grey', qty: 8, category: 'Top wear', type: 'Sweatshirts', customerType: 'Kids-Boy', availableSizes: ["4-5", "6-7", "8-10", "12-14", "16"], colors: ["Gray", "Black", "Red", "Green", "Yellow"], rating: 3 },
      { id: 4, photo: sample4, name: 'Count Crimson', qty: 12, category: 'Top wear', type: 'Hoodies', customerType: 'Kids-Girl', availableSizes: ["4-5", "6-7", "8-10", "12-14", "16"], colors: ["Red", "Pink", "Purple", "White", "Lavender"], rating: 4 },
      { id: 5, photo: sample5, name: 'Baron Green', qty: 7, category: 'Top wear', type: 'Tank Tops', customerType: 'Adults-Woman', availableSizes: ["XS", "S", "M", "L", "XL"], colors: ["Green", "Lime", "Olive", "Yellow", "Beige"], rating: 5 },
      { id: 6, photo: sample6, name: 'Marquis Magenta', qty: 9, category: 'Top wear', type: 'Crop Tops', customerType: 'Kids-Girl', availableSizes: ["4-5", "6-7", "8-10", "12-14", "16"], colors: ["Magenta", "Pink", "Purple", "White", "Peach"], rating: 3 },
      { id: 7, photo: sample7, name: 'Lord Lavender', qty: 6, category: 'Top wear', type: 'Blouses', customerType: 'Adults-Woman', availableSizes: ["S", "M", "L", "XL", "XXL"], colors: ["Lavender", "Violet", "Silver", "Indigo", "Turquoise"], rating: 5 },
      { id: 8, photo: sample8, name: 'Sir Silver', qty: 11, category: 'Top wear', type: 'Tunics', customerType: 'Adults-Man', availableSizes: ["S", "M", "L", "XL", "XXL"], colors: ["Silver", "Gray", "White", "Black", "Teal"], rating: 4 },
      { id: 9, photo: sample9, name: 'Lady Lilac', qty: 4, category: 'Top wear', type: 'Sweatshirts', customerType: 'Kids-Boy', availableSizes: ["4-5", "6-7", "8-10", "12-14", "16"], colors: ["Lilac", "Purple", "Blue", "Pink", "Cyan"], rating: 2 }
    ];
    
    
  
    return (
    <div className="h-full w-full overflow-y-scroll bg-slate-300 px-2 md:px-10 lg:px-20 custom-scrollbar">
      <div className='absolute mx-3 right-0 z-10'>
        <SideBar/>
      </div>
    

      <div className='w-full h-full bg-slate-300 '>
        <div className=' text-4xl text-custom-purple font-bold p-2 py-3'>Manage Products</div>
        <div className='h-[550px] p-5 w-full overflow-hidden rounded-md shadow-md bg-slate-100'>
          <div className=' w-full flex gap-5 place-items-center justify-between mb-2'>
            <div className='md:flex md:gap-2 font-semibold text-slate-400'>
              <div  className={activeTabs === 'manage-products' ? 'active-tabs' : 'mb-2 md:mb-0'} onClick={() => setActiveTab('manage-products')}>
                <span className=' rounded-md hover:scale-95 duration-300 cursor-pointer text-sm md:text-lg bg-custom-purple glass p-1  md:p-3'>Manage Products</span>
              </div> 
              <div className={activeTabs === 'manage-adds' ? 'active-tabs' : 'mt-2 md:mt-0'} onClick={() => setActiveTab('manage-adds')}>
                <span className=' rounded-md hover:scale-95 duration-300 cursor-pointer text-sm md:text-lg bg-custom-purple glass p-1 md:p-3'>Manage Ads</span>
              </div>
            </div>
            
            <div className='flex  md:gap-2 text-slate-50 rounded-md hover:scale-95 duration-300 cursor-pointer text-sm md:text-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 glass p-1 md:p-2'>
              Create New Design
              <box-icon type='solid' color='#e2e8f0' name='palette'></box-icon>  
            </div>
            
          </div>
            <div className="w-full h-full custom-scrollbar bg-slate-200 shadow-inner rounded-md p-4 overflow-y-scroll">
              {activeTabs === 'manage-products' && (
                  <div className='mb-8'>
                    <div className='flex justify-between'>
                    <h2 className="text-xl md:text-3xl text-custom-purple iceland-regular mt-3 md:mt-0 font-bold mb-4 flex place-items-center gap-1 md:gap-5">Manage Product 
                        <div className="tooltip tooltip-bottom " data-tip=" Once the Item is added, it doesn't mean it automatically added to the shop preview, but it will
                        only store to this page, you can still have the decision to post it. ">
                            <button className="hover:bg-slate-600 glass bg-custom-purple duration-300 shadow-md place-items-center flex rounded-full">
                              <box-icon color='#FFFFFF' name='info-circle'></box-icon>
                            </button>
                        </div>
                      </h2>
                      <div className='flex gap-2 justify-center  place-items-center'>
                          <div
                           onClick={handleAddItem}
                           className='bg-custom-purple p-1 md:px-2 text-slate-50 cursor-pointer text-sm  duration-200 hover:scale-95 rounded-sm '>Add Items</div>
                      </div>
                    </div>
                      
                      <div className=' flex gap-2 font-semibold justify-around md:justify-between px-2 text-slate-800'>
                          <li className='list-none md:pl-5'>Item ID</li> 
                          <li className='list-none lg:-ml-48'>Photo</li> 
                          <li className='list-none lg:-ml-14'>Name</li> 
                          <li className='list-none lg:-ml-10'>QTY</li> 
                          <li className='list-none md:pr-6'>Action</li>
                      </div>
                      

                      {sampleData.map(item => (
                        <div key={item.id} className="p-2 text-slate-900 h-16 shadow-sm w-full bg-slate-100 flex justify-between gap-2 mb-2">
                            <div className="h-full w-1/12 flex items-center justify-center">{item.id}</div>
                            <div className="h-full w-2/12 flex items-center justify-center">
                                <div className="h-14 w-14 rounded-sm bg-slate-200">
                                    <img
                                        src={item.photo}
                                        alt={`Image of ${item.name}`}
                                        className="drop-shadow-custom h-full w-full object-cover rounded-md"
                                        sizes="100%"
                                    />
                                </div>
                            </div>
                            <div className="h-full w-4/12 flex items-center justify-center">{item.name}</div>
                            <div className="h-full w-1/12 flex md:pl-5 lg:pl-24 items-center justify-center">
                              <span className={item.qty < 11 ? "text-red-500 font-semibold" : "text-primary-color font-bold"}>{item.qty}</span>
                            </div>
                            <div className="h-full w-4/12 flex items-center justify-end gap-2">
                        
                                <div
                                 onClick={() => handleViewClick(item)} 
                                 className="h-full px-2 md:w-24 bg-slate-500 flex items-center justify-center rounded-md font-semibold hover:text-white hover:bg-custom-purple glass duration-300 cursor-pointer hover:scale-95">View</div>
                            </div>
                        </div>
                      ))}


                      
                      
                  </div>
              )}
              {activeTabs === 'manage-adds' && (
                  <div>
                      <div className='flex justify-between'>
                      <h2 className="text-xl md:text-3xl text-custom-purple iceland-regular mt-3 md:mt-0 font-bold mb-4 flex place-items-center gap-1 md:gap-5">Manage Shop Advertisement 
                        <div className="tooltip tooltip-bottom " data-tip=" Maximum advertisement photos to be posted is 3 to 5 Images only.  ">
                            <button className="hover:bg-slate-600 glass bg-custom-purple duration-300 shadow-md place-items-center flex rounded-full">
                              <box-icon color='#FFFFFF' name='info-circle'></box-icon>
                            </button>
                        </div>
                      </h2>
                      <div className='flex gap-2 justify-center  place-items-center'>
                          <div
                           onClick={handleAddAds}
                           className='bg-custom-purple text-sm p-1 md:px-2 text-slate-50 cursor-pointer duration-200 hover:scale-95 rounded-sm '>Add photo Ads</div>
                      </div>
                    </div>

                      <div className=' flex font-semibold justify-between px-2 text-slate-800'>
                          <li className='list-none'>Ads ID / Photo</li> 
                          <li className='list-none'>Name</li> 
                          <li className='list-none pr-4'>Action</li> 
                      </div>
                      <div className='p-2 text-slate-900 h-16 shadow-sm w-full bg-slate-100 flex justify-between gap-2'>
                          <div className='h-full w-20 place-items-center justify-center flex'> 10 </div>
                          <div className='h-full w-14 rounded-sm bg-slate-200'>
                          <img
                            src={sampleads}
                            alt="Shop Logo"
                            className="drop-shadow-custom h-full w-full object-cover rounded-md"
                            sizes="100%"
                          />
                          </div>
                          <div className='h-full w-full place-items-center flex justify-center '> Latest Drip Design </div>
                          <div
                      
                          className=' h-full w-24 bg-slate-500 place-content-center items-center rounded-md font-semibold
                          hover:text-white hover:bg-custom-purple glass duration-300 cursor-pointer hover:scale-95 flex '>View</div>
                      </div>
                  </div>
              )}

            </div>
          <div className='bg-slate-600 w-full h-9'></div>
        </div>
      </div>
      {/* Add Item Modal */} 
      {isModalOpenItems && (
    <div className="fixed inset-0 pt-16 flex items-center justify-center bg-slate-900 bg-opacity-75 ">
      <div className="bg-white pt-2 rounded-lg p-5 w-full md:w-1/2 lg:w-3/4 m-2 md:m-0">
        <h2 className=" flex justify-between w-full place-items-center   "><span className='font-bold text-[20px] text-slate-800 py-2 md:text-2xl '>ADD ITEM</span> <box-icon type='solid' color='#4D077C' name='customize'></box-icon></h2>
        <div className='bg-slate-200 h-[400px] md:h-full rounded-md overflow-hidden custom-scrollbar overflow-y-scroll md:flex gap-1 w-full p-2 md:px-5 mb-2'>
          <div className='w-full md:w-1/4 h-auto p-1 pr-5 '> 
            <label className='text-slate-950  font-semibold mr-2 text-sm'>Item Name:</label><br/>
            <input type='text' className=' bg-slate-50 p-1 rounded-sm  mt-2 text-slate-800 w-full shadow-md' placeholder='Item Name '></input> <br/>
            <label className='text-slate-950 font-semibold text-sm mr-2 '>Total:</label><br/>
            <input
              type="number"
              value={Total}
              onChange={Totaldigit}
              onKeyDown={blockInvalidChar}
              className=' bg-slate-50 p-1 rounded-sm text-slate-800 mt-1 w-full shadow-md' 
              placeholder='Quantity '>
            </input> <br/>
            {/* customer type */}
            <label className='text-slate-950 font-semibold text-sm mr-2'>Customer Type:</label><br/>
              <select
                  id="customerType"
                  value={customerType}
                  onChange={handleCustomerTypeChange}
                  className="bg-slate-100 w-full text-slate-800 border py-1 px-2 rounded-md text-sm shadow-md"
              >
                  <option value="">Select Customer Type</option>
                  <option value="Kids-Boy">Kids Boy</option>
                  <option value="Kids-Girl">Kids Girl</option>
                  <option value="Adults-Man">Teen & Adult Man</option>
                  <option value="Adults-Woman">Teen & Adult Woman</option>
              </select><br/>
        

              {customerType && (
                <div className="mb-4">
                    <label className='text-slate-950 font-semibold text-sm mr-2'>Category:</label><br/>
                    <select
                        id="category"
                        className="bg-slate-100 w-full text-slate-800 border py-1 px-2 rounded-md text-sm shadow-md"
                        value={category}
                        onChange={handleCategoryChange}
                    >
                        <option value="">Select Category</option>
                        {Object.keys(categories).map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select><br/>

                    {category && categories[category].length > 0 && (
                        <>
                            <label className='text-slate-950 font-semibold text-sm mr-2'>Clothe Type:</label><br/>
                            <select
                                id="clotheType"
                                className="bg-slate-100 w-full text-slate-800 border py-1 px-2 rounded-md text-sm shadow-md"
                                value={clotheType}
                                onChange={(e) => setClotheType(e.target.value)}
                            >
                                <option value="">Select Clothe Type</option>
                                {categories[category].map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select><br/>
                        </>
                    )}
                </div>
              )}

             
          </div>

          {/* Select sizes */}
          <div className=' w-full md:w-1/4 h-full py-1'>
          <div className=' flex gap-2 place-items-center justify-between '>
            <label className='text-slate-950 font-semibold text-sm '>Color Variant</label> 
            <div className="tooltip tooltip-bottom " data-tip="Our sizes are based on US standards. To provide better sizing guidance, we highly recommend uploading an image with detailed size instructions to help customers understand.">
                <button className="hover:bg-slate-600 glass bg-custom-purple duration-300 shadow-md place-items-center flex rounded-full">
                  <box-icon color='#FFFFFF' name='info-circle'></box-icon>
                </button>
            </div>
          </div>
          
          <div className='h-[400px] mt-2 w-full relative bg-slate-100 overflow-hidden overflow-y-scroll shadow-sm shadow-slate-500 rounded-sm custom-scrollbar'>
          {clotheType.length === 0 && (
              <div className="text-red-500 text-sm mt-2 text-center">
                  Please Complete the Selection
              </div>
          )}
            {clotheType && colors.length > 0 && (
            <div className="grid grid-cols-2 pb-10 gap-1 p-2">
              
                {colors.map((color, index) => (
                  <div className=' w-full  h-full'>
                        <div key={index} className="flex items-center mb-2">
                          <input
                              type="checkbox"
                              id={color}
                              name={color}
                              className="mr-2"
                              onChange={() => handleCheckboxChange(color)}
                          />
                          <label htmlFor={color} className="text-sm text-gray-700">{color}</label>
                        
                        </div>
                        
                          {color === "Others" && selectedColors.includes("Others") && (
                              <input
                                  type="text"
                                  placeholder="Specify color"
                                  className="absolute p-1 border left-5 w-48 rounded text-sm bg-slate-200"
                                  onChange={(e) => setOtherColor(e.target.value)}
                              />
                          )}
                        
                      
                  </div>
                
                    
                ))}
               
            </div>
             )}
          </div>
          
            
          </div>
           {/* Select variant and photo */}
          <div className='w-full md:w-1/2 h-full '>

          <div className='flex justify-between place-items-center w-full '>
            <label className='text-slate-950 font-semibold mr-2  text-sm'> Put Image, Size, Quantity, Price </label>  
            
            <button 
                  className="bg-custom-purple justify-center flex text-white p-1 hover:bg-slate-600 duration-300 rounded-md "
                  onClick={addImageInput}
              >
                 <box-icon type='solid' color='#FFFFFF' name='folder-plus'></box-icon>
              </button>
          </div>
            <div className='flex justify-between place-items-center w-full  mt-1 '>

         
            </div>
            <div className='bg-gradient-to-br from-violet-500 to-fuchsia-500 h-[400px] w-full p-2 overflow-hidden overflow-y-scroll shadow-inner shadow-slate-500 rounded-sm  custom-scrollbar '>
             
                <div>
                {selectedColors.length === 0 && (
                    <div className="text-slate-100 text-sm mt-2 text-center">
                        Please Select a Variant
                    </div>
                )}
                {selectedColors.map((color, index) => (
                    <div key={index} className=" rounded-md p-1 mb-2 bg-slate-400 bg-opacity-60 glass shadow-md">
                        <label className="block text-gray-800 text-sm text-center w-full bg-slate-100 mb-2 rounded-t-md py-2 ">Upload an image for variant <span className='font-bold uppercase '> {color}</span></label>
                        <input 
                            type="file"
                            accept="image/*" 
                            className={`block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-${color.toLowerCase()}-50 focus:outline-none`}
                        />
                        
                        {/* Render size selection and price input here */}
                        {clotheType && sizes[customerType] && sizes[customerType][clotheType] ? (
                            sizes[customerType][clotheType].map((size, sizeIndex) => (
                                <div key={sizeIndex} className="p-2 flex gap-2 place-items-center">
                                    <div className='w-1/3'>
                                        <input 
                                            type="checkbox" 
                                            id={`size-${size}-${color}`} 
                                            name="sizes" 
                                            value={size} 
                                            className="mr-2"
                                        />
                                        <label htmlFor={`size-${size}-${color}`} className="text-slate-800 text-sm">
                                            {size}
                                        </label>
                                    </div>
                             
                                    <div className='gap-2 flex p-2 justify-end w-1/3'>
                                        <label className='text-sm text-slate-800'>Quantity:</label>
                                        <input 
                                            onKeyDown={blockInvalidChar} 
                                            type='number' 
                                            placeholder="Quantity"
                                            className='bg-slate-200 px-1 shadow-sm rounded-sm w-24 text-slate-700'
                                        />
                                    </div>
                                    <div className='gap-2 p-2 flex w-1/3'>
                                        <label className='text-sm text-slate-800'> Price:</label>
                                        <input 
                                            className='bg-slate-200 px-1 shadow-sm rounded-sm w-24 text-slate-700' 
                                            onKeyDown={blockInvalidChar} 
                                            type='number'
                                            placeholder="Price"
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-800 text-c text-sm p-2">No sizes available for the selected options.</p>
                        )}
                        
                        
                    </div>
                ))}

                {imageInputs.map((input, index) => (
                    <div key={index} className="flex items-center mb-2">
                        <input 
                            type="file" 
                            accept="image/*"
                            className="border p-2 w-full bg-slate-200 h-auto text-slate-800 text-sm"
                        />
                        <button 
                            className="ml-2 bg-red-500 text-white h-9 px-2 py-1 rounded"
                            onClick={() => deleteImageInput(index)}
                        >
                            Clear
                        </button>
                    </div>
                ))}

                </div>
            </div>

          </div>
        
        </div>
        <div className='flex justify-between w-full'>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={handleCloseModal}
          >
            Close
          </button>
          <button 
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleCloseModal}
          >
           Add Item
          </button>
        </div>
      </div>
    </div>
      )}
      {/* Add Advertisement Modal */} 
      {isModalOpenAds && (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 ">
        <div className="bg-white rounded-lg p-5 h-auto w-full md:w-3/4 pt-2 lg:w-1/2 m-2 md:m-0 auto">
          <div className="font-medium text-slate-800 py-2 w-full flex justify-between place-items-center  ">
            <span className='font-bold text-[20px] md:text-2xl'>Add Shop Advertisement Photo</span>
            <box-icon name='images' color='#4D077C'></box-icon>
          </div>
          <div className='h-auto w-full bg-slate-200 place-items-center md:place-items-start  rounded-md shadow-sm mb-2 p-2 md:flex gap-2'>
            
              <div className='md:w-1/2 h-auto p-2'>
                <div className='mt-2'>
                  <label className=' text-slate-800  text-sm font-semibold' >Name:</label> <br/>
                  <input type='text' className='bg-slate-100 p-1 rounded-sm shadow-md mt-1 text-slate-800 w-full' placeholder='Type Ad Name' ></input> <br/>  
                </div>
                <div className='mt-2 '>
                  <label className=' text-slate-800  text-sm font-semibold mt-2' >Choose a marketing visual</label> <br/>
                  <input 
                  onChange={handleImagePick}
                  accept="image/*"
                  id="imageInput"
                  type='file' className='bg-slate-100 text-slate-700 w-full shadow-md mt-1'></input>
                  <div className=' place-items-end py-2'>
                    <div
                    onClick={cancelImage}
                    className='bg-custom-purple p-1 glass rounded-md hover:scale-95 duration-300 cursor-pointer text-white'>Cancel </div>
                  </div>
                </div>
              
              </div>
              <div className='w-[180px] h-2/3 md:w-1/2 md:h-full bg-custom-purple shadow-md glass rounded-sm p-2'>
               <div className='bg-slate-100 h-[200px] md:h-[350px] rounded-sm shadow-md place-items-center flex place-content-center'>
                  {imageSrc ? (
                      <img src={imageSrc} className="h-full w-full object-contain" alt="Preview of the selected marketing visual" />
                  ) : (
                      <span>Ads will appear here</span>
                  )}
               </div>
              </div>
            
          </div>
             
          <div className='flex justify-between w-full'>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={handleCloseModal}
            >
              Close
            </button>
            <button 
              className="bg-green-500  text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={handleCloseModal}
            >
              Add
            </button>
          </div>
        </div>
      </div>
      )}
 

    {/* ALLERTS */} 
      {showAlert && (
          <div className="md:bottom-5 lg:bottom-10 z-10 justify-end md:right-5 lg:right-10 h-auto absolute transition-opacity duration-1000 ease-in-out opacity-100">
            <div role="alert" className="alert alert-success shadow-md flex items-center p-4 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-slate-50 font-semibold rounded-md">
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current mr-2"
                  fill="none"
                  viewBox="0 0 24 24">
                  <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Item Posted in the Shop</span>
            </div>
          </div>
      )}

    {/* EDIT, VIEW, POST, REMOVE ITEM */} 
      {selectedItem && (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 p-2">
        <div className="bg-white rounded-lg  md:w-1/2 h-2/3 w-full ">
          <div className=' bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2 w-full rounded-t-md  '/>
          <div className='text-custom-purple font-semibold iceland-regular text-2xl p-2'>ITEM INFORMATION</div>
          <div className='h-full bg-white w-full p-2 flex gap-2'>
            <div className=' w-4/12 h-auto'>
              <div className='w-full h-[200px] rounded-sm bg-slate-100 shadow-inner shadow-custom-purple mb-2'>
                <img
                    src={selectedItem.photo}
                    alt={`Image of ${selectedItem.name}`}
                    className="h-full w-full object-cover rounded-md"
                />
              </div>
              <div className=' w-auto h-auto p-2 rounded-sm '>
                <div
                  onClick={PostNotify}
                  className='bg-blue-700 p-1 justify-center flex iceland-regular rounded-sm glass 
                  hover:scale-95 duration-300 cursor-pointer mt-2 text-black font-semibold hover:bg-blue-500'>POST</div>
                <div className='bg-green-700 p-1 justify-center flex iceland-regular rounded-sm glass 
                  hover:scale-95 duration-300 cursor-pointer mt-2 text-black font-semibold hover:bg-green-500'>EDIT</div>
                <div className='bg-red-700 p-1 justify-center flex iceland-regular rounded-sm glass 
                  hover:scale-95 duration-300 cursor-pointer mt-2 text-black font-semibold hover:bg-red-500'>REMOVE</div>
                <div
                  onClick={handleCloseModal}
                  className='bg-custom-purple p-1 justify-center flex iceland-regular rounded-sm glass 
                  hover:scale-95 duration-300 cursor-pointer mt-10 md:mt-24 text-black font-semibold hover:bg-primary-color'>CLOSE</div>
              </div>
            </div>
            <div className='bg-slate-900 w-full h-full overflow-hidden relative overflow-y-scroll custom-scrollbar'>
              <div className='h-52 w-full bg-white px-2'>
               
                  <div className='sticky bg-white h-auto z-10 top-0 flex justify-between place-items-center '>
                    <div className='text-2xl text-primary-color  font-bold'>{selectedItem.name}</div>
                  
                  </div>
                  <div className='flex'>
                    <div className='w-1/2'>
                      <div className='mt-2'>
                        <label className='text-sm text-slate-800 font-semibold'>For:</label>
                        <div className='text-sm text-primary-color font-semibold'>{selectedItem.customerType}</div>
                      </div>
                      <div className='mt-2'>
                        <label className='text-sm text-slate-800 font-semibold'>Category:</label>
                        <div className='text-sm text-primary-color font-semibold'>{selectedItem.category}</div>
                      </div>
                      <div className='mt-2'>
                        <label className='text-sm text-slate-800 font-semibold'>Clothing Type:</label>
                        <div className='text-sm text-primary-color font-semibold'>{selectedItem.type}</div>
                      </div>
                    </div>

                    <div className='w-1/2 h-auto relative '>
                      <div className=' mr-2 justify-center right-5 place-items-end'>
                        <div className='place-items-center mr-2'>
                          <div className='text-yellow-500 text-5xl flex place-items-center font-bold text-center'>{selectedItem.rating}
                           <box-icon type='solid' color='#FFB200' size='40px' name='star'></box-icon>
                          </div>
                          <label className='text-sm text-slate-800 font-semibold'>Customers rating</label>
                        </div>

                      </div>
                      <div className='justify-center right-5 place-items-center bottom-0 absolute'>
                        <div className={selectedItem.qty < 11 ? "text-red-500 text-2xl font-bold text-center" : "text-primary-color text-2xl font-bold text-center"}>{selectedItem.qty}</div>
                        <label className='text-sm text-slate-800 font-semibold'>Quantity</label>  
                      </div>
                    </div>
                  </div>
                 
                
                
              </div>
              <div className='h-52 w-full bg-slate-200'> </div>
              <div className='h-52 w-full bg-slate-500'> </div>
            </div>
          </div>
        </div>
      </div>
      )}


      </div>
      );
    }



  export default Products;
