import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/constants/supabase";
import chatSupportData from "@/constants/chatSupportData.json";

const ChatSupport = ({ onClose, profile }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isBotTyping, setIsBotTyping] = useState(false); // Track bot typing state
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null); // Ref for the input field

  useEffect(() => {
    if (profile?.id) {
      fetchChatHistory();
    }
  }, [profile]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, currentQuestion, isBotTyping]);

  useEffect(() => {
    // Focus on the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const fetchChatHistory = async () => {
    const { data, error } = await supabase
      .from("chatbot_history")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching chat history:", error);
    } else {
      setMessages(Array.isArray(data) ? data : []);
    }
  };

  const saveMessage = async (message, isBot) => {
    const { data, error } = await supabase
      .from("chatbot_history")
      .insert([{ message, is_bot: isBot, user_id: profile.id }])
      .select();

    if (error) {
      console.error("Error saving message:", error);
    } else {
      if (Array.isArray(data) && data.length > 0) {
        setMessages((prev) => [...prev, data[0]]);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { message: input, is_bot: false };
    await saveMessage(input, false);
    setInput("");

    // Focus on the input field after sending a message
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Simulate bot typing
    setIsBotTyping(true);

    setTimeout(async () => {
      let response = null;
      if (currentQuestion) {
        response = currentQuestion.followUp?.find(
          (q) => q.question.toLowerCase() === input.toLowerCase()
        );
      } else {
        response = chatSupportData?.find(
          (q) => q.question.toLowerCase() === input.toLowerCase()
        );
      }

      if (response) {
        const botMessage = { message: response.answer, is_bot: true };
        await saveMessage(response.answer, true);
        setCurrentQuestion(response);
      } else {
        const defaultMessage = {
          message:
            "I'm sorry, I didn't understand that. Can you please rephrase?",
          is_bot: true,
        };
        await saveMessage(defaultMessage.message, true);
      }

      
      setIsBotTyping(false);
    }, 3000); 
  };

  const handleStartOver = () => {
    setCurrentQuestion(null);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}`;
  };

  const renderMessages = () => {
    if (messages.length > 0) {
      return messages.map((msg, index) => {
        const formattedTime = formatTime(msg.created_at);

        return (
          <div
            key={index}
            className={`chat ${msg.is_bot ? "chat-start" : "chat-end"}`}
          >
            {msg.is_bot && (
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="DripCat"
                    src={require("@/assets/emote/success.png")}
                    className="object-contain"
                  />
                </div>
              </div>
            )}
            <div className="chat-header">
              {msg.is_bot ? "DripCat" : "You"}
              <time className="text-xs opacity-50 ml-2">{formattedTime}</time>
            </div>
            <div
              className={`chat-bubble ${
                msg.is_bot
                  ? "bg-primary-color text-white"
                  : "bg-secondary-color text-white"
              }`}
            >
              {msg.message}
            </div>
          </div>
        );
      });
    } else {
      return (
        <div className="flex h-full w-full items-center justify-center text-3xl font-bold flex-col gap-4">
          <div className="h-40 w-40 rounded-full">
            <img
              alt="DripCat"
              src={require("@/assets/emote/success.png")}
              className="object-contain"
            />
          </div>
          Need Support? DripCat is Here
        </div>
      );
    }
  };

  const renderSuggestedQuestions = () => {
    const questions = currentQuestion
      ? currentQuestion.followUp || []
      : chatSupportData || [];

    return (
      <>
        {questions.map((q, index) => (
          <button
            key={index}
            onClick={() => setInput(q.question)}
            className="btn btn-outline btn-sm m-1"
          >
            {q.question}
          </button>
        ))}
        {currentQuestion && (
          <button
            onClick={handleStartOver}
            className="btn btn-outline btn-sm m-1"
          >
            Start Over
          </button>
        )}
      </>
    );
  };

  return (
    <div className="fixed flex items-center justify-center bg-opacity-50 z-50 font-[iceland]">
      <div className="sm:w-full max-w-[60.40rem] h-[40rem] bg-slate-50 rounded-lg shadow-lg mx-4 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-2 border-b border-gray-200 bg-white">
          <div className="flex flex-col items-center justify-center h-6 w-6">
            <img
              src={require("@/assets/images/blackLogo.png")}
              alt="Dripstr"
              className="object-contain"
            />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Chat Support</h2>
          <button
            onClick={onClose}
            className="flex-none flex items-center justify-center w-8 h-8 rounded-md text-slate-400 hover:text-slate-800 duration-300 transition-all border border-slate-400 hover:border-slate-800"
          >
            <FontAwesomeIcon icon={faX} />
          </button>
        </div>

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto custom_scrollbar p-4 bg-gray-100"
        >
          {renderMessages()}
          {isBotTyping && (
            <div className="chat chat-start">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="DripCat"
                    src={require("@/assets/emote/success.png")}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="chat-header">DripCat</div>
              <div className="chat-bubble bg-primary-color p-2 text-white">
                <Typing />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-gray-200">
          <div className="flex flex-wrap">{renderSuggestedQuestions()}</div>
        </div>

        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-color"
              ref={inputRef} // Ref for the input field
            />
            <button
              onClick={handleSendMessage}
              className="btn bg-primary-color text-white hover:bg-primary-color-dark"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSupport;

const Typing = () => (
  <div className="flex items-center h-6 space-x-1">
    <div className="w-2 h-2 drop-shadow-md bg-white rounded-full animate-bounce transition-all"></div>
    <div className="w-2 h-2 drop-shadow-md bg-white rounded-full animate-bounce transition-all delay-300"></div>
    <div className="w-2 h-2 drop-shadow-md bg-white rounded-full animate-bounce transition-all delay-500"></div>
  </div>
);