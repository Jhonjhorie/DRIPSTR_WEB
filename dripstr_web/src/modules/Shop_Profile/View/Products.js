  import React from 'react';
  import SideBar from '../Component/Sidebars'
  import sample1 from '../../../assets/images/samples/5.png'
  import sampleads from '../../../assets/shop/s2.jpg'
  import { blockInvalidChar } from "../Hooks/ValidNumberInput";
  const { useState } = React;
 

  function Products() { 
    const [activeTabs, setActiveTab] = useState('manage-products');
    const [isModalOpen1, setIsModalOpen] = useState(false); 
    const [textInputs, setTextInputs] = useState([]);
    const [imageInputs, setImageInputs] = useState([]);
    const handleAddItem = () => {
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    const addTextInput = () => {
      setTextInputs([...textInputs, '']);
    };

    const addImageInput = () => {
        setImageInputs([...imageInputs, '']);
    };

    const deleteTextInput = (index) => {
        const newInputs = textInputs.filter((_, i) => i !== index);
        setTextInputs(newInputs);
    };

    const deleteImageInput = (index) => {
        const newInputs = imageInputs.filter((_, i) => i !== index);
        setImageInputs(newInputs);
    };
    
    const [Total, setNumber] = useState('');
    const Totaldigit = (e) => {
      let value = e.target.value;
      value = value.replace(/[^0-9]/g, '').slice(0, 6); 
      setNumber(value);
    };



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
                          <div className='bg-custom-purple text-sm p-1 md:px-2 text-slate-50 cursor-pointer duration-200 hover:scale-95 rounded-sm '>Add photo Ads</div>
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
      {isModalOpen1 && (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 ">
      <div className="bg-white pt-2 rounded-lg p-5 w-full md:w-1/2 lg:w-1/2 m-2 md:m-0 auto">
        <h2 className=" flex justify-between w-full place-items-center   "><span className='font-bold text-[20px] text-slate-800 py-2 md:text-2xl '>ADD ITEM</span> <box-icon type='solid' color='#4D077C' name='customize'></box-icon></h2>
        <div className='bg-slate-200 h-full rounded-md flex gap-1 w-full p-2 md:p-5 mb-2'>
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
            <label className='text-slate-950 font-semibold text-sm mr-2'>Category:</label><br/>
            <select
              id="options"
              className=" bg-slate-100 w-full text-slate-800  border py-1 px-2 rounded-md text-sm"
            >
              <option value="option1" >Complete set</option>
              <option value="option1" >Top wear</option>
              <option value="option2">Bottom wear</option>
              <option value="option3">Undergarment </option>
              <option value="option4">Accessory</option>
              <option value="option5">Gadgets</option>
              <option value="option5">Footwear</option>
              <option value="option5">Others</option>
            </select><br/>
            <label className='text-slate-950 font-semibold text-sm  mt-2'>Add Sizes</label>
            <div className='flex'>
              <div className=' h-40  w-1/2 bg-slate-500'>

              </div>
              <div className=' h-40 w-1/2 bg-slate-900'>
                
              </div>
            </div>
        
          </div>
          <div className='w-1/2 h-full '>

          <div className='flex justify-between place-items-center w-full '>
            <label className='text-slate-950 font-semibold mr-2 text-sm'>Add Variant? </label>
            
              <button 
                  className="bg-custom-purple justify-center hover:bg-slate-600 duration-300 rounded-md  flex text-white p-1 "
                  onClick={addTextInput}
              >
                  <box-icon type='solid' color='#FFFFFF' name='message-square-add'></box-icon>
              </button>
         
          </div>
          
            <div className='bg-slate-100 h-[150px] w-full mt-1 p-1 overflow-hidden overflow-y-scroll shadow-inner shadow-slate-500 rounded-sm  custom-scrollbar '>
             
                <div>
                  {textInputs.map((input, index) => (
                    <div key={index} className="flex items-center mb-2">
                        <input 
                            type="text" 
                            className="border p-2 w-full bg-slate-200 h-9 text-slate-800 text-sm"
                            placeholder={`Text Input ${index + 1}`}
                        />
                        <button 
                            className="ml-2 bg-red-500 text-white h-9 px-2 py-1 rounded"
                            onClick={() => deleteTextInput(index)}
                        >
                            Clear
                        </button>
                    </div>
                  ))}
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
    </div>
    );
  }



  export default Products;
