import React from "react";
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faBox, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";


const reminder = () => {

    const notifications = Array.from({ length: 10 }, (_, index) => ({
      id: index + 1,
      title: `Notif ${index + 1}`,
      message: 'Limited Time Only!',
      imageUrl: 'https://via.placeholder.com/80',
      link: `/mall/`, 
    }));
  
    const voucherReminder =({
      title: 'Voucher Reminder',
      link:'/voucherReminder/',
    });
  
    const services = ({
      title:'services',
      link:'/services/',
    });
  
    return (
      <div className="flex flex-col p-4 bg-slate-200 ml-10">
        <div className='flex flex-row'>
          <h2 className="text-2xl font-bold mb-4 text-primary-color self-center">Notifications</h2>
        <div className='flex flex-row justify-around content-start w-90'>
        <Link to={voucherReminder.link}className='flex items-center bg-white p-3 mb-4 ml-3 rounded-lg shadow hover:bg-gray-100'>
        <div className='flex flex-row rounded'>
            <FontAwesomeIcon icon={faVolumeHigh} size='lg' className='mr-2 self-center text-black'/>  
            <h2 className="text-1xl font-bold text-primary-color">All</h2>
          </div>
        </Link>
        <div className='indicator'>
        <Link to={voucherReminder.link}className='flex items-center bg-white p-3 ml-3 mb-4 rounded-lg shadow hover:bg-gray-100'>
        <div className='flex flex-row rounded w-50'>
             <FontAwesomeIcon icon={faBox} size='lg' className='mr-2 self-center text-black'/>  
            <h2 className="text-1xl font-bold text-primary-color">Voucher Reminder</h2>
          </div>
        </Link>
          </div>
          <Link to={services.link}className='flex items-center bg-white p-3 ml-3 mb-4 rounded-lg shadow hover:bg-gray-100'>
        <div className='flex flex-row rounded w-50'>
             <FontAwesomeIcon icon={faBox} size='lg' className='mr-2 self-center text-black'/>  
            <h2 className="text-1xl font-bold text-primary-color">Services</h2>
          </div>
        </Link>
        </div>
        </div>
        
  
        {notifications.map((notif) => (
          <Link to={notif.link} key={notif.id} className="flex items-center bg-white p-4 mb-4 rounded-lg shadow hover:bg-gray-100">
            <img
              src={notif.imageUrl}
              alt={`Notification ${notif.id}`}
              className="w-20 h-20 rounded"
            />
            <div className="flex-1 ml-4">
              <h3 className="text-lg font-semibold">{notif.title}</h3>
              <p className="text-gray-600">{notif.message}</p>
            </div>
          </Link>
        ))}
      </div>
    );
  };
  
  export default reminder;