import React from "react";
import useFetchChatDetails from "../hooks/useFetchChatDetails.js";
import { useSocketContext } from "../context/SocketProvider.jsx";

function ChatUser({ chat = {}, onClick }) {
  const { chatName, chatIcon, anotherUserId } = useFetchChatDetails(chat);
  const { online } = useSocketContext();

  return (
    <div
      className="p-2 grid grid-cols-[3rem_1fr] gap-3 hover:brightness-75 transition-all hover:cursor-pointer"
      onClick={onClick}
    >
      <div className="relative">
        <div className="h-[3rem] w-[3rem] rounded-full overflow-hidden relative">
          <img src={chatIcon} alt="" />
        </div>
        {!chat.isGroupChat && online[anotherUserId] && (
          <div className="absolute right-0 bottom-2 w-3 h-3 bg-green-600 rounded-full"></div>
        )}
      </div>
      <div>
        <p className="line-clamp-1 py-1 font-bold">{chatName}</p>
        <p className="line-clamp-1 text-sm">
          {chat.latestMessage?.content ?? "Tap to chat"}
        </p>
      </div>
    </div>
  );
}

export default ChatUser;
