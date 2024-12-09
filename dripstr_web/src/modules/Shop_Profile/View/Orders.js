import React from 'react';
import SideBar from '../Component/Sidebars'
import '../Component/Style.css';
import logo from '../../../assets/shop/logoBlack.png';
import sample1 from '../../../assets/images/samples/5.png'

const { useState } = React;


function Orders() { 
  const [activeTab, setActiveTab] = useState('new-orders');
  const [isModalOpen, setIsModalOpen] = useState(false);    
  const [isModalOpen2, setIsModalOpen2] = useState(false); 
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [isModalOpen4, setIsModalOpen4] = useState(false);
  const [isModalOpen5, setIsModalOpen5] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };
    const handlePrepare = () => {
        setIsModalOpen2(true);
    };
    const handleDeliver = () => {
        setIsModalOpen3(true);
    };
    const handleCancelled= () => {
        setIsModalOpen4(true);
    };
    const handleCompleted= () => {
        setIsModalOpen5(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsModalOpen2(false);
        setIsModalOpen3(false);
        setIsModalOpen4(false);
        setIsModalOpen5(false);
    };

  const Name = 'Jane Doe';
  const Address = '54 Barangay Bagong Silangyatas, Quezon City ';
  const Phone = '09295374051';



  return (

    
  <div className="h-full w-full overflow-y-scroll bg-slate-300 custom-scrollbar p-2 ">
      <div className="absolute mx-3 right-0 z-10">
        <SideBar />
      </div>
    <div className=' text-2xl md:text-3xl text-custom-purple font-bold md:px-56 p-4'> SHOP ORDERS </div>
    <div className='w-full h-5/6  place-items-center '>
      <div className='w-full md:w-3/4 rounded-md shadow-md mb-20 md:mb-0 lg:w-2/3 h-full bg-slate-100 p-2'>
      <div className="w-full h-[470px] bg-slate-200 rounded-sm">
                    <div className="w-full pt-2 glass bg-custom-purple rounded-t-md">
                        <ul className="flex justify-around place-items-center  text-slate-300 cursor-pointer">
                            <li  className={activeTab === 'new-orders' ? 'active-tab' : ''} onClick={() => setActiveTab('new-orders')}><span className='text-sm md:text-lg'>New Orders</span></li>
                            <li className={activeTab === 'preparing' ? 'active-tab' : ''} onClick={() => setActiveTab('preparing')}><span className='text-sm md:text-lg'>Preparing</span></li>
                            <li className={activeTab === 'to-deliver' ? 'active-tab' : ''} onClick={() => setActiveTab('to-deliver')}><span className='text-sm md:text-lg'>To Deliver</span></li>
                            <li className={activeTab === 'cancelled' ? 'active-tab' : ''} onClick={() => setActiveTab('cancelled')}><span className='text-sm md:text-lg'>Cancelled</span></li>
                            <li className={activeTab === 'completed' ? 'active-tab' : ''} onClick={() => setActiveTab('completed')}><span className='text-sm md:text-lg'>Completed</span></li>
                        </ul>
                    </div>
                    <div className="w-full h-full custom-scrollbar bg-slate-200 p-4 overflow-y-scroll">
                        {activeTab === 'new-orders' && (
                            <div>
                                <h2 className="text-xl text-custom-purple font-bold mb-4">New Orders</h2>
                                <div className=' flex font-semibold justify-between px-2 text-slate-800'>
                                    <li className='list-none'>Order Id</li> 
                                    <li className='list-none'>Name</li> 
                                    <li className='list-none pr-4'>Action</li> 
                                </div>
                                <div className='p-2 text-slate-900 h-12 shadow-sm w-full bg-slate-100 flex justify-between gap-2'>
                                    <div className='h-full w-20 place-items-center justify-center flex'> 10 </div>
                                    <div className='h-full w-full place-items-center flex justify-center '> Viscount Black </div>
                                    <div
                                    onClick={handleOpenModal}
                                    className=' h-full w-24 bg-slate-500 place-content-center items-center rounded-md font-semibold
                                    hover:text-white hover:bg-custom-purple glass duration-300 cursor-pointer hover:scale-95 flex '>View</div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'preparing' && (
                            <div>
                                <h2 className="text-xl text-custom-purple font-bold mb-4">Prepare Order</h2>
                                <div className=' flex font-semibold justify-between px-2 text-slate-800'>
                                    <li className='list-none'>Order Id</li> 
                                    <li className='list-none'>Name</li> 
                                    <li className='list-none pr-4'>Action</li> 
                                </div>
                                <div className='p-2 text-slate-900 h-12 shadow-sm w-full bg-slate-100 flex justify-between gap-2'>
                                    <div className='h-full w-20 place-items-center justify-center flex'> 10 </div>
                                    <div className='h-full w-full place-items-center flex justify-center '> Viscount Black </div>
                                    <div
                                    onClick={handlePrepare}
                                    className=' h-full w-24 bg-slate-500 place-content-center items-center rounded-md font-semibold
                                    hover:text-white hover:bg-custom-purple glass duration-300 cursor-pointer hover:scale-95 flex '>View</div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'to-deliver' && (
                            <div>
                                <h2 className="text-xl text-custom-purple font-bold mb-4">To Deliver</h2>
                                <div className=' flex font-semibold justify-between px-2 text-slate-800'>
                                    <li className='list-none'>Order Id</li> 
                                    <li className='list-none'>Name</li> 
                                    <li className='list-none pr-4'>Action</li> 
                                </div>
                                <div className='p-2 text-slate-900 h-12 shadow-sm w-full bg-slate-100 flex justify-between gap-2'>
                                    <div className='h-full w-20 place-items-center justify-center flex'> 10 </div>
                                    <div className='h-full w-full place-items-center flex justify-center '> Viscount Black </div>
                                    <div
                                    onClick={handleDeliver}
                                    className=' h-full w-24 bg-slate-500 place-content-center items-center rounded-md font-semibold
                                    hover:text-white hover:bg-custom-purple glass duration-300 cursor-pointer hover:scale-95 flex '>View</div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'cancelled' && (
                            <div>
                                <h2 className="text-xl text-custom-purple font-bold mb-4">Cancelled Orders</h2>
                                <div className=' flex font-semibold justify-between px-2 text-slate-800'>
                                    <li className='list-none'>Order Id</li> 
                                    <li className='list-none'>Name</li> 
                                    <li className='list-none pr-4'>Action</li> 
                                </div>
                                <div className='p-2 text-slate-900 h-12 shadow-sm w-full bg-red-500 flex justify-between gap-2'>
                                    <div className='h-full w-20 place-items-center justify-center flex'> 10 </div>
                                    <div className='h-full w-full place-items-center flex justify-center '> Viscount Black </div>
                                    <div
                                    onClick={handleCancelled}
                                    className=' h-full w-24 bg-slate-500 place-content-center items-center rounded-md font-semibold
                                    hover:text-white hover:bg-custom-purple glass duration-300 cursor-pointer hover:scale-95 flex '>View</div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'completed' && (
                            <div>
                                <h2 className="text-xl text-custom-purple font-bold mb-4">Completed Orders</h2>
                                <div className=' flex font-semibold justify-between px-2 text-slate-800'>
                                    <li className='list-none'>Order Id</li> 
                                    <li className='list-none'>Name</li> 
                                    <li className='list-none pr-4'>Action</li> 
                                </div>
                                <div className='p-2 text-slate-900 h-12 shadow-sm w-full bg-green-500 flex justify-between gap-2'>
                                    <div className='h-full w-20 place-items-center justify-center flex'> 10 </div>
                                    <div className='h-full w-full place-items-center flex justify-center '> Viscount Black </div>
                                    <div
                                    onClick={handleCompleted}
                                    className=' h-full w-24 bg-slate-500 place-content-center items-center rounded-md font-semibold
                                    hover:text-white hover:bg-custom-purple glass duration-300 cursor-pointer hover:scale-95 flex '>View</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
      </div>
    </div>  
    
   {/* TO PAY */} 
   {isModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 ">
      <div className="bg-white rounded-lg p-5 w-full md:w-1/2 lg:w-1/2 m-2 md:m-0 auto">
        <h2 className="font-medium text-slate-800 py-2  "><span className='font-bold text-[20px] md:text-2xl'>Order Information</span></h2>
        <div className='h-auto w-full bg-slate-200 relative rounded-md shadow-sm mb-2 p-2 md:flex gap-2'>
        <div className='z-0 h-20 w-20 blur-sm justify-end bottom-0 right-0 absolute'>
            <img
              src={logo}
              alt="Shop Logo"
              className="drop-shadow-custom h-full w-full object-cover rounded-md"
              sizes="100%"
            />
        </div>
            <div className='w-1/3 h-full bg-slate-100'>
            <img
              src={sample1}
              alt="Shop Logo"
              className="drop-shadow-custom h-full w-full object-cover rounded-md"
              sizes="100%"
            />
            </div> 
            <div className='w-full md:w-2/3 h-auto  p-2 relative '>
                <div className=' flex w-full  justify-between place-items-center '>
                    <div className=' text-lg md:text-3xl font-bold text-slate-950  '>Viscount Black</div>
                    <div className=' text-xl font-semibold text-slate-950  '>ID: 10</div>
                </div>
                

                <a className='text-sm text-custom-purple font-semibold '>Name: <span className='text-slate-900'> {Name} </span> </a>  <br/>
                <a className='text-sm text-custom-purple font-semibold '>Address: <span className='text-slate-900'> {Address} </span> </a>   <br/>  
                <a className='text-sm text-custom-purple font-semibold '>Phone number: <span className='text-slate-900'> {Phone} </span> </a>  
                 
                <div className='text-custom-purple text-sm font-semibold'>Variant: <span className='text-sm text-slate-800'> Blue </span></div>          
                <div className='text-custom-purple text-sm font-semibold'>Size: <span className='text-sm text-slate-800'> XL </span></div>           
                <div className='text-custom-purple text-sm font-semibold'>Vouchers: <span className='text-sm text-slate-800'> 20% off </span></div>     
                <div className='text-custom-purple text-sm font-semibold'>Item Price: <span className='text-sm text-slate-800'> ₱140 </span></div>        
                <div className='text-custom-purple text-sm font-semibold'>Delivery fee: <span className='text-sm text-slate-800'> ₱30 </span></div>
                
                
                <div className='text-xl font-semibold right-2  text-slate-900 bottom-0 absolute'>PRICE: <span className='text-yellow-600 text-3xl'> ₱150</span>  </div> 
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
            Prepare
          </button>
        </div>
      </div>
    </div>
    )}
    {/* TO DELIVER */} 
    {isModalOpen2 && (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 ">
      <div className="bg-white rounded-lg p-5 w-full md:w-1/2 lg:w-1/2 m-2 md:m-0 auto">
        <h2 className="font-medium text-slate-800 py-2  "><span className='font-bold text-[20px] md:text-2xl'>Order Information</span></h2>
        <div className='h-auto w-full bg-slate-200 relative rounded-md shadow-sm mb-2 p-2 md:flex gap-2'>
        <div className='z-0 h-20 w-20 blur-sm justify-end bottom-0 right-0 absolute'>
            <img
              src={logo}
              alt="Shop Logo"
              className="drop-shadow-custom h-full w-full object-cover rounded-md"
              sizes="100%"
            />
        </div>
            <div className='w-1/3 h-full bg-slate-100'>
            <img
              src={sample1}
              alt="Shop Logo"
              className="drop-shadow-custom h-full w-full object-cover rounded-md"
              sizes="100%"
            />
            </div> 
            <div className='w-full md:w-2/3 h-auto  p-2 relative '>
                <div className=' flex w-full  justify-between place-items-center '>
                    <div className=' text-lg md:text-3xl font-bold text-slate-950  '>Viscount Black</div>
                    <div className=' text-xl font-semibold text-slate-950  '>ID: 10</div>
                </div>
                

                <a className='text-sm text-custom-purple font-semibold '>Name: <span className='text-slate-900'> {Name} </span> </a>  <br/>
                <a className='text-sm text-custom-purple font-semibold '>Address: <span className='text-slate-900'> {Address} </span> </a>   <br/>  
                <a className='text-sm text-custom-purple font-semibold '>Phone number: <span className='text-slate-900'> {Phone} </span> </a>  
                 
                <div className='text-custom-purple text-sm font-semibold'>Variant: <span className='text-sm text-slate-800'> Blue </span></div>          
                <div className='text-custom-purple text-sm font-semibold'>Size: <span className='text-sm text-slate-800'> XL </span></div>           
                <div className='text-custom-purple text-sm font-semibold'>Vouchers: <span className='text-sm text-slate-800'> 20% off </span></div>     
                <div className='text-custom-purple text-sm font-semibold'>Item Price: <span className='text-sm text-slate-800'> ₱140 </span></div>        
                <div className='text-custom-purple text-sm font-semibold'>Delivery fee: <span className='text-sm text-slate-800'> ₱30 </span></div>
                <div className='text-custom-purple text-sm font-semibold'>Changed mind Reason: <span className='text-sm text-slate-800'> Mistakenly order </span></div>
                
                <div className='text-xl font-semibold right-2  text-slate-900 bottom-0 absolute'>PRICE: <span className='text-yellow-600 text-3xl'> ₱150</span>  </div> 
            </div>    
        </div>
        <div className='flex justify-between w-full'>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={handleCloseModal}
          >
            Close
          </button>
          <div className=' flex gap-2 md:gap-4'>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleCloseModal}
            >
              Cancel Order
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
              onClick={handleCloseModal}
            >
              SHIP
            </button>
          </div>  
        </div>
      </div>
    </div>
    )}
    {/* OTW */} 
    {isModalOpen3 && (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 ">
      <div className="bg-white rounded-lg p-5 w-full md:w-1/2 lg:w-1/2 m-2 md:m-0 auto">
        <h2 className="font-medium text-slate-800 py-2  "><span className='font-bold text-[20px] md:text-2xl'>Order Information</span></h2>
        <div className='h-auto w-full bg-slate-200 relative rounded-md shadow-sm mb-2 p-2 md:flex gap-2'>
        <div className='z-0 h-20 w-20 blur-sm justify-end bottom-0 right-0 absolute'>
            <img
              src={logo}
              alt="Shop Logo"
              className="drop-shadow-custom h-full w-full object-cover rounded-md"
              sizes="100%"
            />
        </div>
            <div className='w-1/3 h-full bg-slate-100'>
            <img
              src={sample1}
              alt="Shop Logo"
              className="drop-shadow-custom h-full w-full object-cover rounded-md"
              sizes="100%"
            />
            </div> 
            <div className='w-full md:w-2/3 h-auto  p-2 relative '>
                <div className=' flex w-full  justify-between place-items-center '>
                    <div className=' text-lg md:text-3xl font-bold text-slate-950  '>Viscount Black</div>
                    <div className=' text-xl font-semibold text-slate-950  '>ID: 10</div>
                </div>
                

                <a className='text-sm text-custom-purple font-semibold '>Name: <span className='text-slate-900'> {Name} </span> </a>  <br/>
                <a className='text-sm text-custom-purple font-semibold '>Address: <span className='text-slate-900'> {Address} </span> </a>   <br/>  
                <a className='text-sm text-custom-purple font-semibold '>Phone number: <span className='text-slate-900'> {Phone} </span> </a>  
                 
                <div className='text-custom-purple text-sm font-semibold'>Variant: <span className='text-sm text-slate-800'> Blue </span></div>          
                <div className='text-custom-purple text-sm font-semibold'>Size: <span className='text-sm text-slate-800'> XL </span></div>           
                <div className='text-custom-purple text-sm font-semibold'>Vouchers: <span className='text-sm text-slate-800'> 20% off </span></div>     
                <div className='text-custom-purple text-sm font-semibold'>Item Price: <span className='text-sm text-slate-800'> ₱140 </span></div>        
                <div className='text-custom-purple text-sm font-semibold'>Delivery fee: <span className='text-sm text-slate-800'> ₱30 </span></div>
                <div className='text-custom-purple text-sm font-semibold'>Status: <span className='text-sm text-slate-800'> In Transit </span></div>
                
                
                <div className='text-xl font-semibold right-2  text-slate-900 bottom-0 absolute'>PRICE: <span className='text-yellow-600 text-3xl'> ₱150</span>  </div> 
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
            className="bg-green-500 cursor-not-allowed text-white px-4 py-2 rounded hover:bg-green-700"
            
          >
            Completed
          </button>
        </div>
      </div>
    </div>
    )}
    {/* CANCELLED */} 
    {isModalOpen4 && (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 ">
      <div className="bg-white rounded-lg p-5 w-full md:w-1/2 lg:w-1/2 m-2 md:m-0 auto">
        <h2 className="font-medium text-slate-800 py-2  "><span className='font-bold text-[20px] md:text-2xl'>Order Cancelled</span></h2>
        <div className='h-auto w-full bg-slate-200 relative rounded-md shadow-sm mb-2 p-2 md:flex gap-2'>
        <div className='z-0 h-20 w-20 blur-sm justify-end bottom-0 right-0 absolute'>
            <img
              src={logo}
              alt="Shop Logo"
              className="drop-shadow-custom h-full w-full object-cover rounded-md"
              sizes="100%"
            />
        </div>
            <div className='w-1/3 h-full bg-slate-100'>
            <img
              src={sample1}
              alt="Shop Logo"
              className="drop-shadow-custom h-full w-full object-cover rounded-md"
              sizes="100%"
            />
            </div> 
            <div className='w-full md:w-2/3 h-auto  p-2 relative '>
                <div className=' flex w-full  justify-between place-items-center '>
                    <div className=' text-lg md:text-3xl font-bold text-slate-950  '>Viscount Black</div>
                    <div className=' text-xl font-semibold text-slate-950  '>ID: 10</div>
                </div>
                

                <a className='text-sm text-custom-purple font-semibold '>Name: <span className='text-slate-900'> {Name} </span> </a>  <br/>
                <a className='text-sm text-custom-purple font-semibold '>Address: <span className='text-slate-900'> {Address} </span> </a>   <br/>  
                <a className='text-sm text-custom-purple font-semibold '>Phone number: <span className='text-slate-900'> {Phone} </span> </a>  
                 
                <div className='text-custom-purple text-sm font-semibold'>Variant: <span className='text-sm text-slate-800'> Blue </span></div>          
                <div className='text-custom-purple text-sm font-semibold'>Size: <span className='text-sm text-slate-800'> XL </span></div>           
                <div className='text-custom-purple text-sm font-semibold'>Vouchers: <span className='text-sm text-slate-800'> 20% off </span></div>     
                <div className='text-custom-purple text-sm font-semibold'>Item Price: <span className='text-sm text-slate-800'> ₱140 </span></div>        
                <div className='text-custom-purple text-sm font-semibold'>Delivery fee: <span className='text-sm text-slate-800'> ₱30 </span></div>
                
                
                <div className='text-xl font-semibold right-2  text-slate-900 bottom-0 absolute'>PRICE: <span className='text-yellow-600 text-3xl'> ₱150</span>  </div> 
            </div>    
        </div>
        <div className='flex justify-between w-full'>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={handleCloseModal}
          >
            Close
          </button>

        </div>
      </div>
    </div>
    )}
    {/* COMPLETED */} 
    {isModalOpen5 && (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 ">
      <div className="bg-white rounded-lg p-5 w-full md:w-1/2 lg:w-1/2 m-2 md:m-0 auto">
        <h2 className="font-medium text-slate-800 py-2  "><span className='font-bold text-[20px] md:text-2xl'>Order Completed</span></h2>
        <div className='h-auto w-full bg-slate-200 relative rounded-md shadow-sm mb-2 p-2 md:flex gap-2'>
        <div className='z-0 h-20 w-20 blur-sm justify-end bottom-0 right-0 absolute'>
            <img
              src={logo}
              alt="Shop Logo"
              className="drop-shadow-custom h-full w-full object-cover rounded-md"
              sizes="100%"
            />
        </div>
            <div className='w-1/3 h-full bg-slate-100'>
            <img
              src={sample1}
              alt="Shop Logo"
              className="drop-shadow-custom h-full w-full object-cover rounded-md"
              sizes="100%"
            />
            </div> 
            <div className='w-full md:w-2/3 h-auto  p-2 relative '>
                <div className=' flex w-full  justify-between place-items-center '>
                    <div className=' text-lg md:text-3xl font-bold text-slate-950  '>Viscount Black</div>
                    <div className=' text-xl font-semibold text-slate-950  '>ID: 10</div>
                </div>
                

                <a className='text-sm text-custom-purple font-semibold '>Name: <span className='text-slate-900'> {Name} </span> </a>  <br/>
                <a className='text-sm text-custom-purple font-semibold '>Address: <span className='text-slate-900'> {Address} </span> </a>   <br/>  
                <a className='text-sm text-custom-purple font-semibold '>Phone number: <span className='text-slate-900'> {Phone} </span> </a>  
                 
                <div className='text-custom-purple text-sm font-semibold'>Variant: <span className='text-sm text-slate-800'> Blue </span></div>          
                <div className='text-custom-purple text-sm font-semibold'>Size: <span className='text-sm text-slate-800'> XL </span></div>           
                <div className='text-custom-purple text-sm font-semibold'>Vouchers: <span className='text-sm text-slate-800'> 20% off </span></div>     
                <div className='text-custom-purple text-sm font-semibold'>Item Price: <span className='text-sm text-slate-800'> ₱140 </span></div>        
                <div className='text-custom-purple text-sm font-semibold'>Delivery fee: <span className='text-sm text-slate-800'> ₱30 </span></div>
                
                
                <div className='text-xl font-semibold right-2  text-slate-900 bottom-0 absolute'>PRICE: <span className='text-yellow-600 text-3xl'> ₱150</span>  </div> 
            </div>    
        </div>
        <div className='flex justify-between w-full'>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
            onClick={handleCloseModal}
          >
            Close
          </button>

        </div>
      </div>
    </div>
    )}
  </div>

  
  );
}



export default Orders;
