  import React from 'react';
  import SideBar from '../Component/Sidebars'
  import sample1 from '../../../assets/images/samples/5.png'
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
    
    const handleAddItem = () => { //ITEMS
      setIsModalOpenItem(true);
    };
    const handleAddAds = () => { //ADS 
      setIsModalOpenAds(true);
    };
    const handleCloseModal = () => { //Close both
      setIsModalOpenItem(false);
      setIsModalOpenAds(false);
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
        "Jeans Sizes": [ "2T", "3T", "4T", "5T", "6T", "7T", "8", "10", "12", "14", "16", "18"],
        "Shorts Sizes": [ "2T", "3T", "4T", "5T", "6T", "7T", "8", "10", "12", "14", "16", "18"],
        "Skirts Sizes": [ "2T", "3T", "4T", "5T", "6T", "7T", "8", "10", "12", "14", "16", "18"],
        "Trousers Sizes": [ "2T", "3T", "4T", "5T", "6T", "7T", "8", "10", "12", "14", "16", "18"],
        "Leggings Sizes": [ "2T", "3T", "4T", "5T", "6T", "7T", "8", "10", "12", "14", "16", "18"],
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
      setCategory('');
      setClotheType('');
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
      "Aqua", "Olive", "Emerald", "Ivory", "Chartreuse"
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
            <div className='flex md:gap-2 font-semibold text-slate-400'>
              <div  className={activeTabs === 'manage-products' ? 'active-tabs' : ''} onClick={() => setActiveTab('manage-products')}>
                <span className=' rounded-md hover:scale-95 duration-300 cursor-pointer text-sm md:text-lg bg-custom-purple glass md:p-3'>Manage Products</span>
              </div>
              <div className={activeTabs === 'manage-adds' ? 'active-tabs' : ''} onClick={() => setActiveTab('manage-adds')}>
                <span className=' rounded-md hover:scale-95 duration-300 cursor-pointer text-sm md:text-lg bg-custom-purple glass md:p-3'>Manage Ads</span>
              </div>
            </div>
            
            <div className='flex  md:gap-2 text-slate-50 rounded-md hover:scale-95 duration-300 cursor-pointer text-sm md:text-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 glass p-2'>
              Create New Design
              <box-icon type='solid' color='#e2e8f0' name='palette'></box-icon>  
            </div>
            
          </div>
            <div className="w-full h-full custom-scrollbar bg-slate-200 shadow-inner rounded-md p-4 overflow-y-scroll">
              {activeTabs === 'manage-products' && (
                  <div>
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
                      
                      <div className=' flex font-semibold justify-between px-2 text-slate-800'>
                          <li className='list-none'>Item ID / Photo</li> 
                          <li className='list-none'>Name</li> 
                          <li className='list-none pr-4'>Action</li> 
                      </div>
                      <div className='p-2 text-slate-900 h-16 shadow-sm w-full bg-slate-100 flex justify-between gap-2'>
                          <div className='h-full w-20 place-items-center justify-center flex'> 10 </div>
                          <div className='h-full w-14 rounded-sm bg-slate-200'>
                          <img
                            src={sample1}
                            alt="Shop Logo"
                            className="drop-shadow-custom h-full w-full object-cover rounded-md"
                            sizes="100%"
                          />
                          </div>
                          <div className='h-full w-full place-items-center flex justify-center '> Viscount Black </div>
                          <div
                      
                          className=' h-full w-24 bg-slate-500 place-content-center items-center rounded-md font-semibold
                          hover:text-white hover:bg-custom-purple glass duration-300 cursor-pointer hover:scale-95 flex '>View</div>
                      </div>

                      
                      
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
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 ">
      <div className="bg-white pt-2 rounded-lg p-5 w-full md:w-1/2 lg:w-3/4 m-2 md:m-0">
        <h2 className=" flex justify-between w-full place-items-center   "><span className='font-bold text-[20px] text-slate-800 py-2 md:text-2xl '>ADD ITEM</span> <box-icon type='solid' color='#4D077C' name='customize'></box-icon></h2>
        <div className='bg-slate-200 h-full rounded-md flex gap-1 w-full p-2 md:px-5 mb-2'>
          <div className='w-1/2 h-auto p-1 pr-5 '> 
            <label className='text-slate-950  font-semibold mr-2 text-sm'>Item Name:</label><br/>
            <input type='text' className=' bg-slate-50 p-1 rounded-sm  mt-2 text-slate-800 w-full' placeholder='Item Name '></input> <br/>
            <label className='text-slate-950 font-semibold text-sm mr-2 '>Total:</label><br/>
            <input
              type="number"
              value={Total}
              onChange={Totaldigit}
              onKeyDown={blockInvalidChar}
              className=' bg-slate-50 p-1 rounded-sm text-slate-800 mt-1 w-full' 
              placeholder='Item Name '>
            </input> <br/>
            {/* customer type */}
            <label className='text-slate-950 font-semibold text-sm mr-2'>Customer Type:</label><br/>
              <select
                  id="customerType"
                  value={customerType}
                  onChange={handleCustomerTypeChange}
                  className="bg-slate-100 w-full text-slate-800 border py-1 px-2 rounded-md text-sm"
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
                        className="bg-slate-100 w-full text-slate-800 border py-1 px-2 rounded-md text-sm"
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
                                className="bg-slate-100 w-full text-slate-800 border py-1 px-2 rounded-md text-sm"
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
          <div className=' w-1/4 h-full py-1'>
          <div className=' flex gap-2 place-items-center justify-between '>
            <label className='text-slate-950 font-semibold text-sm '>Add Sizes?</label> 
            <div className="tooltip tooltip-bottom " data-tip=" The sizes that we use is US based, for better sizing instruction our team highly recommend to upload an image sizing for better customers understanding.">
                <button className="hover:bg-slate-600 glass bg-custom-purple duration-300 shadow-md place-items-center flex rounded-full">
                  <box-icon color='#FFFFFF' name='info-circle'></box-icon>
                </button>
            </div>
          </div>
          
          <div className='h-[340px] mt-2 w-full bg-slate-100 overflow-hidden overflow-y-scroll shadow-sm shadow-slate-500 rounded-sm custom-scrollbar'>
            {clotheType && sizes[customerType] && sizes[customerType][clotheType] ? (
              sizes[customerType][clotheType].map((size, index) => (
                <div key={index} className="p-2">
                  <input type="checkbox" id={`size-${size}`} name="sizes" value={size} className="mr-2" />
                  <label htmlFor={`size-${size}`} className="text-slate-800 text-sm">{size}</label>
                </div>
              ))
            ) : (
              <p className="text-slate-800 text-c text-sm p-2">No sizes available for the selected options.</p>
            )}
          </div>
          
            
          </div>
          <div className='w-1/2 h-full '>

          <div className='flex justify-between place-items-center w-full '>
            <label className='text-slate-950 font-semibold mr-2 mt-1.5 text-sm'>Add Variant? </label>
          
          </div>
          
            <div className='bg-slate-100 h-[150px] w-full mt-2.5 p-1 overflow-hidden overflow-y-scroll shadow-inner shadow-slate-500 rounded-sm  custom-scrollbar '>
             
                <div>
                <div className="grid grid-cols-2 gap-4">
                        {colors.map((color, index) => (
                            <div key={index} className="flex items-center">
                                <input type="checkbox" id={color} name={color} className="mr-2"/>
                                <label htmlFor={color} className="text-gray-700">{color}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className='flex justify-between place-items-center w-full  mt-1 '>
            <label className='text-slate-950 font-semibold mr-2 text-sm'>Add Image? </label>
            
              <button 
                  className="bg-custom-purple justify-center flex text-white p-1 hover:bg-slate-600 duration-300 rounded-md "
                  onClick={addImageInput}
              >
                 <box-icon type='solid' color='#FFFFFF' name='folder-plus'></box-icon>
              </button>
         
            </div>
            <div className='bg-slate-100 h-[150px] w-full mt-1 p-1 overflow-hidden overflow-y-scroll shadow-inner shadow-slate-500 rounded-sm  custom-scrollbar '>
             
                <div>
                {imageInputs.map((input, index) => (
                  <div key={index} className="flex items-center mb-2">
                      <input 
                          type="file" 
                          accept="image/*"
                          className="border p-2 w-full bg-slate-200 h-9 text-slate-800 text-sm"
                          
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
        <div className="bg-white rounded-lg p-5 w-full md:w-1/2 lg:w-1/2 m-2 md:m-0 auto">
          <div className="font-medium text-slate-800 py-2 w-full flex justify-between place-items-center  ">
            <span className='font-bold text-[20px] md:text-2xl'>Add Shop Advertisement Photo</span>
            <box-icon name='images' color='#4D077C'></box-icon>
          </div>
          <div className='h-auto w-full bg-slate-200  rounded-md shadow-sm mb-2 p-2 md:flex gap-2'>
            <div>
              <label className=' text-slate-800  text-sm font-semibold' >Name:</label> <br/>
              <input type='text' className='bg-slate-50 p-1 rounded-sm  mt-1 text-slate-800 w-full' placeholder='Type Ads Name' ></input>
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
              Completed
            </button>
          </div>
        </div>
      </div>
      )}

    </div>
    );
  }



  export default Products;
