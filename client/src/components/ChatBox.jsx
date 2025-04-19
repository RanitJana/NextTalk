import React from "react";

const ChatBox = () => {
  return (
    <div className="relative w-full h-full overflow-y-auto">
      <div className=" absolute top-0 left-0 he-full w-full flex-1 overflow-y-auto p-4 space-y-2 bg-base-100">
        {[...Array(50)].map((_, idx) => (
          <div
            key={idx}
            className={`max-w-[75%] w-fit p-3 rounded-xl ${
              idx % 2 === 0
                ? "bg-primary text-primary-content self-end ml-auto"
                : "bg-base-300 self-start"
            }`}
          >
            <p className="text-sm break-words text-pretty">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis, voluptates iure esse qui quam dicta officiis! Laboriosam labore vel aut ipsam maiores facere, saepe cupiditate consequuntur explicabo perspiciatis aspernatur similique?</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatBox;
