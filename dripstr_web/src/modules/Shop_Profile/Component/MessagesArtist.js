import React from "react";
const { useState, useEffect } = React;

function MessagesArtist() {
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
    <div>
      <div className="p-2 overflow-hidden w-full h-full  ">
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
      {/*messages*/}
      {selectedMessage && (
        <div className="fixed h-96 bottom-1 w-96 left-80 bg-slate-200 rounded-sm drop-shadow-custom ">
          <div className="flex justify-between  rounded-t-sm bg-slate-500 sticky top-0 z-10">
            <h2 className="text-xl sticky  top-0 z-10 p-2 font-bold text-slate-800 mb-2">
              {selectedMessage.name}
            </h2>
            <button
              className=" bg-violet-900 z-10 hover:scale-95 duration-200 mt-1 text-white px-2 rounded absolute top-2 right-2"
              onClick={() => setSelectedMessage(null)}
            >
              X
            </button>
          </div>
          <div className="h-64 z-0 overflow-hidden overflow-y-scroll  p-2 ">
            <div className="chat chat-start">
              <div className="chat-bubble">{selectedMessage.message}</div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble">{selectedMessage.message}</div>
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble">{selectedMessage.message}</div>
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble">{selectedMessage.message}</div>
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble">{selectedMessage.message}</div>
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble">{selectedMessage.message}</div>
            </div>
          </div>

          <div className="w-full absolute bottom-1 p-2 flex">
            <textarea className="w-full text-sm text-slate-900 font-semibold p-1 rounded-l-md bg-slate-300 "></textarea>
            <div className="p-2 bg-purple-600 rounded-r-md px-3 hover:scale-95 duration-200 cursor-pointer">
              <box-icon name="send" type="solid"></box-icon>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessagesArtist;
