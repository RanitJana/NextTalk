import React, { useCallback, useEffect, useState } from "react";
import { fetchChats } from "../api/chat.api.js";
import { useAuthStore } from "../store/useAuthStore.js";
import ChatUser from "../components/ChatUser.jsx";

const HomePage = () => {
  const currentUser = useAuthStore().authUser.user;

  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const handleBack = () => {
    setSelectedChat(null);
  };

  const getAllChats = useCallback(async () => {
    const info = await fetchChats();
    if (info?.chats) {
      setChats(info.chats);
    }
  }, []);

  useEffect(() => {
    getAllChats();
  }, [getAllChats]);

  return (
    <div className="h-vh flex sm:flex-row flex-col bg-base text-base-content h-full">
      {/* Chat List Sidebar */}
      <aside
        className={`w-[100%] sm:max-w-[20rem] border-r border-base-300 flex flex-col h-full ${
          selectedChat ? "hidden sm:flex" : "flex"
        }`}
      >
        <div className="p-4 border-b border-base-300 font-bold text-lg bg-base-200">
          Chats
        </div>
        <div className="relative h-full">
          <div className="overflow-y-auto h-full w-full flex-1 absolute left-0 top-0">
            {chats.map((chat) => (
              <ChatUser key={chat._id} chat={chat} currentUser={currentUser} />
            ))}
          </div>
        </div>
      </aside>

      {/* Chat Area */}
      <main
        className={`flex-1 flex flex-col ${
          selectedChat ? "flex" : "hidden sm:flex"
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-base-300 bg-base-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Back button for small screens */}
            <button
              className="sm:hidden btn btn-sm btn-ghost"
              onClick={handleBack}
            >
              ⬅️
            </button>
            <div className="font-semibold">
              {selectedChat ? selectedChat.name : "Select a chat"}
            </div>
          </div>
          <div className="text-sm text-base-content/70">Online</div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-base-100">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className={`max-w-[70%] p-3 rounded-xl ${
                idx % 2 === 0
                  ? "bg-primary text-primary-content self-end ml-auto"
                  : "bg-base-300 self-start"
              }`}
            >
              <p className="text-sm">Message {idx + 1}</p>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-base-300 bg-base-200">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message"
              className="input input-bordered w-full"
            />
            <button className="btn btn-primary">Send</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
