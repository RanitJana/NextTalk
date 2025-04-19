import React from "react";

const ChatBox = ({ messages = [], senderId }) => {
  return (
    <div className="relative w-full h-full overflow-y-auto">
      <div className=" absolute top-0 left-0 he-full w-full flex-1 overflow-y-auto p-4 space-y-2 bg-base-100">
        {messages?.map((message, idx) => {
          const ownMessage =
            message.sender._id.toString() == senderId.toString();
          return (
            <div
              key={idx}
              className={`max-w-[75%] w-fit p-3 rounded-xl ${
                ownMessage
                  ? "bg-primary text-primary-content self-end ml-auto"
                  : "bg-base-300 self-start"
              }`}
            >
              <p className="text-sm break-words text-pretty">
                {message.content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatBox;
