import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";

const Notification = () => {

  const notifications = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    title: `Notif ${index + 1}`,
    message: 'Limited Time Only!',
    imageUrl: 'https://via.placeholder.com/80',
    link: `/store/${index + 1}`, 
  }));

  const promos =({
    title: 'promos',
    link:'/store/',
  });

  const orders = ({
    title:'orders',
    link:'/order/',
  });

  return (
    <div className="flex flex-col p-4 bg-slate-200 ml-10">
      <div className='flex flex-row'>
        <h2 className="text-2xl font-bold mb-4 text-primary-color self-center">Notifications</h2>
      <div className='flex flex-row justify-around content-start w-80'>
      <Link to={promos.link}className='flex items-center bg-white p-3 mb-4 rounded-lg shadow hover:bg-gray-100'>
      <div className='flex flex-row rounded w-50'>
          <FontAwesomeIcon icon={faVolumeHigh} size='lg' className='mr-2 self-center text-black'/>  
          <h2 className="text-1xl font-bold text-primary-color">Promos</h2>
        </div>
      </Link>
      <div className='indicator'>
      <Link to={orders.link}className='flex items-center bg-white p-3 ml-5 mb-4 rounded-lg shadow hover:bg-gray-100'>
      <div className='flex flex-row rounded w-50'>
           <FontAwesomeIcon icon={faBox} size='lg' className='mr-2 self-center text-black'/>  
          <h2 className="text-1xl font-bold text-primary-color">Orders</h2>
        </div>
      </Link>
        </div>
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

export default Notification;
