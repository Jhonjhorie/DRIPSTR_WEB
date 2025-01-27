import React from "react";
import ArtistSideBar from "../../Component/ArtistSB";
import avatar from "../../../../assets/car.jpg";
import drplogo from "../../../../assets/logoBlack.png";
import rank from "../../../../assets/starrank.png";
import art1 from "../../../../assets/art1.jpg";
import art2 from "../../../../assets/art2.jpg";
import art3 from "../../../../assets/art3.jpg";
import { PieChart } from "@mui/x-charts/PieChart";
import { useNavigate } from "react-router-dom";
const { useState, useEffect } = React;
function MerchantDashboard() {
  const navigate = useNavigate();
  const [selectedMessage, setSelectedMessage] = useState(null);

  const messages = [
    { id: 1, name: "Alice", message: "Hello, how are you?" },
    { id: 2, name: "Bob", message: "Hi, what's up?" },
    { id: 3, name: "Charlie", message: "Good morning!" },
    {
      id: 4,
      name: "David",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    { id: 5, name: "Eve", message: "How's it going?" },
    { id: 6, name: "Frank", message: "Nice to meet you!" },
    { id: 7, name: "Grace", message: "What's new?" },
    { id: 8, name: "Hank", message: "Good evening!" },
    { id: 9, name: "Ivy", message: "How have you been?" },
    { id: 10, name: "Jack", message: "Hello there!" },
  ];
  return (
    <div className="h-full w-full bg-slate-300 custom-scrollbar  ">
      <div className="w-[96.5%] h-20 fixed z-20  top-24 bg-violet-600 shadow-md px-16 ">
        <div className="w-full h-full flex gap-3 p-2">
          <div className="flex justify-between w-full ">
            <div className="flex gap-2">
              <div className="h-full w-24 rounded-md border bg-gradient-to-br from-violet-500 to-fuchsia-500 p-1">
                <img
                  src={avatar}
                  alt="Shop Logo"
                  className="drop-shadow-custom h-full w-full object-cover rounded-md"
                />
              </div>
              <div className="">
                <h1 className="text-[20px] pt-1 font-semibold text-slate-100">
                  Cat perspective
                </h1>
                <h2 className="text-[13px]  text-slate-50">Digital Art</h2>
              </div>
              <div></div>
            </div>

            <div className="flex gap-5">
              <div className="h-full w-20 ">
                <div className="h-full w-20 justify-items-center ">
                  <div className="flex align-middle gap-2  justify-center ">
                    <div className="text-2xl text-slate-100">10</div>
                    <div className="pt-1">
                      {" "}
                      <box-icon
                        color="white"
                        size="100%"
                        name="group"
                        type="solid"
                      ></box-icon>
                    </div>
                  </div>

                  <div className="text-slate-50 text-sm">Followers</div>
                </div>
              </div>
              <div className="h-full w-20 ">
                <div className="h-full w-20 justify-items-center ">
                  <div className="flex align-middle gap-2  justify-center ">
                    <div className="text-2xl text-slate-100">2</div>
                    <div className="pt-1">
                      {" "}
                      <box-icon
                        color="white"
                        type="solid"
                        name="book-heart"
                      ></box-icon>
                    </div>
                  </div>

                  <div className="text-slate-50  text-sm">Arts</div>
                </div>
              </div>

              <div className="h-full w-20 duration-300 hover:scale-95 cursor-pointer">
                <div className="h-full w-20 justify-items-center bg-slate-50 bg-opacity-25 shadow-md rounded-md ">
                  <div className="flex align-middle gap-2  justify-center ">
                    <div className="pt-1">
                      {" "}
                      <box-icon
                        color="white"
                        type="solid"
                        name="edit"
                      ></box-icon>
                    </div>
                  </div>

                  <div className="text-slate-50  text-sm">Post Art</div>
                </div>
              </div>
              <div className="h-full w-20 duration-300 hover:scale-95 cursor-pointer">
                <div className="h-full w-20 justify-items-center bg-slate-900 bg-opacity-30 shadow-md rounded-md ">
                  <div className="flex align-middle gap-2  justify-center ">
                    <div className="pt-1">
                      {" "}
                      <box-icon
                        color="white"
                        type="solid"
                        name="user-pin"
                      ></box-icon>
                    </div>
                  </div>

                  <div className="text-slate-50  text-sm">Account</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full h-full bg-slate-600 ">
        {/*messages*/}
        <div className="p-2 fixed mt-20 pb-48 bg-purple-500 h-full w-1/5 overflow-hidden overflow-y-scroll custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-slate-50 w-full mb-2  p-2 cursor-pointer"
              onClick={() => setSelectedMessage(msg)}
            >
              <div className="flex justify-items-center gap-2">
                <div className="h-10 min-w-10 mt-1 rounded-full bg-slate-200"></div>
                <div className="overflow-hidden">
                  <div className="font-bold">{msg.name}</div>
                  <div className="truncate">{msg.message}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/*main div*/}
        <div className="bg-slate-300 shadow-md  mt-20 overflow-hidden h-full w-full justify-items-center p-2">
          <div className="bg-slate-50 rounded-sm w-[50%] m-5 p-4 h-auto">
            <div className="w-full place-items-center flex justify-between">
              <div className="flex place-items-center gap-3">
                <div className="h-14 w-14 rounded-full border bg-gradient-to-br from-violet-500 to-fuchsia-500 p-1">
                  <img
                    src={avatar}
                    alt="Shop Logo"
                    className="drop-shadow-custom h-full w-full object-cover rounded-full"
                  />
                </div>
                <h1 className="text-xl font-semibold text-custom-purple">
                  Cat perspective
                </h1>
              </div>
              <div className="hover:scale-105 duration-200 cursor-pointer">
                <box-icon type="solid" name="edit"></box-icon>
              </div>
            </div>
            <div className="text-slate-800 text-sm px-5 mt-2 ">
              {" "}
              19-year-old Robin Crauwels has two passions: singing and playing
              the piano. While Robin has only been playing the piano for two
              years, he decided to perform his Blind Audition song on the piano.
              And it paid off! Which performance by Robin is your favorite? Let
              us know in the comments below{" "}
            </div>
            <div className="w-full place-self-center h-80 mt-2 bg-slate-500">
              <img
                src={art2}
                alt="Shop Logo"
                className="drop-shadow-custom h-full w-full object-none"
              />
            </div>
          </div>
          <div className="bg-slate-50 rounded-sm w-[50%] m-5 p-4 h-auto">
            <div className="w-full place-items-center flex justify-between">
              <div className="flex place-items-center gap-3">
                <div className="h-14 w-14 rounded-full border bg-gradient-to-br from-violet-500 to-fuchsia-500 p-1">
                  <img
                    src={avatar}
                    alt="Shop Logo"
                    className="drop-shadow-custom h-full w-full object-cover rounded-full"
                  />
                </div>
                <h1 className="text-xl font-semibold text-custom-purple">
                  Cat perspective
                </h1>
              </div>
              <div className="hover:scale-105 duration-200 cursor-pointer">
                <box-icon type="solid" name="edit"></box-icon>
              </div>
            </div>
            <div className="text-slate-800 text-sm px-5 mt-2 ">
              {" "}
              19-year-old Robin Crauwels has two passions: singing and playing
              the piano. While Robin has only been playing the piano for two
              years, he decided to perform his Blind Audition song on the piano.
              And it paid off! Which performance by Robin is your favorite? Let
              us know in the comments below{" "}
            </div>
            <div className="w-full place-self-center  h-80  mt-2 bg-slate-500">
              <img
                src={art1}
                alt="Shop Logo"
                className="drop-shadow-custom h-full w-full object-none "
              />
            </div>
          </div>
        </div>
        <div className="bg-slate-900 mt-20 h-full fixed right-3 w-1/6">
          <h1 className="text-center p-2">Partnered merchant</h1>
        </div>
      </div>
      {/*messages*/}
      {selectedMessage && (
        <div className="fixed h-96 bottom-1 w-96 left-80 bg-white  rounded-sm drop-shadow-custom overflow-y-auto">
          <h2 className="text-xl p-2 font-bold text-slate-800 mb-2">
            {selectedMessage.name}
          </h2>
          <div className="h-auto p-2 overflow-y-scroll">
            <div className="chat chat-start">
              <div className="chat-bubble">{selectedMessage.message}</div>
            </div>
          </div>

          <div className="w-full absolute bottom-1 p-2 flex">
            <textarea className="w-full text-sm text-slate-900 rounded-l-md bg-slate-300 "></textarea>
            <div className="p-2 bg-purple-600 rounded-r-md hover:scale-95 duration-200 cursor-pointer">
              <box-icon name="send" type="solid"></box-icon>
            </div>
          </div>
          <button
            className=" bg-violet-500 hover:scale-95 duration-200 text-white px-2 rounded absolute top-2 right-2"
            onClick={() => setSelectedMessage(null)}
          >
            X
          </button>
        </div>
      )}
    </div>
  );
}

export default MerchantDashboard;
