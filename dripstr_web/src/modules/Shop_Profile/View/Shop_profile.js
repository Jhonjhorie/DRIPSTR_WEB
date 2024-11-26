import React, { useState, useEffect } from 'react';
import SideBar from '../Component/Sidebars'
import logo from '../../../assets/shop/shoplogo.jpg';
import logo1 from '../../../assets/shop/s1.jpg';
import logo2 from '../../../assets/shop/s2.jpg';
import logo3 from '../../../assets/shop/s3.jpg';
import logo4 from '../../../assets/shop/s4.jpg';
import starrate from '../../../assets/images/others/fillfull.png';
import blackLogo from '../../../assets/images/blackLogo.png';
import sample1 from '../../../assets/images/samples/5.png'
import sample2 from '../../../assets/images/samples/10.png'
import sample3 from '../../../assets/images/samples/3.png'
import sample4 from '../../../assets/images/samples/4.png'
import sample5 from '../../../assets/images/samples/6.png'
import sample6 from '../../../assets/images/samples/7.png'
import sample7 from '../../../assets/images/samples/9.png'
import sample8 from '../../../assets/images/samples/11.png'
import sample9 from '../../../assets/images/samples/12.png'

function Shop_profile() { 

  
  return (
  <div className="h-full w-full overflow-y-scroll  bg-slate-300 custom-scrollbar px-2  lg:px-20 md:flex ">
    <div className='absolute mx-3 right-0 z-10'>
      <SideBar/>
    </div>
    <div className='w-[90%] md:w-[35%] lg:overflow-hidden lg:w-[25%] h-auto md:fixed md:h-auto shadow-2xl bg-slate-100 gap-2 mx-auto '>
        <div className='w-full h-auto p-2'>
          <div className='bg-gradient-to-r from-violet-500 to-fuchsia-500 h-1/2 w-full rounded-sm shadow-md mt-2'>
            <div className='lg:flex w-full h-[70%] place-items-center justify-center  '>
              <div className=' p-2 h-1/2 lg:h-[120px] w-1/2 lg:w-1/3'>
                <div className='rounded-md bg-primary-color p-1 h-full w-full'>
                  <img
                    src={logo}
                    alt="Shop Logo"
                    className="drop-shadow-custom object-cover rounded-md h-full w-full"
                  />
                </div>
              </div>
              <div className=' w-2/3 place-content-center place-items-center lg:place-items-start '>
                <div className='text-slate-100 text-sm lg:text-lg font-semibold'> Saint Mercy Apparel </div>
                <div className='text-slate-100 text-sm font-semibold flex place-items-center gap-2'> 
                  <div className='bg-green-400 h-2 w-2 rounded-md pl-4' />
                  <div className='text-sm font-normal'> Active </div>  
                </div>
                <div className='text-slate-100 text-sm font-semibold flex gap-2 place-items-center'> 
                 <box-icon name='group' size="16px" color='#FFFFFF'></box-icon> 
                 <div className='text-sm font-normal'> Followers: <a className='text-yellow-300'>100k</a></div> 
                </div>
                <div className='text-slate-100 text-sm font-semibold flex gap-2 place-items-center'> 
                 <box-icon size="15px" name='message-dots' color='#FFFFFF'></box-icon>
                 <div className='text-sm font-normal'> Chat response rating: <a className='text-yellow-300'>4.5%</a> </div> 
                </div>
              </div>
            </div>
            <div className='w-full h-[30%]  flex'>
              <div className=' h-full w-1/2 p-1 '>
                <div className='border-slate-50 w-full p-1 h-full border-2 hover:bg-purple-700 duration-300 cursor-pointer rounded-sm flex justify-center place-items-center gap-3'>
                  <box-icon name='bookmark-alt-plus' size="20px" color='#FFFFFF'></box-icon>
                  <a className='text-white text-sm'>Follow</a>
                </div>
              </div>
              <div className=' h-full w-1/2 p-1'>
                <div className='border-slate-50 w-full p-1 h-full border-2 hover:bg-purple-700 duration-300 cursor-pointer rounded-sm flex justify-center place-items-center gap-3'>
                  <box-icon name='message-square-dots' size="20px" color="#FFFFFF"></box-icon>
                  <a className='text-white text-sm'>Chat Now</a>
                </div>  
              </div>
            </div>
          </div>
        </div>
        <div className=' w-full h-[550px] md:mt-0 mt-2 p-2'>
          <div className="carousel w-full h-[80%] mt-1 rounded-md border-primary-color border-[5px] ">
            <div id="slide1" className="carousel-item relative w-full ">
              <img
                src={logo1}
                className="w-full " />
              <div className="absolute left-2 right-2 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide4" className="btn rounded-md bg-transparent hover:bg-primary-color hover:glass hover:opacity-80 text-slate-950 text-lg ">❮</a>
                <a href="#slide2" className="btn rounded-md bg-transparent hover:bg-primary-color hover:glass hover:opacity-80 text-slate-950 text-lg">❯</a>
              </div>
            </div>
            <div id="slide2" className="carousel-item relative w-full">
              <img
                src={logo2}
                className="w-full" />
              <div className="absolute left-2 right-2 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide1" className="btn rounded-md bg-transparent hover:bg-primary-color hover:glass hover:opacity-80 text-slate-950 text-lg ">❮</a>
                <a href="#slide3" className="btn rounded-md bg-transparent hover:bg-primary-color hover:glass hover:opacity-80 text-slate-950 text-lg ">❯</a>
              </div>
            </div>
            <div id="slide3" className="carousel-item relative w-full">
              <img
                src={logo3}
                className="w-full" />
              <div className="absolute left-2 right-2 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide2" className="btn rounded-md bg-transparent hover:bg-primary-color hover:glass hover:opacity-80 text-slate-950 text-lg ">❮</a>
                <a href="#slide4" className="btn rounded-md bg-transparent hover:bg-primary-color hover:glass hover:opacity-80 text-slate-950 text-lg text-slate-950 text-lg">❯</a>
              </div>
            </div>
            <div id="slide4" className="carousel-item relative w-full">
              <img
                src={logo4}
                className="w-full" />
              <div className="absolute left-2 right-2 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a href="#slide3" className="btn rounded-md bg-transparent hover:bg-primary-color hover:glass hover:opacity-80 text-slate-950 text-lg ">❮</a>
                <a href="#slide1" className="btn rounded-md bg-transparent hover:bg-primary-color hover:glass hover:opacity-80 text-slate-950 text-lg ">❯</a>
              </div>
            </div>
          </div>
        </div>
    </div>
    <div className='h-auto  w-full md:flex  '>
      <div className='md:h-full  w-full md:w-[35%] lg:w-[30%] bg-slate-600'></div>
      <div className='h-full pb-14 w-full md:w-[65%] lg:w-[75%] md:px-10 px-2 bg-slate-50'>
        <div className="dropdown dropdown-bottom flex  justify-between gap-2 mt-2 place-items-center  ">
          <p className='font-semibold text-slate-800 flex gap-5 place-items-center iceland-regular text-3xl md:text-4xl  '> Shop products </p> 
         
          <div className="flex place-items-center dropdown dropdown-bottom dropdown-end">
            <div className='text'>filter items</div>
            <div tabIndex={0} role="button" className="h-8 w-8 jus justify-center place-items-center flex rounded-md
            hover:bg-slate-900 hover:duration-300 bg-slate-700  m-1"><box-icon color="#FFFFFF" name='filter'></box-icon></div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-sm z-[1] w-52 p-2 shadow">
              <li><a>Shirt</a></li>
              <li><a>Brief</a></li>
              <li><a>Boxers</a></li>
              <li><a>Polo</a></li>
              <li><a>Formal</a></li>
            </ul>
           </div> 
        </div>
        <div className=" justify-center mt-5 ">
          <div className='w-full justify-center  flex flex-wrap gap-2 md:gap-4'>
            <div className=" p-1 md:p-0 md:w-44 w-40 h- hover:scale-105 duration-200 rounded  shadow-lg bg-white group">
              <div className='h-[70%] bg-slate-300 w-full relative'>
                <div className='opacity-40 p-2 absolute top-0 left-0 group-hover:opacity-100  transition-opacity duration-300'>
                  <img
                    src={blackLogo}
                    alt="Logo"
                    className="w-[25px] h-[25px]"
                  />
                </div>
                <div className=' p-2 '>
                  <img
                    src={sample1}
                    alt="sample1"
                    className="object-cover w-[150px] h-[170px]"
                  />
                </div>
              </div>
              <div className="px-2 py-2">
                <div className="font-bold text-slate-900 text-xl mb-2">Viscount Black</div>
                <div className='flex w-full h-auto justify-between'>
                  <p className='text-primary-color'>₱100</p>
                  <div className='flex place-items-center ' >
                    <div className='text-primary-color'>4.1 </div>
                    <div c>
                      <img
                        src={starrate}
                        alt="Placeholder image of a scenic landscape with mountains and a lake"
                        className="w-[15px] h-[15px]"
                      />
                    </div> | <div className=''> 0 sold </div>
                  </div>
                </div>
              </div>
            </div>

            <div className=" p-1 md:p-0 md:w-44 w-40  h-[300px] hover:scale-105 duration-200 rounded  shadow-lg bg-white group">
              <div className='h-[70%] bg-slate-300 w-full relative'>
                <div className='opacity-40 p-2 absolute top-0 left-0 group-hover:opacity-100  transition-opacity duration-300'>
                  <img
                    src={blackLogo}
                    alt="Logo"
                    className="w-[25px] h-[25px]"
                  />
                </div>
                <div className=' p-2 '>
                  <img
                    src={sample2}
                    alt="sample10"
                    className="object-cover w-[150px] h-[170px]"
                  />
                </div>
              </div>
              <div className="px-2 py-2">
                <div className="font-bold text-slate-900 text-xl mb-2">Viscount Black</div>
                <div className='flex w-full h-auto justify-between'>
                  <p className='text-primary-color'>₱100</p>
                  <div className='flex place-items-center ' >
                    <div className='text-primary-color'>4.1 </div>
                    <div c>
                      <img
                        src={starrate}
                        alt="Placeholder image of a scenic landscape with mountains and a lake"
                        className="w-[15px] h-[15px]"
                      />
                    </div> | <div className=''> 0 sold </div>
                  </div>
                </div>
              </div>
            </div>

            <div className=" p-1 md:p-0 md:w-44 w-40  h-[300px] hover:scale-105 duration-200 rounded  shadow-lg bg-white group">
              <div className='h-[70%] bg-slate-300 w-full relative'>
                <div className='opacity-40 p-2 absolute top-0 left-0 group-hover:opacity-100  transition-opacity duration-300'>
                  <img
                    src={blackLogo}
                    alt="Logo"
                    className="w-[25px] h-[25px]"
                  />
                </div>
                <div className=' p-2 '>
                  <img
                    src={sample3}
                    alt="sample10"
                    className="object-cover w-[150px] h-[170px]"
                  />
                </div>
              </div>
              <div className="px-2 py-2">
                <div className="font-bold text-slate-900 text-xl mb-2">Viscount Black</div>
                <div className='flex w-full h-auto justify-between'>
                  <p className='text-primary-color'>₱100</p>
                  <div className='flex place-items-center ' >
                    <div className='text-primary-color'>4.1 </div>
                    <div c>
                      <img
                        src={starrate}
                        alt="Placeholder image of a scenic landscape with mountains and a lake"
                        className="w-[15px] h-[15px]"
                      />
                    </div> | <div className=''> 0 sold </div>
                  </div>
                </div>
              </div>
            </div>

            <div className=" p-1 md:p-0 md:w-44 w-40  h-[300px] hover:scale-105 duration-200 rounded  shadow-lg bg-white group">
              <div className='h-[70%] bg-slate-300 w-full relative'>
                <div className='opacity-40 p-2 absolute top-0 left-0 group-hover:opacity-100  transition-opacity duration-300'>
                  <img
                    src={blackLogo}
                    alt="Logo"
                    className="w-[25px] h-[25px]"
                  />
                </div>
                <div className=' p-2 '>
                  <img
                    src={sample4}
                    alt="sample10"
                    className="object-cover w-[150px] h-[170px]"
                  />
                </div>
              </div>
              <div className="px-2 py-2">
                <div className="font-bold text-slate-900 text-xl mb-2">Viscount Black</div>
                <div className='flex w-full h-auto justify-between'>
                  <p className='text-primary-color'>₱100</p>
                  <div className='flex place-items-center ' >
                    <div className='text-primary-color'>4.1 </div>
                    <div c>
                      <img
                        src={starrate}
                        alt="Placeholder image of a scenic landscape with mountains and a lake"
                        className="w-[15px] h-[15px]"
                      />
                    </div> | <div className=''> 0 sold </div>
                  </div>
                </div>
              </div>
            </div>

            <div className=" p-1 md:p-0 md:w-44 w-40  h-[300px] hover:scale-105 duration-200 rounded  shadow-lg bg-white group">
              <div className='h-[70%] bg-slate-300 w-full relative'>
                <div className='opacity-40 p-2 absolute top-0 left-0 group-hover:opacity-100  transition-opacity duration-300'>
                  <img
                    src={blackLogo}
                    alt="Logo"
                    className="w-[25px] h-[25px]"
                  />
                </div>
                <div className=' p-2 '>
                  <img
                    src={sample5}
                    alt="sample10"
                    className="object-cover w-[150px] h-[170px]"
                  />
                </div>
              </div>
              <div className="px-2 py-2">
                <div className="font-bold text-slate-900 text-xl mb-2">Viscount Black</div>
                <div className='flex w-full h-auto justify-between'>
                  <p className='text-primary-color'>₱100</p>
                  <div className='flex place-items-center ' >
                    <div className='text-primary-color'>4.1 </div>
                    <div c>
                      <img
                        src={starrate}
                        alt="Placeholder image of a scenic landscape with mountains and a lake"
                        className="w-[15px] h-[15px]"
                      />
                    </div> | <div className=''> 0 sold </div>
                  </div>
                </div>
              </div>
            </div>

            <div className=" p-1 md:p-0 md:w-44 w-40  h-[300px] hover:scale-105 duration-200 rounded  shadow-lg bg-white group">
              <div className='h-[70%] bg-slate-300 w-full relative'>
                <div className='opacity-40 p-2 absolute top-0 left-0 group-hover:opacity-100  transition-opacity duration-300'>
                  <img
                    src={blackLogo}
                    alt="Logo"
                    className="w-[25px] h-[25px]"
                  />
                </div>
                <div className=' p-2 '>
                  <img
                    src={sample6}
                    alt="sample10"
                    className="object-cover w-[150px] h-[170px]"
                  />
                </div>
              </div>
              <div className="px-2 py-2">
                <div className="font-bold text-slate-900 text-xl mb-2">Viscount Black</div>
                <div className='flex w-full h-auto justify-between'>
                  <p className='text-primary-color'>₱100</p>
                  <div className='flex place-items-center ' >
                    <div className='text-primary-color'>4.1 </div>
                    <div c>
                      <img
                        src={starrate}
                        alt="Placeholder image of a scenic landscape with mountains and a lake"
                        className="w-[15px] h-[15px]"
                      />
                    </div> | <div className=''> 0 sold </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className=" p-1 md:p-0 md:w-44 w-40  h-[300px] hover:scale-105 duration-200 rounded  shadow-lg bg-white group">
              <div className='h-[70%] bg-slate-300 w-full relative'>
                <div className='opacity-40 p-2 absolute top-0 left-0 group-hover:opacity-100  transition-opacity duration-300'>
                  <img
                    src={blackLogo}
                    alt="Logo"
                    className="w-[25px] h-[25px]"
                  />
                </div>
                <div className=' p-2 '>
                  <img
                    src={sample7}
                    alt="sample10"
                    className="object-cover w-[150px] h-[170px]"
                  />
                </div>
              </div>
              <div className="px-2 py-2">
                <div className="font-bold text-slate-900 text-xl mb-2">Viscount Black</div>
                <div className='flex w-full h-auto justify-between'>
                  <p className='text-primary-color'>₱100</p>
                  <div className='flex place-items-center ' >
                    <div className='text-primary-color'>4.1 </div>
                    <div c>
                      <img
                        src={starrate}
                        alt="Placeholder image of a scenic landscape with mountains and a lake"
                        className="w-[15px] h-[15px]"
                      />
                    </div> | <div className=''> 0 sold </div>
                  </div>
                </div>
              </div>
            </div>

            <div className=" p-1 md:p-0 md:w-44 w-40  h-[300px] hover:scale-105 duration-200 rounded  shadow-lg bg-white group">
              <div className='h-[70%] bg-slate-300 w-full relative'>
                <div className='opacity-40 p-2 absolute top-0 left-0 group-hover:opacity-100  transition-opacity duration-300'>
                  <img
                    src={blackLogo}
                    alt="Logo"
                    className="w-[25px] h-[25px]"
                  />
                </div>
                <div className=' p-2 '>
                  <img
                    src={sample8}
                    alt="sample10"
                    className="object-cover w-[150px] h-[170px]"
                  />
                </div>
              </div>
              <div className="px-2 py-2">
                <div className="font-bold text-slate-900 text-xl mb-2">Viscount Black</div>
                <div className='flex w-full h-auto justify-between'>
                  <p className='text-primary-color'>₱100</p>
                  <div className='flex place-items-center ' >
                    <div className='text-primary-color'>4.1 </div>
                    <div c>
                      <img
                        src={starrate}
                        alt="Placeholder image of a scenic landscape with mountains and a lake"
                        className="w-[15px] h-[15px]"
                      />
                    </div> | <div className=''> 0 sold </div>
                  </div>
                </div>
              </div>
            </div>

            <div className=" p-1 md:p-0 md:w-44 w-40  h-[300px] hover:scale-105 duration-200 rounded  shadow-lg bg-white group">
              <div className='h-[70%] bg-slate-300 w-full relative'>
                <div className='opacity-40 p-2 absolute top-0 left-0 group-hover:opacity-100  transition-opacity duration-300'>
                  <img
                    src={blackLogo}
                    alt="Logo"
                    className="w-[25px] h-[25px]"
                  />
                </div>
                <div className=' p-2 '>
                  <img
                    src={sample9}
                    alt="sample10"
                    className="object-cover w-[150px] h-[170px]"
                  />
                </div>
              </div>
              <div className="px-2 py-2">
                <div className="font-bold text-slate-900 text-xl mb-2">Viscount Black</div>
                <div className='flex w-full h-auto justify-between'>
                  <p className='text-primary-color'>₱100</p>
                  <div className='flex place-items-center ' >
                    <div className='text-primary-color'>4.1 </div>
                    <div c>
                      <img
                        src={starrate}
                        alt="Placeholder image of a scenic landscape with mountains and a lake"
                        className="w-[15px] h-[15px]"
                      />
                    </div> | <div className=''> 0 sold </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
            
          </div>
      </div>

    </div>
  </div>
  );
}



export default Shop_profile;
