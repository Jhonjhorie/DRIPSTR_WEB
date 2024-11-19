import React from 'react';
import { Link } from 'react-router-dom';

const Notification = () => {

  const notifications = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    title: `Notif ${index + 1}`,
    message: 'Safe from 50 pesos',
    imageUrl: 'https://via.placeholder.com/80',
    link: `/store/${index + 1}`, 
  }));

  return (
    <div className="flex flex-col p-4 bg-slate-200 ml-10">
      <h2 className="text-2xl font-bold mb-4 text-primary-color">Notifications</h2>

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
