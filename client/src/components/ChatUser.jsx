import React from "react";
import useFetchChatDetails from "../hooks/useFetchChatDetails";

function ChatUser({ chat = {} }) {
  const { chatName, chatIcon } = useFetchChatDetails(chat);

  return (
    <div className="p-2 grid grid-cols-[3rem_1fr] gap-3">
      <div className="h-[3rem] w-[3rem] rounded-full overflow-hidden">
        <img src={chatIcon} alt="" />
      </div>
      <div>
        <p className="line-clamp-1">{chatName}</p>
      </div>
    </div>
  );
}

export default ChatUser;
