import React, { useCallback, useEffect, useState } from "react";
import { fetchChats } from "../api/chat.api.js";
import { useAuthStore } from "../store/useAuthStore.js";
import ChatUser from "../components/ChatUser.jsx";
import { getChatName, getProfilePic } from "../utils/chat.js";
import ChatBox from "../components/ChatBox.jsx";

const HomePage = () => {
  const currentUser = useAuthStore().authUser.user;

  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);

  const [PicInfo, setPicInfo] = useState(null);
  const [chatName, setChatName] = useState(null);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);

    setChatName(getChatName(chat, currentUser.id));
    setPicInfo(getProfilePic(chat, currentUser.id));
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
        <div className="p-4 py-[1.63rem] flex items-center border-b border-base-300 font-bold text-lg bg-base-200">
          Chats
        </div>
        <div className="relative h-full">
          <div className="overflow-y-auto h-full w-full flex-1 absolute left-0 top-0 pt-2">
            {chats.map((chat) => (
              <ChatUser
                key={chat._id}
                chat={chat}
                currentUser={currentUser}
                onClick={() => handleSelectChat(chat)}
              />
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
            <div className="chatbox-chatImage w-[3rem] h-[3rem] rounded-full overflow-hidden">
              <img src={PicInfo} />
            </div>

            <div className="font-semibold">
              {selectedChat ? chatName : "Select a chat"}
            </div>
          </div>
          {selectedChat && !selectedChat.isGroupChat && (
            <div className="text-sm text-base-content/70">Online</div>
          )}
        </div>

        {/* Messages */}
        <ChatBox />

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
