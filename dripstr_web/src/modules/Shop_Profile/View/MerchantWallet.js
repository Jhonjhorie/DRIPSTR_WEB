import React from "react";
import SideBar from "../Component/Sidebars";
import streetBG from "../../../assets/streetbg.png";
import starBG from "../../../assets/starDrp.png";
import sBG from "../../../assets/bgdrip.png";
import sample1 from "../../../assets/images/samples/2.png";
import cust1 from "../../../assets/shop/erica.jpg";
import cust2 from "../../../assets/shop/sample2.jpg";
import cust3 from "../../../assets/shop/nevercry.jpg";
import drp from "../../../assets/DrpTxt.png";
import "../Component/Style.css";
import logo from "../../../assets/shop/shoplogo.jpg";
import sample3 from "../../../assets/images/samples/5.png";
import sample2 from "../../../assets/images/samples/10.png";

const { useState } = React;
const CustnameData = [
  {
    id: 1,
    photo: cust1,
    order: sample2,
    name: "Erina Mae",
    message: "Just order an Item.",
    status: "sent",
    orderRating: "to rate",
    timeSent: "2m ago",
    reply: " Thank you for purchasing on our store.",
    follow: "Followers",
  },
  {
    id: 2,
    photo: cust2,
    order: sample3,
    name: "Paolo",
    message: "Just order an Item.",
    status: "read",
    timeSent: "1h ago",
    orderRating: "4",
    follow: "Followers",
    message2: "The product is good<3",
    reply: " Thank you for purchasing on our store.",
  },
  {
    id: 3,
    photo: cust3,
    order: sample1,
    name: "Queen",
    message: "Just order an Item.",
    status: "sent",
    timeSent: "1m ago",
    orderRating: "to rate",
    reply: " Thank you for purchasing on our store.",
    follow: "Customer",
  },
];

function MerchantWallet() {
 

  return (
    <div className="h-full w-full overflow-y-scroll bg-slate-300 custom-scrollbar ">
      <div className="absolute mx-3 right-0 z-20">
        <SideBar />
      </div>

      <div className="w-full  h-full bg-slate-300 md:px-10 lg:px-16">
        <div className="w-full  h-full bg-slate-100 flex">
          <div className="w-2/5  bg-gradient-to-br from-violet-500 to-fuchsia-500 p-1 h-full shadow-black">
            <div className="text-2xl font-semibold p-2 py-5 text-white flex place-items-center justify-between">
              <label>Messages</label>
              <box-icon
                type="solid"
                color="#4D077C"
                name="message-square-dots"
              ></box-icon>
            </div>
            <div className="h-[500px] overflow-hidden overflow-y-scroll rounded-md  bg-slate-100 bg-opacity-40 glass shadow-black w-full shadow-inner pt-2 pl-2">
              {sortedData.map((user) => (
                <div
                  onClick={() => handleChatClick(user)}
                  key={user.id}
                  className={`relative hover:scale-95 duration-300 cursor-pointer h-auto mb-1 w-full flex gap-2 p-1 rounded-md shadow-md ${
                    user.status === "sent" ? "bg-[#563A9C] glass" : "bg-white"
                  }`}
                >
                  <div
                    className={`h-12 w-12 ${
                      user.status === "sent"
                        ? "border-[2px]  border-primary-color rounded-full"
                        : "border-[2px]  border-slate-400 rounded-full"
                    }`}
                  >
                    <img
                      src={user.photo}
                      alt={`Profile picture of ${user.name}`}
                      className=" h-full w-full object-cover rounded-full"
                      sizes="100%"
                    />
                  </div>
                  <div>
                    <div
                      className={`font-semibold ${
                        user.status === "sent"
                          ? "text-white"
                          : "text-slate-700 "
                      }`}
                    >
                      {" "}
                      {user.name}{" "}
                    </div>
                    <div
                      className={`text-sm ${
                        user.status === "sent"
                          ? "text-white"
                          : "text-slate-700 "
                      }`}
                    >
                      {" "}
                      {user.message}{" "}
                    </div>
                  </div>
                  <div className="absolute top-1 text-sm  right-2">
                    {" "}
                    {user.timeSent}{" "}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full relative place-content-center bg-gradient-to-bl from-violet-500 to-fuchsia-500 h-full">
            <div className=" absolute z-10 top-0 right-0">
              <img
                src={streetBG}
                className="drop-shadow-customWhite h-full w-full object-cover rounded-full"
                sizes="100%"
              />
            </div>
            <div className=" absolute z-0 bottom-0 left-0">
              <img
                src={starBG}
                className="drop-shadow-customWhite  h-full w-full object-cover rounded-full"
                sizes="100%"
              />
            </div>
            <div className=" top-32 z-0 absolute">
              <img
                src={drp}
                className="drop-shadow-customWhite  h-full w-full object-cover rounded-full"
                sizes="100%"
              />
            </div>
            {/*
                <div className=' top-0 z-0 w-full h-full absolute'>
                    <img
                        src={sBG}
                        className="  h-full w-full object-fill"
                        sizes="100%"
                    />
                </div>*/}
            {selectedUser && (
              <div
                className={`w-full relative z-10 bg-violet-100 h-full flex ${
                  isClosing ? "fade-out" : "fade-in"
                }`}
              >
                <div className="w-full h-auto">
                  <div className="bg-white relative z-10 shadow-sm shadow-slate-400 w-full h-auto p-2 px-5 py-3 flex place-items-center justify-between gap-2">
                    <div className="flex gap-2 place-items-center">
                      <div className="h-12 w-12 border-[2px]  border-primary-color rounded-full">
                        <img
                          src={selectedUser.photo}
                          className=" h-full w-full object-cover rounded-full"
                          sizes="100%"
                        />
                      </div>
                      <label className="text-slate-800 font-semibold">
                        {" "}
                        {selectedUser.name}{" "}
                      </label>
                    </div>
                    <div
                      onClick={handleCloseChat}
                      className="hover:scale-95 duration-300 cursor-pointer rounded-md p-1 justify-center flex"
                    >
                      <box-icon name="message-square-x" color="#000"></box-icon>
                    </div>
                  </div>

                  <div className="h-[500px] w-full bg-white overflow-y-scroll custom-scrollbar p-2 overflow-hidden">
                    {/* Messages will show here */}

                    {selectedUser.message && (
                      <div className="chat chat-start">
                        <div className="mb-1 ml-14">
                          <div className="chat-header text-slate-800">
                            {selectedUser.name}
                          </div>
                          {selectedUser.order && (
                            <div
                              className="h-24 w-24 bg-slate-100 shadow-md shadow-slate-600 rounded-md border-[1px] border-primary-color
                                             "
                            >
                              <img
                                src={selectedUser.order}
                                alt="Order Photo"
                                className="object-cover p-1 h-full w-full"
                              />
                            </div>
                          )}
                        </div>{" "}
                        <br />
                        <div className="flex gap-2">
                          <div className="chat-image avatar">
                            <div className="w-10 mb-5 rounded-full">
                              <img
                                alt="Customer Profile"
                                src={selectedUser.photo}
                              />
                            </div>
                          </div>
                          <div className="w-80 ml-2  ">
                            <div className="chat-bubble">
                              {selectedUser.message}
                            </div>
                            <div className="chat-footer opacity-50">
                              sent 10:30pm
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Shop response */}
                    {selectedUser.reply && (
                      <div className="chat chat-end">
                        <div className="chat-image avatar">
                          <div className="w-10 rounded-full border-2 border-primary-color">
                            <img alt="Shop Profile" src={shopData.photo} />
                          </div>
                        </div>
                        <div className="chat-header text-slate-800">
                          {shopData.name}
                        </div>
                        <div className="chat-bubble bg-custom-purple text-slate-200">
                          {selectedUser.reply}
                        </div>
                        <div className="chat-footer opacity-50">
                          Seen at 12:46
                        </div>
                      </div>
                    )}

                    {selectedUser.message2 && (
                      <div className="chat chat-start">
                        <div className="chat-image avatar">
                          <div className="w-10 rounded-full">
                            <img
                              alt="Customer Profile"
                              src={selectedUser.photo}
                            />
                          </div>
                        </div>
                        <div className="chat-header text-slate-800">
                          {selectedUser.name}
                        </div>
                        <div className="chat-bubble">
                          {selectedUser.message2}
                        </div>
                        <div className="chat-footer opacity-50">
                          sent 10:36pm
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="h-auto w-full flex gap-2 p-1 border-t-2 border-slate-400 bg-slate-100">
                    <textarea
                      placeholder="Type your message here..."
                      type="text"
                      className="bg-slate-100 w-5/6 h-14 border-custom-purple border-[0.5px] shadow-inner shadow-slate-400 rounded-md text-slate-800 p-2"
                    ></textarea>
                    <button className=" iceland-regular text-xl text-slate-800 shadow shadow-black glass rounded-md duration-300 place-items-center flex gap-2 px-5 hover:bg-slate-400 hover:scale-95 ">
                      <box-icon
                        color="#000"
                        type="solid"
                        name="send"
                      ></box-icon>
                      SENT
                    </button>
                  </div>
                </div>
                <div className="w-2/5 h-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-md shadow-slate-500 ">
                  <div className="w-full h-auto p-2 place-items-center ">
                    <div className="bg-slate-100 mt-16 w-32 h-32 rounded-full border-[2px]  border-slate-800 ">
                      <img
                        src={selectedUser.photo}
                        alt="Shop Logo"
                        className="drop-shadow-custom object-cover rounded-full h-full w-full"
                      />
                    </div>
                    <div className="mt-2 text-white font-semibold text-xl">
                      {selectedUser.name}
                    </div>
                    <div className="mt-2 text-white font-semibold text-sm">
                      {selectedUser.follow}
                    </div>
                    <div className="border-t-2 border-slate-600 w-full mt-5"></div>
                    <div className="w-full">
                      <div className="text-slate-200"> Recent Rating: </div>
                      <div className="h-[300px] w-full pl-2 pt-2 bg-slate-200 rounded-md shadow-inner shadow-black overflow-hidden overflow-y-scroll">
                        <div className="bg-sky-50 h-auto p-2 place-items-center shadow-md w-full rounded-sm hover:bg-primary-color duration-300 flex gap-2">
                          <div className="bg-slate-300 h-14 w-14 rounded-md ">
                            <img
                              className="object-cover h-full w-full"
                              src={selectedUser.order}
                            />
                          </div>
                          {selectedUser.orderRating && (
                            <div className="text-slate-800 place-items-center flex gap-2">
                              Rating:
                              <span
                                className={`${
                                  selectedUser.orderRating === "to rate"
                                    ? "text-slate-800"
                                    : "text-yellow-500"
                                } text-sm`}
                              >
                                {selectedUser.orderRating}
                              </span>
                              <box-icon
                                type="solid"
                                color={
                                  selectedUser.orderRating === "to rate"
                                    ? "#FFFFFF"
                                    : "#EB8317"
                                }
                                name="star"
                              ></box-icon>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MerchantWallet;
