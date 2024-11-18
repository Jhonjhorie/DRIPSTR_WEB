import React, {useEffect, useState} from 'react';
import logo from '../../../assets/logoBlack.png';
import sell from '../../../assets/sell.png';
import 'boxicons'
  
function Login() { 
    const [phoneNumber, setPhoneNumber] = useState('');

    const phonedigit = (e) => {
        let value = e.target.value;
        value = value.replace(/[^0-9]/g, '').slice(0, 11); 
        setPhoneNumber(value);
      };


  return (
<div className="h-full w-full">
  <div className="h-auto w-full lg:flex bg-slate-100 ">
    {/* FIRST CONTAINER */}
    <div className='bg-slate-200 h-auto w-full lg:w-[40%] relative p-2 z-20 md:p-5'>
        <div className='bg-slate-100 h-auto  w-full rounded-md justify-items-center justify-center p-10'>
            <div className='align-middle flex justify-center gap-2'>
                <box-icon  type='solid' color='' size='120%' name='store'></box-icon>
                <h1 className='text-3xl pt-1 text-violet-950 text-center font-bold'>MERCHANT SIGN-UP</h1>   
            </div>
           
            {/* Shop Name */}
            <label className="form-control w-full max-w-xs mt-5">
                <div className="label">
                    <span className="label-text font-serif font-semibold text-slate-700">What is your SHOP name?</span>
                </div>
                    <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
            </label>
            {/* Shop contact info */}
            <label className="form-control w-full max-w-xs mt-2">
                <div className="label">
                    <span className="label-text font-serif font-semibold text-slate-700">What is your SHOP contact number?</span>
                </div>
                    <input
                    value={phoneNumber}
                    onChange={phonedigit}
                    onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                    type="number" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
            </label>
            {/* Shop address */}
            <label className="form-control w-full max-w-xs mt-2">
                <div className="label">
                    <span className="label-text font-serif font-semibold text-slate-700">SHOP Address?</span>
                </div>
                    <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
            </label>
            {/* Type of business */}
            <label className="form-control w-full max-w-xs mt-2">
                <div className="label">
                    <span className="label-text font-serif font-semibold text-slate-700">What is your Type of Business?</span>
                </div>
                <select className="select select-bordered w-full max-w-xs">
                    <option value="">Select an option</option>
                    <option value="">option 1</option>
                    <option value="">option 2</option>
                    <option value="">option 3</option>
                    <option value="">option 4</option>
                    <option value="">option 5</option>
                </select>
            </label>
            {/* Image selection */}
            <div className='flex justify-center align-middle'>
                <label className="form-control w-full max-w-xs mt-2">
                    <div className="label">
                        <span className="label-text font-serif font-semibold text-slate-700">Pick an Image for your Shop</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="file" className="file-input file-input-bordered w-full max-w-xs" accept="image/*"/>
                        <label 
                        htmlFor='ImageLogo'
                        className="btn btn-neutral w-[20%]">View</label>
                    </div>
                </label>             
            </div>
            {/* Onsubmit*/}
            <div className=' w-full max-w-xs h-10 mt-5 relative '>
                <button className="btn glass bg-custom-purple absolute right-0 text-white "> <box-icon color='white' name="rocket"></box-icon>  SUBMIT</button>
            </div>

        </div>
    </div>
    {/* SECOND CONTAINER */}
    <div className='  relative h-auto w-full lg:w-[60%] p-2'>
        <div className='flex'>
            <div>
                <div className='text-black font-serif text-2xl'>" Thinking about seeling? "</div>
                <div className='text-black font-serif font-bold text-3xl'>JOIN WITH DRIPSTR </div>
            </div>
            
            <div className='bg-slate-50 h-[40%] w-[50%] rounded-md p-2  '>
                <img src={sell} alt="Logo" className='rounded-md'/>
            </div>
           
        </div>
        
       
    </div>

 
  </div>
  
    {/* Put this part before </body> tag */}
    <input type="checkbox" id="ImageLogo" className="modal-toggle" />
    <div className="modal" role="dialog">
    <div className="modal-box">
        <h3 className="text-lg font-bold">Hello!</h3>
        <p className="py-4">This modal works with a hidden checkbox!</p>
        <div className="modal-action">
        <label htmlFor="ImageLogo" className="btn">Close!</label>
        </div>
    </div>
    </div>
       
</div>


  );
}



export default Login;