import React from 'react';
import ArtistSideBar from '../../Component/ArtistSB'
import avatar from '../../../../assets/car.jpg'
import drplogo from '../../../../assets/logoBlack.png'
import rank from '../../../../assets/starrank.png'
import art1 from '../../../../assets/art1.jpg'
import art2 from '../../../../assets/art2.jpg'
import art3 from '../../../../assets/art3.jpg'
import { PieChart } from '@mui/x-charts/PieChart';
import { useNavigate } from 'react-router-dom';

function MerchantDashboard() {
  const navigate = useNavigate();


  const { useState, useEffect } = React;

  const ArtistName = {name: 'Clazy CAT', typeofArt: ' "Digital Artist" '}  
  const data = [
    { label: 'Ethereal Horizon', value: 400 },
    { label: 'Cats Garden', value: 300 },
    { label: 'Mystic Bloom', value: 300 },
    { label: 'Dark Continent', value: 20 },
    { label: 'Xdinary Peeps', value: 278 },
    { label: 'Guitar Pick', value: 189 },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      photo: art1,
      likes: 400,
      name: "Ethereal Horizon",
      description: "A breathtaking digital landscape blending surreal colors and dreamlike imagery to evoke a sense of calm and wonder."
    },
    {
      photo: art2,
      likes: 300,
      name: "Cats Garden",
      description: "A vibrant depiction of a bustling cityscape, capturing the energy and rhythm of modern urban life through bold strokes and dynamic hues."
    },
    {
      photo: art3,
      likes: 300,
      name: "Mystic Bloom",
      description: "An enchanting fusion of floral elements and abstract patterns, celebrating the beauty of nature's transformation."
    }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
}, [slides.length]);

const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
};

const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
};


  return (
    <div className="h-full w-full bg-slate-300 overflow-y-scroll custom-scrollbar px-16  ">
      <div className="absolute mx-3 right-0 z-10">
        <ArtistSideBar></ArtistSideBar>
      </div>
      <div className='w-full h-full flex px-4 gap-2 bg-slate-100 pt-2'>
        <div className='w-3/12 h-full rounded-t-xl bg-slate-800 shadow-md shadow-slate-600 place-items-center p-5'>
          <div className='h-[250px] relative shadow-md shadow-primary-color w-[250px] rounded-md p-2 bg-gradient-to-br from-violet-500 to-fuchsia-500'>
            <img 
            src={avatar}
            className='object-cover h-full w-full rounded-md'
            />  
            <div className='absolute bg-slate-800 h-3 -left-7 rotate-45 bottom-4  w-24'></div>
            <div className='absolute bg-slate-800 h-3 -right-7 rotate-45 top-4  w-24'></div>
            <div className='absolute top-2 h-7 w-7 left-2'>
              <img 
              src={drplogo}
              className='object-cover drop-shadow-customWhite h-full w-full rounded-md'
              />  
            </div>

          </div>
          <div className='text-slate-200 font-semibold text-xl mt-3'>Lazy Cat at Work</div>
          <div className='text-white shadow-sm shadow-white px-1 mt-2 bg-violet-600 rounded-full font-semibold text-sm '>"Digital Artist"</div>
          <div className=' text-center w-full mt-7 text-sm h-56 text-slate-200 '>
            "Welcome to my creative space! I'm <span className='text-fuchsia-500'>Catherine</span>, a digital artist passionate about bringing ideas to life through vibrant visuals and captivating designs. Here, you'll find a collection of my work, from illustrations to concept art, showcasing my journey and artistic vision. Let's create something extraordinary together!"
          </div>
        </div>
        <div className='w-3/4 h-full px-5 py-2'>
          <div className='text-3xl font-bold text-slate-800'>Dashboard</div>
            <div className='justify-center flex w-full mt-2  p-2'>
                <div className="stats bg-slate-50 shadow-lg shadow-slate-600">
                  <div className="stat">
                    <div className="stat-figure text-primary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block h-8 w-8 stroke-current">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                    </div>
                    <div className="stat-title text-slate-800">Art Likes</div>
                    <div className="stat-value text-violet-700 ">25.6K</div>
                    <div className="stat-desc text-slate-800">21% more than last month</div>
                  </div>

                  <div className="stat place">
                    <div className="stat-figure text-secondary">
                    <div className='mt-2'>
                      <box-icon type='solid' color='#9800FF' name='group' size='30px'></box-icon>
                    </div>
                  </div>
                  <div className="stat-title text-slate-800">Followers</div>
                  <div className="stat-value text-primary-color">600K</div>
                  <div className="stat-desc text-slate-800">this year</div>
                  </div>

                  <div className="stat">
                    <div className="stat-figure text-secondary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block h-8 w-8 stroke-current">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <div className="stat-title text-slate-800">Revenue</div>
                  <div className="stat-value text-secondary">2.6M</div>
                  <div className="stat-desc text-slate-800">this year</div>
                  </div>

                <div className="stat">
                  <div className="stat-figure text-secondary">
                    <div className="">
                      <div className="w-20 h-20 rounded-full">
                        <img src={rank} />
                      </div>
                    </div>
                  </div>
                  <div className="stat-value text-slate-900">86%</div>
                  <div className="stat-title text-slate-800">Guest Rating</div>
                  <div className="stat-desc text-secondary">As Dripstr Artist</div>
                </div>
              </div>
            </div>
            <div className='w-full flex gap-5'>
              <div className='w-1/3 px-4 mt-2'>
                <div className='w-72 h-52  bg-slate-50 rounded-md shadow-md shadow-slate-500'>
                  <div className='flex justify-between p-1 shadow-sm  w-full'>
                    <div className='text-slate-800 '>Top Likes</div>
                    <box-icon name='heart-circle' type='solid' color='#D91656'></box-icon>
                  </div>
                  <div className=' w-full flex rounded-md place-content-center place-items-center'>
                    <PieChart
                      width={500}
                      height={200}
                      className='-mt-10'
                        series={[
                          
                          {
                            data: data,
                            innerRadius: 30,
                            outerRadius: 110,
                            paddingAngle: 5,
                            cornerRadius: 4,
                            startAngle: -45,
                            endAngle: 225,
                            cx: 150,
                            cy: 150,
                          }
                          
                        ]}
                      />
                  </div>
                </div>
                <div className='w-72 h-52 mt-2  bg-slate-50 rounded-md shadow-md shadow-slate-500'>
                  <div className='flex justify-between p-1 shadow-sm  w-full'>
                    <div className='text-slate-800 '>Ownership</div>
                    <box-icon name='printer' type='solid' color='#4D077C'></box-icon>
                  </div>
                  <div className=' w-full flex rounded-md place-content-center place-items-center'>
                    <PieChart
                      width={500}
                      height={200}
                      className='-mt-10'
                        series={[
                          
                          {
                            data: data,
                            innerRadius: 30,
                            outerRadius: 110,
                            paddingAngle: 5,
                            cornerRadius: 4,
                            startAngle: -45,
                            endAngle: 225,
                            cx: 150,
                            cy: 150,
                          }
                          
                        ]}
                      />
                  </div>
                </div>
              </div>
              <div className='w-3/4 relative place-items-center  p-3'>
              <div className="slider h-[400px] w-[300px] rounded-md justify-center flex   bg-custom-purple p-2">
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className={`slide relative rounded-md bg-slate-950 ${index === currentIndex ? 'block' : 'hidden'}`}
                            >
                                <img
                                    src={slide.photo}
                                    alt={`Placeholder image ${index + 1} with a solid color background and text indicating it is a placeholder image`}
                                    className="w-full h-full rounded-md object-cover"
                                    width="300"
                                    height="300"
                                />
                                <div className='absolute h-32 -bottom-10 left-10 p-2 w-full bg-slate-800 bg-opacity-80 border-[2px] rounded-tl-3xl border-custom-purple rounded-md '>
                                  <div className='text-xl  absolute text-slate-100 font-bold'> {slide.name} </div>
                                  <div className='text-sm text-slate-200 mt-7 ml-5'>"{slide.description}"</div>
                                </div>
                                <div className='absolute bg-slate-100 place-items-center place-content-center  bg-opacity-80 h-20 w-32 rounded-md rounded-bl-3xl   -top-5 -right-16 border-custom-purple border-[2px]'>
                                  <div className=' text-2xl text-slate-800 place-items-center flex gap-2'>{slide.likes}  <box-icon name='heart-circle' type='solid' size='30px' color='#D91656'></box-icon></div>
                                </div>
                            </div>
                        ))}
                    </div>

                
              </div>
            </div>
        </div>

      </div>
    </div>
    
  );
}

export default MerchantDashboard;
