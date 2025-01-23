// import React from "react";
// import { Link } from 'react-router-dom';
// import OrderCard from "./orderCard";


// const AvatarCard = ({ user }) => {
//     return (
//         <div className="flex bg-secondary-color rounded-md group drop-shadow-lg w-full md:w-1/3 lg:w-1/3 h-24 md:h-72 lg:h-80 ">
//           <div className="flex flex-row gap-1 md:gap-2 p-2 md:p-3 w-full h-full justify-start">
//             {/* Avatar Section */}
//             <div className="flex flex-col gap-4 w-[20%] md:w-2/5 h-full">
//               <Link
//                 to="/"
//                 className="scale-100 duration-300 transition-all hover:scale-110 w-full h-full"
//               >
//                 <img
//                   src={typeof user.avatarIcon === 'string' ? user.avatarIcon : user.avatarIcon.uri}
//                   alt="User Avatar"
//                   className="z-20 duration-300 transition-all left-0 bottom-0 bg-gray-200 drop-shadow-lg rounded-b-lg hover:bottom-2 hover:scale-105 hover:-left-2 hover:rounded-2xl object-contain w-full h-full"
//                 />
//               </Link>
//             </div>
    
//             {/* User Info Section */}
//             <div className="flex flex-row md:flex-col justify-start w-full h-full space-x-4 md:space-x-2">
//             <div className="ml-1 flex flex-col w-[100%] ">
//               <p className="text-slate-50 text-lg font-bold">{user.name}</p>
//               <p className="text-slate-50 text-lg font-light">{user.title}</p>
//               </div>
//               <div className="w-[105%] h-full flex md:flex-col flex-row space-x-[-2.5rem] md:space-x-0 ">
//               <p className="text-slate-50 text-lg font-bold rotate-[270deg] md:rotate-0">Orders:</p>
//               <OrderCard orders={user.orders} />
//               </div>
//             </div>
//           </div>
//         </div>
//       );
//     };
// export default AvatarCard;
