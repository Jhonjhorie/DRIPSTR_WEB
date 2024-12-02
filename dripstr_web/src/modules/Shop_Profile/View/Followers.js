import React from 'react';
import SideBar from '../Component/Sidebars'
import girl from '../../../assets/shop/erica.jpg';
import shop from '../../../assets/shop/nevercry.jpg';
import store2 from '../../../assets/shop/store2.jpg'
import blackLogo from '../../../assets/logoWhite.png'
const { useState } = React;

function Followers() { 
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");
  const [selectedReport, setSelectedReport] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [isModalOpen4, setIsModalOpen4] = useState(false);


  const handleChange = (event) => {
      setSelectedOption(event.target.value);
  };
  const handleChange2 = (event) => {
    setSelectedOption2(event.target.value);
  };
  const handleReportSelect = (event) => {
    setSelectedReport(event.target.value);
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsModalOpen2(false);
    setIsModalOpen3(false);
    setIsModalOpen4(false);
  };
  const handleVoucher = () => {
    setIsModalOpen2(true);
  };
  const handleReport = () => {
    setIsModalOpen3(true);
  };
  const handleRemove = () => {
    setIsModalOpen4(true);
  };
  const profiles = Array(20).fill({
    name: "Jane Doe",
    message: "Follow your shop.",

  });



  return (
  <div className="h-full w-full overflow-y-scroll bg-slate-300 custom-scrollbar  md:flex">
    <div className='absolute mx-3 right-0 z-10'>
      <SideBar/>
    </div>
    <div className='w-full h-full bg-slate-300 md:px-10 lg:px-16 py-2'>
        <div className='rounded-sm px-2  place-items-center  md:px-5 lg:mx-7 mt-2 font-bold md:flex justify-between'>
          <div className='text-custom-purple place-self-start px-5 md:px-0 text-xl sm:text-2xl md:text-3xl'>
            SHOP FOLLOWERS
          </div>
         
          <div className='mt-10 md:mt-0 md:mr-14 flex group '>
            <input type='text' placeholder='Search name...' className='bg-slate-100 text-slate-900 rounded-l-md text-sm font-normal w-72 h-10 p-2'></input>
            <div className='bg-custom-purple px-2 hover:bg-primary-color duration-300 rounded-r-md cursor-pointer flex place-items-center'>
              <box-icon name='search-alt' color='#FFF'></box-icon>
            </div>
           
          </div>
        </div>
        <div className=' w-full  h-auto md:flex md:gap-5 px-5 md:px-10 '>
          <div className='  w-full md:w-1/2 h-full p-1 '>
            <div className='mt-2 w-full bg-slate-300 h-full rounded-md shadow-md p-1'>
              <div className='w-full bg-custom-purple rounded-t-md p-1 place-items-center text-white font-semibold flex justify-between'>
                Followers
                <div className="relative bg-slate-300 rounded-md flex place-items-center ">

                    <select
                        id="options"
                        value={selectedOption}
                        onChange={handleChange}
                        className="w-full bg-slate-400 text-slate-800  border py-1 px-4 rounded-md text-sm"
                    >
                        <option value="option1" >All</option>
                        <option value="option2">Newest</option>
                        <option value="option3">Month Ago</option>
                        <option value="option4">Year Ago</option>
                        <option value="option5">Oldest</option>
                    </select>
                    <box-icon name='filter'></box-icon>
                </div>
                </div>
              <div className='h-[500px] w-full bg-slate-100 rounded-b-md overflow-y-scroll custom-scrollbar relative p-1 '>
              {/* Sample Followers */}
              {profiles.map((profile, index) => (
              <div
                key={index}
                className="w-full h-12 hover:bg-custom-purple cursor-pointer bg-slate-400 hover:duration-200 glass mb-1 flex rounded-sm p-1 justify-between"
              >
                <div className='flex'>
                  <div className="rounded-md bg-white h-full w-10">
                    <img
                      src={girl}
                      alt={`Profile picture of ${profile.name}`}
                      className="drop-shadow-custom h-full w-full object-cover rounded-md"
                      sizes="100%"
                    />
                  </div>
                  <div>
                    <div className="text-slate-900 pl-2">{profile.name}</div>
                    <div className="text-slate-800 text-sm pl-2 -mt-1">
                      {profile.message}
                    </div>
                  </div>
                </div>
                <div className='flex gap-2 place-items-center'>
                  <box-icon 
                   onMouseEnter={(e) => e.currentTarget.setAttribute('color', '#FFF')} 
                   onMouseLeave={(e) => e.currentTarget.setAttribute('color', '#FF2929')} 
                   onClick={handleReport} type='solid' name='user-x' color='#FF2929' ></box-icon>
                  <box-icon  
                   onMouseEnter={(e) => e.currentTarget.setAttribute('color', '#FFF')} 
                   onMouseLeave={(e) => e.currentTarget.setAttribute('color', '#4335A7')} 
                   onClick={handleRemove} type='solid' name='message-alt-error' color='#4335A7'></box-icon>
                  <box-icon
                   onMouseEnter={(e) => e.currentTarget.setAttribute('color', '#FFF')} 
                   onMouseLeave={(e) => e.currentTarget.setAttribute('color', '#FAB12F')} 
                   onClick={handleVoucher} type='solid' name='coupon' color='#FAB12F'></box-icon>
                </div>
                
              </div>
            ))}

              </div>
            </div>
          </div>
          <div className='  w-full md:w-1/2 h-full p-1'>
            <div className='mt-2 w-full bg-slate-300 h-full rounded-md shadow-md p-1'>
              <div className='w-full bg-primary-color rounded-t-md p-1 place-items-center text-white font-semibold flex justify-between'>
                Following
                <div className="relative bg-slate-300 rounded-md flex place-items-center ">

                    <select
                        id="options2"
                        value={selectedOption2}
                        onChange={handleChange2}
                        className="w-full bg-slate-400 text-slate-800  border py-1 px-4 rounded-md text-sm"
                    >
                        <option value="option1" >All</option>
                        <option value="option2">Newest</option>
                        <option value="option3">Month Ago</option>
                        <option value="option4">Year Ago</option>
                        <option value="option5">Oldest</option>
                    </select>
                    <box-icon name='filter'></box-icon>
                </div>
                </div>
              <div className='h-[500px] w-full bg-slate-100 rounded-b-md overflow-y-scroll custom-scrollbar relative p-1 '>
              {/* Sample Order Notif */}

              
                <div className='w-full h-12 place-items-center hover:bg-primary-color cursor-pointer justify-between bg-slate-400  hover:duration-200 glass mb-1 flex rounded-sm p-1'>
                  <div className='flex'>
                    <div className='rounded-md bg-white h-full w-10'>
                      <img
                        src={shop}
                        alt="Shop Logo"
                        className="drop-shadow-custom h-full w-full object-cover rounded-md"
                        sizes="100%"
                      />
                    </div>
                    <div className=''>
                      <div className=' text-slate-900 pl-2'> NeverCry TOP WEAR </div>
                      <div className=' text-slate-800 text-sm pl-2 -mt-1'>Followed  </div>
                    </div>
                  </div>
                 
                  <div className="relative">
                    <div onClick={handleOpenModal}>
                        <box-icon
                         onMouseEnter={(e) => e.currentTarget.setAttribute('color', '#FFF')} 
                         onMouseLeave={(e) => e.currentTarget.setAttribute('color', '#FF2929')}  
                         name='user-x' type='solid' color="red">
                        </box-icon>
                    </div> 
                  </div>
                </div>

                <div className='w-full h-12 place-items-center hover:bg-primary-color cursor-pointer justify-between bg-slate-400  hover:duration-200 glass mb-1 flex rounded-sm p-1'>
                  <div className='flex'>
                    <div className='rounded-md bg-white h-full w-10'>
                      <img
                        src={store2}
                        alt="Shop Logo"
                        className="drop-shadow-custom h-full w-full object-cover rounded-md"
                        sizes="100%"
                      />
                    </div>
                    <div className=''>
                      <div className=' text-slate-900 pl-2'> built me UP </div>
                      <div className=' text-slate-800 text-sm pl-2 -mt-1'>Followed  </div>
                    </div>
                  </div>
                 
                  <div className="relative">
                    <div  onClick={handleOpenModal}>
                        <box-icon
                          onMouseEnter={(e) => e.currentTarget.setAttribute('color', '#FFF')} 
                          onMouseLeave={(e) => e.currentTarget.setAttribute('color', '#FF2929')}  
                          name='user-x' type='solid' color="red">

                        </box-icon>
                    </div> 
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>

    {/* Remove following */} 
    {isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 ">
        <div className="bg-white rounded-lg p-6 w-full md:w-1/2 lg:w-1/4 m-2 md:m-0 auto">
          <h2 className="text-lg font-medium text-slate-800 mb-4 text-center "><span className='font-bold text-2xl'>UNFOLLOW</span><br/> NeverCry TOP WEAR?</h2>
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
              Unfollow
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Send Voucher */} 
    {isModalOpen2 && (
          <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 ">
            <div className="bg-white rounded-lg p-6 w-full md:w-1/2 lg:w-1/3 m-2 md:m-0 auto">
              <h2 className="text-lg font-medium text-slate-800 mb-4 text-center "><span className='font-bold text-2xl'>GIFT A <span className='text-primary-color'>VOUCHER</span> TO </span><br/> user: jane Doe</h2>
              <div className='h-full w-full bg-slate-300 rounded-sm shadow-lg'>
                <div className='h-auto text-white p-1 w-full bg-custom-purple rounded-t-sm '>
                  Select Voucher
                </div>
                <div className='h-[250px] w-full bg-slate-300 rounded-b-sm px-2 overflow-y-scroll custom-scrollbar '> 
                  <div className='h-14 w-full relative bg-slate-800  mt-1 flex place-items-center rounded-sm'>
                    <div className=' absolute -ml-2'>
                      <div className='bg-slate-300 h-3 w-3 mb-1 rounded-full'></div>
                      <div className='bg-slate-300 h-3 w-3 rounded-full'></div>  
                    </div>
                    <div className='bg-slate-400 md:h-5 md:w-5 h-3 w-3 rounded-full absolute right-3 place-content-center flex place-items-center'>
                      <input type="checkbox" default className="checkbox rounded-full " />
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
                        <p className=' text-slate-800 font-medium text-sm md:text-lg '>Shop Voucher <span className='text-custom-purple font-semibold'>100% OFF</span></p>
                        <p className=' text-slate-800 font-normal text-sm'>Minimun spend of <span className='text-custom-purple font-semibold'>₱700</span></p>
                      </div>
                    
                    </div>
                  </div>

                  <div className='h-14 w-full relative bg-slate-800 mt-1 flex place-items-center rounded-sm'>
                    <div className=' absolute -ml-2'>
                      <div className='bg-slate-300 h-3 w-3 mb-1 rounded-full'></div>
                      <div className='bg-slate-300 h-3 w-3 rounded-full'></div>  
                    </div>
                    <div className='bg-slate-400 md:h-5 md:w-5 h-3 w-3 rounded-full absolute right-3 place-content-center flex place-items-center'>
                      <input type="checkbox" default className="checkbox rounded-full " />
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
                        <p className=' text-slate-800 font-medium text-sm md:text-lg  '>Shop Voucher <span className='text-custom-purple font-semibold'>20% OFF</span></p>
                        <p className=' text-slate-800 font-normal text-sm'>Minimun spend of <span className='text-custom-purple font-semibold'>₱100</span></p>
                      </div>
                    
                    </div>
                  </div>
                  
                </div>
              </div>
              
              
              <div className='flex justify-between w-full mt-2'>
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
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

    {/* Remove followers */}  
    {isModalOpen3 && (
          <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 ">
            <div className="bg-white rounded-lg p-6 w-full md:w-1/2 lg:w-1/4 m-2 md:m-0 auto">
              <h2 className="text-lg font-medium text-slate-800 mb-4 text-center "><span className='font-bold text-2xl'>REMOVE FOLLOWERS</span><br/>user: jane Doe</h2>
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
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}

    {/* Report followers */} 
    {isModalOpen4 && (
          <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 ">
            <div className="bg-white rounded-lg p-6 w-full m-2 md:m-0 md:w-1/3">
              <h2 className="text-lg font-medium text-slate-800 mb-4 text-center ">
                <span className='font-bold text-2xl'>REPORT TO <a className='text-primary-color'>DRIPSTR</a></span>
                <br/>user: jane Doe</h2>
              
              <div className='text-slate-800 text-sm font-semibold'>Select Report Case</div>
            
                <select
                  id="optionsReports"
                  value={selectedReport}
                  onChange={handleReportSelect}
                  className="w-full bg-slate-300 text-slate-800  border py-1 px-2 rounded-sm text-sm"
                >    
                <option value="option1">Hate Speech</option>
                <option value="option2">Spamming Order Cancelations</option>
                <option value="option3">Payment Incomplete</option>
                <option value="option4">Rejected on delivery</option>
                <option value="option5">Others please specify to comments.</option>
              </select>
              <div className='text-slate-800 text-sm font-semibold mt-2'>Add comments</div>
              <textarea placeholder='Type your comment here...' className='custom-scrollbar bg-slate-300 h-20 w-full mt-1 text-slate-900 text-sm p-1'></textarea>
              
              
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
                  Report
                </button>
              </div>
            </div>
          </div>
        )}


  </div>
      );
    }



export default Followers;
