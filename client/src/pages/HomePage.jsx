import React, { useState } from "react";

const chats = [...Array(3)].map((_, i) => ({
  id: i,
  name: `User ${i + 1}`,
  lastMessage: "Hey there!",
}));

const HomePage = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  const handleBack = () => {
    setSelectedChat(null);
  };

  return (
    <div className="h-vh flex sm:flex-row flex-col bg-base text-base-content h-full">
      {/* Chat List Sidebar */}
      <aside
        className={`sm:w-1/4 md:w-1/5 border-r border-base-300 flex flex-col h-full ${
          selectedChat ? "hidden sm:flex" : "flex"
        }`}
      >
        <div className="p-4 border-b border-base-300 font-bold text-lg bg-base-200">
          Chats
        </div>
        <div className="relative h-full">
          <div className="overflow-y-auto h-full w-full flex-1 absolute left-0 top-0">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="p-4 hover:bg-base-200 cursor-pointer border-b border-base-300"
                onClick={() => handleSelectChat(chat)}
              >
                <div className="font-semibold">{chat.name}</div>
                <div className="text-sm text-base-content/70">
                  {chat.lastMessage}
                </div>
              </div>
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
