  import React from 'react';
  import SideBar from '../Component/Sidebars'
  import sample1 from '../../../assets/images/samples/5.png'
  const { useState } = React;

  function Products() { 
    const [activeTabs, setActiveTab] = useState('manage-products');
    
    return (
    <div className="h-full w-full overflow-y-scroll bg-slate-300 px-2 md:px-10 lg:px-20 custom-scrollbar">
      <div className='absolute mx-3 right-0 z-10'>
        <SideBar/>
      </div>
      <div className='w-full h-full bg-slate-300 '>
        <div className=' text-4xl text-custom-purple font-bold p-2 py-3'>Manage Products</div>
        <div className='h-[550px] p-5 w-full overflow-hidden rounded-md shadow-md bg-slate-100'>
          <div className=' w-full flex gap-5 place-items-center justify-between mb-2'>
            <div className='flex gap-2 font-semibold text-slate-400'>
              <div  className={activeTabs === 'manage-products' ? 'active-tabs' : ''} onClick={() => setActiveTab('manage-products')}>
                <span className=' rounded-md hover:scale-95 duration-300 cursor-pointer text-sm md:text-lg bg-custom-purple glass p-3'>Manage Products</span>
              </div>
              <div className={activeTabs === 'manage-adds' ? 'active-tabs' : ''} onClick={() => setActiveTab('manage-adds')}>
                <span className=' rounded-md hover:scale-95 duration-300 cursor-pointer text-sm md:text-lg bg-custom-purple glass p-3'>Manage Ads</span>
              </div>
            </div>
            
            <div className='flex gap-2 text-slate-50 rounded-md hover:scale-95 duration-300 cursor-pointer text-sm md:text-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 glass p-2'>
              Create New Design
              <box-icon type='solid' color='#e2e8f0' name='palette'></box-icon>  
            </div>
            
          </div>
            <div className="w-full h-full custom-scrollbar bg-slate-200 shadow-inner rounded-md p-4 overflow-y-scroll">
              {activeTabs === 'manage-products' && (
                  <div>
                    <div className='flex justify-between'>
                      <h2 className="text-3xl text-custom-purple iceland-regular font-bold mb-4">Manage Products</h2>
                      <div className='flex gap-2 justify-center  place-items-center'>
                          <div className='bg-custom-purple p-1 px-2 text-slate-50 cursor-pointer duration-200 hover:scale-95 rounded-sm '>Add Items</div>
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
                      <h2 className="text-3xl text-custom-purple iceland-regular font-bold mb-4">Manage Shop Advertisement</h2>
                      <div className='flex gap-2 justify-center  place-items-center'>
                          <div className='bg-custom-purple p-1 px-2 text-slate-50 cursor-pointer duration-200 hover:scale-95 rounded-sm '>Add photo Ads</div>
                      </div>
                    </div>

                      <div className=' flex font-semibold justify-between px-2 text-slate-800'>
                          <li className='list-none'>Ads ID</li> 
                          <li className='list-none'>Name</li> 
                          <li className='list-none pr-4'>Action</li> 
                      </div>
                      <div className='p-2 text-slate-900 h-12 shadow-sm w-full bg-slate-100 flex justify-between gap-2'>
                          <div className='h-full w-20 place-items-center justify-center flex'> 10 </div>
                        
                          <div className='h-full w-full place-items-center flex justify-center '> Viscount Black </div>
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
    
    </div>
    );
  }



  export default Products;
