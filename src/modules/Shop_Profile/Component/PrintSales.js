import React, { useState, useEffect, useRef } from "react";
import {useReactToPrint} from 'react-to-print';
import logo from '../../../assets/logoBlack.png';
import logoName from '../../../assets/logoName.png';
import DateTime from '../Hooks/DateTime';
import { supabase } from "../../../constants/supabase";

function PrintSales() { 
    const contentRef = useRef(null);
    const handlePrint = useReactToPrint({ contentRef });
  
    const Dripstr = 'partnered with Dripstr';
    const TotalReturnItems = '20';  
    const PossitiveFB = '"Great outfit my Girlfriend will fall in love to me over and over again wearing this T-shirt is so comfy❤️‍🔥💌"';
    const NegativeFB = '"So small the outfit is pretty, but the size URGH... Stresss"';
    const [shopName, setShopName] = useState("");
    const [shopRating, setShopRating] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [loading, setLoading] = useState(true);
    const [totalReturnItems, setTotalReturnItems] = useState(0);

//fetch the info
    useEffect(() => {
      const fetchUserProfileAndShop = async () => {
        try {
          // Get current authenticated user
          const { data: userData, error: authError } = await supabase.auth.getUser();
          if (authError) {
            console.error("Auth Error:", authError.message);
            return;
          }
    
          const user = userData?.user;
          if (!user) {
            console.error("No user is signed in.");
            return;
          }
    
          // Fetch the shop owned by the current user
          const { data: shop, error: shopError } = await supabase
            .from("shop")
            .select("id, shop_name, shop_Rating")
            .eq("owner_Id", user.id)
            .single();
    
          if (shopError) throw shopError;
    
          if (shop) {
            setShopName(shop.shop_name || "Unknown Shop");
            setShopRating(shop.shop_Rating || 0);
    
            const shopId = shop.id; 
    
            // Get the first and last day of the current month
            const now = new Date();
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();
    
            // Fetch total orders and income for this month
            const { data: orders, error: orderError } = await supabase
              .from("orders")
              .select("quantity, final_price, shipping_status")
              .eq("shop_id", shopId)
              .gte("date_of_order", firstDay)
              .lte("date_of_order", lastDay);
    
            if (orderError) {
              console.error("Error fetching orders:", orderError.message);
              return;
            }
    
            if (!orders || orders.length === 0) {
              setTotalOrders(0);
              setTotalIncome(0);
              setTotalReturnItems(0);
            } else {
              let totalSales = 0;
              let totalReturns = 0;
              let totalOrders = 0;
    
              orders.forEach(order => {
                totalOrders += order.quantity;
                totalSales += order.final_price || 0;
                if (order.shipping_status === "Returned") {
                  totalReturns += order.quantity;
                }
              });
    
              setTotalOrders(totalOrders);
              setTotalIncome(totalSales);
              setTotalReturnItems(totalReturns);
            }
          }
        } catch (error) {
          console.error("Error fetching data:", error.message);
        } finally {
          setLoading(false);
        }
      };
    
      fetchUserProfileAndShop();
    }, []);
    
      


    
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
                            <div className='p-1 text-slate-950 text-sm font-semibold'>Shop name : <span className='font-normal text-sm'>{shopName}</span></div>    
                            <div className='p-1 text-slate-950 text-sm font-semibold'>Ratings : <span className='font-normal text-sm'>{shopRating}</span></div>    
                            <div className='p-1 text-slate-950 text-sm font-semibold'>Total Income : <span className='font-normal text-sm'>{totalIncome}</span></div>    
                            <div className='p-1 text-slate-950 text-sm font-semibold'>Total Orders : <span className='font-normal text-sm'>{totalOrders}</span></div>    
                            <div className='p-1 text-slate-950 text-sm font-semibold mb-3'>No. of Return Item : <span className='font-normal text-sm'>{totalReturnItems}</span></div>                 
                            <div className='p-1 text-slate-950 text-sm font-semibold'>Most Possitive Feedback : <br/> <span className='font-normal text-sm'>{PossitiveFB}</span></div>    
                            <div className='p-1 text-slate-950 text-sm font-semibold mb-10'>Least Likely Feedback : <br/><span className='font-normal text-sm'>{NegativeFB}</span></div>    
                            <div className='p-1 text-slate-950 text-sm font-semibold  '>
                                <span className=''><DateTime/></span> 
                            </div>
                        </div>
                    </div>
                    <div className='w-full h-0.5 rounded-full bg-custom-purple'></div>
                    
                        {/* <div className='bg-slate-900 w-[27%] h-0.5 absolute right-7 bottom-24'></div>
                        <div className=' text-sm text-slate-900  absolute right-14 bottom-20  '>Approved by:</div> */}
                    
                  
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
