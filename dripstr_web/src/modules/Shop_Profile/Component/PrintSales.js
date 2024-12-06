import React, {useRef, useState} from 'react';
import {useReactToPrint} from 'react-to-print';
import logo from '../../../assets/logoBlack.png';
import logoName from '../../../assets/logoName.png';
import DateTime from '../Hooks/DateTime';

function PrintSales() { 
    const contentRef = useRef(null);
    const handlePrint = useReactToPrint({ contentRef });
  
    const Dripstr = 'partnered with Dripstr';
    const ShopName =  'Saint Mercy Apparel';
    const ShopRating = '4.5 stars';
    const TotalIncome = '120,000 pesos';
    const TotalReturnItems = '20';  
    const TotalOrders = '243';
    const PossitiveFB = '"Great outfit my Girlfriend will fall in love to me over and over again wearing this T-shirt is so comfy❤️‍🔥💌"';
    const NegativeFB = '"So small the outfit is pretty, but the size URGH... Stresss"';

  return (
    <div>
        {/* Onclick show print modal */}
        <div 
        className='w-full h-full text-slate-800'
        onClick={()=>document.getElementById('print').showModal()}> 
            Print Report
        </div>


        {/* MODAL PRINT SALES STATISTICS */}
        <dialog id="print" className="modal h-f">
            <div className="modal-box rounded-md bg-slate-950 glass h-[100%] ">
            <div className='h-[91%]  w-full bg-slate-100 rounded-sm'>
                <div ref={contentRef} className=' p-2 h-full w-full '>
                    <div className='flex justify-between items-center h-20 w-full p-2'>
                    
                        <div className='h-[70%] w-[30%] m-2 '>
                            <img
                                src={logoName}
                                alt="Shop Logo"
                                className="drop-shadow-custom h-full w-full object-cover rounded-md"
                            />
                        </div>
                        <div className='h-[75%] w-[10%] mr-2 '>
                            <img
                                src={logo}
                                alt="Shop Logo"
                                className="drop-shadow-custom h-full w-full object-cover rounded-md"
                            />
                        </div>
                    </div>
                    <div className='w-full h-0.5 rounded-full bg-custom-purple'></div>
                    <div className='w-full h-72 p-5 mb-5'>
                        <div className='text-black text-sm'>
                            <div className='p-1 text-slate-950 text-sm font-semibold'>Shop name : <span className='font-normal text-sm'>{ShopName}</span></div>    
                            <div className='p-1 text-slate-950 text-sm font-semibold'>Ratings : <span className='font-normal text-sm'>{ShopRating}</span></div>    
                            <div className='p-1 text-slate-950 text-sm font-semibold'>Total Income : <span className='font-normal text-sm'>{TotalIncome}</span></div>    
                            <div className='p-1 text-slate-950 text-sm font-semibold'>Total Orders : <span className='font-normal text-sm'>{TotalOrders}</span></div>    
                            <div className='p-1 text-slate-950 text-sm font-semibold mb-3'>No. of Return Item : <span className='font-normal text-sm'>{TotalReturnItems}</span></div>                 
                            <div className='p-1 text-slate-950 text-sm font-semibold'>Most Possitive Feedback : <br/> <span className='font-normal text-sm'>{PossitiveFB}</span></div>    
                            <div className='p-1 text-slate-950 text-sm font-semibold mb-10'>Least Likely Feedback : <br/><span className='font-normal text-sm'>{NegativeFB}</span></div>    
                            <div className='p-1 text-slate-950 text-sm font-semibold  '>
                                <span className=''><DateTime/></span> 
                            </div>
                        </div>
                    </div>
                    <div className='w-full h-0.5 rounded-full bg-custom-purple'></div>
                    
                        <div className='bg-slate-900 w-[27%] h-0.5 absolute right-7 bottom-24'></div>
                        <div className=' text-sm text-slate-900  absolute right-14 bottom-20  '>Approved by:</div>
                    
                  
                    <div className=' w-full z-10 bg-slate-400 '>   
                        <div className='  bottom-5 right-6 absolute  '>
                            {Dripstr}
                        </div>
                    </div>
                </div>
            </div>
            
            <div className='modal-action flex z-20 mt-4 justify-start h-[4%] '>
               
                <button className='h-12 text-custom-purple font-semibold hover:bg-custom-purple
                 hover:duration-300 glass w-28 bg-slate-100 rounded-md flex justify-center items-center gap-2 '
                  onClick={handlePrint}>
                     <box-icon type='solid' color='#563A9C' name='printer'></box-icon>
                     Print
                </button>
                <form method="dialog">
                    
                    <button className="btn">Close</button>
                </form>
            </div>
            </div>
        </dialog>


        
      
     </div>
  );
}



export default PrintSales;
