import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/constants/supabase";
import chatSupportData from "@/constants/chatSupportData.json";
import ReportDialog from "../../Products/components/reportModal";

const ChatSupport = ({ onClose, profile }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (profile?.id) {
      fetchChatHistory();
    }
  }, [profile]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, currentQuestion, isBotTyping]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const closeModalHelp = () => {
    const modal = document.getElementById("my_modal_Help");
    if (modal) {
      modal.close();
    }
  };

  const openModalHelp = () => {
    const modal = document.getElementById("my_modal_Help");
    if (modal) {
      modal.showModal();
    }
  };

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

    if (inputRef.current) {
      inputRef.current.focus();
    }

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
          message: "I'm sorry, I didn't understand that. Can you please rephrase?",
          is_bot: true,
        };
        await saveMessage(defaultMessage.message, true);
      }

      setIsBotTyping(false);
    }, 1500);
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

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  const renderMessages = () => {
    if (messages.length > 0) {
      return messages.map((msg, index) => {
        const formattedTime = formatTime(msg.created_at);

        return (
          <div
            key={index}
            className={`chat ${msg.is_bot ? "chat-start" : "chat-end"} mb-2`}
          >
            {msg.is_bot && (
              <div className="chat-image avatar">
                <div className="w-8 h-8 rounded-full">
                  <img
                    alt="DripCat"
                    src={require("@/assets/emote/success.png")}
                    className="object-contain"
                  />
                </div>
              </div>
            )}
            <div className="chat-header text-xs">
              {msg.is_bot ? "DripCat" : "You"}
              <time className="text-xs opacity-50 ml-1">{formattedTime}</time>
            </div>
            <div
              className={`chat-bubble text-sm ${
                msg.is_bot
                  ? "bg-primary-color text-white"
                  : "bg-secondary-color text-white"
              } max-w-[85%]`}
            >
              {msg.message}
            </div>
          </div>
        );
      });
    } else {
      return (
        <div className="flex h-full w-full items-center justify-center text-xl font-bold flex-col gap-4">
          <div className="h-24 w-24 rounded-full">
            <img
              alt="DripCat"
              src={require("@/assets/emote/success.png")}
              className="object-contain"
            />
          </div>
          <p className="text-center px-4">Need Support? DripCat is Here</p>
        </div>
      );
    }
  };

  const renderSuggestedQuestions = () => {
    const questions = currentQuestion
      ? currentQuestion.followUp || []
      : chatSupportData || [];

    return (
      <div className={`flex flex-wrap gap-1 ${questions.length > 0 ? "mb-2" : ""}`}>
        {questions.map((q, index) => (
          <button
            key={index}
            onClick={() => setInput(q.question)}
            className="btn btn-outline btn-xs px-2 py-1 text-xs"
          >
            {q.question}
          </button>
        ))}
        {currentQuestion && (
          <button
            onClick={handleStartOver}
            className="btn btn-outline btn-xs px-2 py-1 text-xs"
          >
            Start Over
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 font-[iceland]">
      <div className="w-full h-full sm:h-[90vh] sm:w-[90vw] sm:max-w-lg bg-slate-50 rounded-lg shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-2 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-6 w-6">
              <img
                src={require("@/assets/images/blackLogo.png")}
                alt="Dripstr"
                className="object-contain"
              />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Chat Support</h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-md text-slate-400 hover:text-slate-800 duration-300 transition-all border border-slate-400 hover:border-slate-800"
          >
            <FontAwesomeIcon icon={faX} size="xs" />
          </button>
        </div>

        {/* Chat area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto custom_scrollbar p-3 bg-gray-100"
        >
          {renderMessages()}
          {isBotTyping && (
            <div className="chat chat-start mb-2">
              <div className="chat-image avatar">
                <div className="w-8 h-8 rounded-full">
                  <img
                    alt="DripCat"
                    src={require("@/assets/emote/success.png")}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="chat-header text-xs">DripCat</div>
              <div className="chat-bubble bg-primary-color p-2 text-white max-w-[85%]">
                <Typing />
              </div>
            </div>
          )}
        </div>

        {/* Suggestions and help section */}
        <div className="px-3 py-2 bg-gray-100 border-t border-gray-200">
          <div className="flex justify-between items-center mb-1">
            <button
              onClick={toggleSuggestions}
              className="text-xs text-primary-color font-medium"
            >
              {showSuggestions ? "Hide suggestions" : "Show suggestions"}
            </button>
            <button
              onClick={() => {openModalHelp()}}
              className="btn btn-outline btn-xs py-1 px-2"
            >
              Help/Ticket
            </button>
          </div>
          {showSuggestions && renderSuggestedQuestions()}
        </div>

        {/* Input area */}
        <div className="p-2 border-t border-gray-200 bg-white">
          <div className="flex gap-1 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-primary-color"
              ref={inputRef}
            />
            <button
              onClick={handleSendMessage}
              className="btn btn-sm h-9 w-9 rounded-full bg-primary-color text-white hover:bg-primary-color-dark"
            >
              <FontAwesomeIcon icon={faPaperPlane} size="sm" />
            </button>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <dialog
        id="my_modal_Help"
        className="modal modal-bottom sm:modal-middle absolute z-[80] right-0 left-0 m-auto"
      >
        <ReportDialog
          onClose={closeModalHelp}
          accId={profile.id}
          type={"admin"}
        />
        <form
          method="dialog"
          className="modal-backdrop min-h-full min-w-full absolute"
        >
          <button onClick={closeModalHelp}></button>
        </form>
      </dialog>
    </div>
  );
};

export default ChatSupport;

const Typing = () => (
  <div className="flex items-center h-4 space-x-1">
    <div className="w-1.5 h-1.5 drop-shadow-md bg-white rounded-full animate-bounce transition-all"></div>
    <div className="w-1.5 h-1.5 drop-shadow-md bg-white rounded-full animate-bounce transition-all delay-300"></div>
    <div className="w-1.5 h-1.5 drop-shadow-md bg-white rounded-full animate-bounce transition-all delay-500"></div>
  </div>
);