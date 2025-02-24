import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/constants/supabase";
import chatSupportData from "@/constants/chatSupportData.json";

const ChatSupport = ({ onClose, profile }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (profile?.id) {
      fetchChatHistory();
    }
  }, [profile]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, currentQuestion]);

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
        message: "I'm sorry, I didn't understand that. Can you please rephrase?",
        is_bot: true,
      };
      await saveMessage(defaultMessage.message, true);
    }
  };

  const handleStartOver = () => {
    setCurrentQuestion(null); // Reset to show initial questions
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp); // Parse the timestamp
    const hours = date.getHours(); // Get hours (0-23)
    const minutes = date.getMinutes(); // Get minutes (0-59)

    // Format hours and minutes to always be two digits
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");

    // Return time in HH:MM format
    return `${formattedHours}:${formattedMinutes}`;
  };

  const renderMessages = () => {
    return messages.map((msg, index) => {
      const formattedTime = formatTime(msg.created_at); // Format the timestamp

      return (
        <div key={index} className={`chat ${msg.is_bot ? "chat-start" : "chat-end"}`}>
          {msg.is_bot && (
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="DripCat"
                  src={require("@/assets/emote/success.png")}
                />
              </div>
            </div>
          )}
          <div className="chat-header">
            {msg.is_bot ? "DripCat" : "You"}
            <time className="text-xs opacity-50 ml-2">{formattedTime}</time>
          </div>
          <div className={`chat-bubble ${msg.is_bot ? "bg-primary-color text-white" : "bg-secondary-color text-white"}`}>
            {msg.message}
          </div>
        </div>
      );
    });
  };

  const renderSuggestedQuestions = () => {
    const questions = currentQuestion
      ? currentQuestion.followUp || [] // Fallback to an empty array if followUp is undefined
      : chatSupportData || []; // Fallback to an empty array if chatSupportData is undefined

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
        {currentQuestion && ( // Show "Start Over" only if there's a current question
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
    <div className="fixed flex items-center justify-center  bg-opacity-50 z-50">
      <div className="font-sans sm:w-full max-w-[60.40rem] h-[40rem] bg-slate-50 rounded-lg shadow-lg mx-4 flex flex-col overflow-hidden">
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