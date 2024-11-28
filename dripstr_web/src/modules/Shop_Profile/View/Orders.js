import React from 'react';
import SideBar from '../Component/Sidebars'
import '../Component/Style.css';
const { useState } = React;


function Orders() { 
  const [activeTab, setActiveTab] = useState('new-orders');

  <style>{` active-tab { color: red; } `}</style>

  return (

    
  <div className="h-full w-full overflow-y-scroll bg-slate-300 custom-scrollbar p-2 ">
      <div className="absolute mx-3 right-0 z-10">
        <SideBar />
      </div>
    <div className='text-3xl text-custom-purple font-bold md:px-56 p-4'> SHOP ORDERS </div>
    <div className='w-full h-5/6  place-items-center '>
      <div className='w-full md:w-3/4 rounded-md shadow-md mb-20 md:mb-0 lg:w-2/3 h-full bg-slate-100 p-2'>
      <div className="w-full h-full bg-slate-200 rounded-sm">
                    <div className="w-full p-2 bg-custom-purple rounded-t-md">
                        <ul className="flex justify-around place-items-center  text-slate-300 cursor-pointer">
                            <li  className={activeTab === 'new-orders' ? 'active-tab' : ''} onClick={() => setActiveTab('new-orders')}>New Orders</li>
                            <li className={activeTab === 'preparing' ? 'active-tab' : ''} onClick={() => setActiveTab('preparing')}>Preparing</li>
                            <li className={activeTab === 'to-deliver' ? 'active-tab' : ''} onClick={() => setActiveTab('to-deliver')}>To Deliver</li>
                            <li className={activeTab === 'cancelled' ? 'active-tab' : ''} onClick={() => setActiveTab('cancelled')}>Cancelled</li>
                        </ul>
                    </div>
                    <div className="w-full h-[470px] custom-scrollbar bg-slate-200 p-4 overflow-y-scroll">
                        {activeTab === 'new-orders' && (
                            <div>
                                <h2 className="text-xl text-custom-purple font-bold mb-4">New Orders</h2>
                                <ul>
                                    <li className="mb-2 p-2 bg-white rounded shadow">Order #1: 2x Burger, 1x Fries</li>
                                    <li className="mb-2 p-2 bg-white rounded shadow">Order #2: 1x Pizza, 2x Soda</li>
                                    <li className="mb-2 p-2 bg-white rounded shadow">Order #3: 3x Tacos, 1x Nachos</li>
                                    <li className="mb-2 p-2 bg-white rounded shadow">Order #3: 3x Tacos, 1x Nachos</li>
                                    <li className="mb-2 p-2 bg-white rounded shadow">Order #3: 3x Tacos, 1x Nachos</li>
                                    <li className="mb-2 p-2 bg-white rounded shadow">Order #3: 3x Tacos, 1x Nachos</li>
                                    <li className="mb-2 p-2 bg-white rounded shadow">Order #3: 3x Tacos, 1x Nachos</li>
                                    <li className="mb-2 p-2 bg-white rounded shadow">Order #3: 3x Tacos, 1x Nachos</li>
                                    <li className="mb-2 p-2 bg-white rounded shadow">Order #3: 3x Tacos, 1x Nachos</li>
                                    <li className="mb-2 p-2 bg-white rounded shadow">Order #3: 3x Tacos, 1x Nachos</li>
                                    <li className="mb-2 p-2 bg-white rounded shadow">Order #3: 3x Tacos, 1x Nachos</li>
                                    <li className="mb-2 p-2 bg-white rounded shadow">Order #3: 3x Tacos, 1x Nachos</li>
                                    <li className="mb-2 p-2 bg-white rounded shadow">Order #3: 3x Tacos, 1x Nachos</li>
                                    <li className="mb-2 p-2 bg-white rounded shadow">Order #3: 3x Tacos, 1x Nachos</li>
                                    <li className="mb-2 p-2 bg-white rounded shadow">Order #3: 3x Tacos, 1x Nachos</li>

                                </ul>
                            </div>
                        )}
                        {activeTab === 'preparing' && (
                            <div>
                                <h2 className="text-xl text-custom-purple font-bold mb-4">Preparing</h2>
                                <ul>
                                    <li className="mb-2 p-2 bg-white rounded shadow">Order #4: 1x Salad, 1x Soup</li>
                                    <li className="mb-2 p-2 bg-white rounded shadow">Order #5: 2x Sandwich, 1x Coffee</li>
                                </ul>
                            </div>
                        )}
                        {activeTab === 'to-deliver' && (
                            <div>
                                <h2 className="text-xl text-custom-purple font-bold mb-4">To Deliver</h2>
                                <ul>
                                    <li className="mb-2 p-2 bg-white rounded shadow">Order #6: 1x Pasta, 1x Garlic Bread</li>
                                    <li className="mb-2 p-2 bg-white rounded shadow">Order #7: 1x Sushi, 1x Miso Soup</li>
                                </ul>
                            </div>
                        )}
                        {activeTab === 'cancelled' && (
                            <div>
                                <h2 className="text-xl text-custom-purple font-bold mb-4">Cancelled</h2>
                                <ul>
                                    <li className="mb-2 p-2 bg-white rounded shadow">Order #8: 1x Steak, 1x Mashed Potatoes</li>
                                    <li className="mb-2 p-2 bg-white rounded shadow">Order #9: 1x Fish & Chips, 1x Lemonade</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
      </div>
    </div>  
  </div>
  );
}



export default Orders;
