import React from 'react';
import SideBar from '../Component/Sidebars'
import { useNavigate } from 'react-router-dom';
import blackLogo from '../../../assets/logoWhite.png'
import { blockInvalidChar } from "../Hooks/ValidNumberInput";


const { useState } = React;

function Vouchers() { 
    const navigate = useNavigate();
    const [selectedVouchers, setSelectedVouchers] = useState([]);
    const [showModal, setShowModal] = useState(false);


    const VouchersData = [
        { id: 1, off: 10, minSpend: 500 },
        { id: 2, off: 15, minSpend: 1000 },
        { id: 3, off: 20, minSpend: 1500 },
        { id: 4, off: 25, minSpend: 2000 },
        { id: 5, off: 30, minSpend: 2500 },
        { id: 6, off: 35, minSpend: 3000 },
        { id: 7, off: 40, minSpend: 3500 },
        { id: 8, off: 45, minSpend: 4000 },
        { id: 9, off: 50, minSpend: 4500 },
        { id: 10, off: 55, minSpend: 5000 },
        { id: 11, off: 60, minSpend: 5500 },
        { id: 12, off: 65, minSpend: 6000 },
    ];

    const handleCheckboxChange = (voucher) => {
        setSelectedVouchers((prevSelected) =>
            prevSelected.includes(voucher)
                ? prevSelected.filter((v) => v !== voucher)
                : [...prevSelected, voucher]
        );
    };

    const handleSendToFollowers = () => {
        setShowModal(true);
    };
    const closeModal = () => {
        setSelectedVouchers([]);
        setShowModal(false)
    }
    
  return (
  <div className="h-full w-full overflow-y-scroll px-16 bg-slate-300 custom-scrollbar ">
      <div className="absolute mx-3 right-0 z-10">
        <SideBar />
      </div>
      <div className='w-full h-full bg-slate-100 p-5 relative'>
        <div className='text-custom-purple font-bold text-3xl '>Shop Vouchers</div>
        <div className=' w-full h-auto mt-2 flex gap-5'>
            <div className='w-1/4 h-[550px] '>
                <div className='w-full h-auto place-items-center glass bg-violet-500 shadow-md shadow-slate-500 p-2 rounded-md'>
                    <div className='text-2xl text-center font-semibold text-slate-900 iceland-regular '>Create Vouchers</div>
                    <div className='mb-2 gap-3 flex place-items-center mt-2'>
                        <label className='text-slate-800 font-semibold text-sm '>Items OFF:</label>
                        <input 
                        onKeyDown={blockInvalidChar}

                        type='number' className='bg-slate-50 rounded-md text-slate-800 text-sm p-1 w-48   border-[1px] border-custom-purple'></input>
                    </div>
                    <div className='mb-2 gap-2 flex place-items-center'>
                        <label className='text-slate-800 font-semibold text-sm'>Min Spend:</label>
                        <input 
                        onKeyDown={blockInvalidChar}

                        type='number' className='bg-slate-50 rounded-md text-slate-800 text-sm p-1 w-48 border-[1px] border-custom-purple'></input>
                    </div>
                    <div className='justify-end relative w-full flex  '>
                        <button className='p-2 bg-custom-purple shadow-md  mr-2 text-white text-sm glass rounded-md hover:bg-primary-color hover:scale-95 duration-300'> CREATE </button>
                    </div>
                    
                </div>
                <div className='mt-2 h-[370px] relative'>
                    <div className='w-auto'>
                        <button 
                        onClick={handleSendToFollowers}
                        className='font-semibold text-slate-800 flex justify-between w-full hover:bg-slate-300 duration-200 rounded-md p-1'>Gift to Followers <box-icon color='#FAB12F' name='gift'></box-icon> </button>
                    </div>
                    <div>
                        <button className='font-semibold text-slate-800 flex justify-between w-full hover:bg-slate-300 duration-200 rounded-md p-1'>Delete Voucher  <box-icon type='solid' name='coupon' color='#FAB12F'></box-icon> </button>
                    </div>
                    <div className='absolute w-full bottom-0 '>
                        <div className='w-full flex justify-between' >
                            <button
                              onClick={() => navigate('/shop/MerchantDashboard')}
                              className='font-semibold text-slate-800 flex justify-between w-full hover:bg-slate-300 duration-200 rounded-md p-1'>Go back to Dashboard <box-icon name='dashboard' color='#4D077C' type='solid' ></box-icon> </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-3/4 h-[550px] rounded-md bg-slate-200  shadow-inner shadow-slate-500 overflow-hidden overflow-y-scroll'>
            <div className='w-auto grid grid-cols-2  gap-3 p-3'>

                    {VouchersData.map((voucher) => (
                       <div key={voucher.id} className='h-14 w-full shadow-md shadow-primary-color relative bg-slate-800 hover:scale-95 duration-300 mt-1 flex place-items-center rounded-sm'>
                            <div className=' absolute -ml-2'>
                            <div className='bg-slate-200 h-3 w-3 mb-1 rounded-full'></div>
                            <div className='bg-slate-200 h-3 w-3 rounded-full'></div>  
                            </div>
                            <div className='bg-slate-400 md:h-5 md:w-5 h-3 w-3 rounded-full absolute right-3 place-content-center flex place-items-center'>
                            <input type="checkbox" default className="checkbox rounded-full " onChange={() => handleCheckboxChange(voucher)} />
                            </div>
                            <div>
                            <div className='h-10 w-10 rounded-full mx-5'>
                                <img
                                src={blackLogo}
                                alt="Shop Logo"
                                className="drop-shadow-custom object-cover l"
                                />
                            </div>
                            </div>
                            
                            <div className='h-full w-full bg-slate-100 p-1 px-2'>
                            <div>
                                <p className=' text-slate-800 font-medium text-sm md:text-lg '>Shop Voucher
                                <span className='text-custom-purple font-semibold'> {voucher.off}% OFF</span>
                                </p>
                                <p className=' text-slate-800 font-normal text-sm'>Minimun spend of 
                                <span className='text-custom-purple font-semibold'> ₱{voucher.minSpend}</span>
                                </p>
                            </div>
                            
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
      </div>

        {showModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-5 rounded-md shadow-md">
                    <h2 className="text-xl font-bold mb-4 text-slate-800">Selected Vouchers</h2>
                    <ul>
                        {selectedVouchers.map((voucher) => (
                            <li key={voucher.id} className="mb-2 text-custom-purple">
                                {voucher.off}% OFF - Minimum Spend: ₱{voucher.minSpend}
                            </li>
                        ))}
                    </ul>
                    <div className='flex w-full justify-between'>
                        <button onClick={closeModal} className="mt-4 p-2 bg-red-500 text-white rounded-md">Cancel</button>
                        <button onClick={() => setShowModal(false) && {}}  className="mt-4 p-2 bg-green-500 text-white rounded-md">Send</button>
                    </div>
                  
                </div>
            </div>
        )}
  </div>
  );
}



export default Vouchers;
