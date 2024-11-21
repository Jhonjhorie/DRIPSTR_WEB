import React, {useRef} from 'react';
import {useReactToPrint} from 'react-to-print';

function PrintSales() { 
    const contentRef = useRef(null);
    const handlePrint = useReactToPrint({ contentRef });
  
  return (
    <div>
         <div
            onClick={()=>document.getElementById('print').showModal()}
            className=' text-slate-800 font-semibold h-full w-full md:pl-2 md:py-1 py-2.5 md:text-[15px]  text-xs '> 
            Print Report  
        </div>

        {/* MODAL PRINT SALES STATISTICS */}
        <dialog id="print" className="modal ">
            <div className="modal-box rounded-md bg-slate-950 glass h-full ">
            <div className='h-[90%]  w-full bg-slate-100 rounded-sm'>
                <div ref={contentRef}>Content to print</div>
            </div>
            
            <div className='modal-action flex justify-between h-[5%] '>
                <button className='h-12 text-slate-900 font-semibold hover:bg-custom-purple hover:duration-300 glass w-40 bg-slate-100 rounded-md' onClick={handlePrint}>Print</button>
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
