import React from "react";

const HomePage = () => {
  return (
    <div className="h-screen flex bg-base text-base-content">
      {/* Sidebar */}
      <aside className="w-full sm:w-1/3 md:w-1/4 lg:w-1/5 border-r border-base-300 flex flex-col">
        <div className="p-4 border-b border-base-300 font-bold text-lg bg-base-200">
          Chats
        </div>
        <div className="overflow-y-auto flex-1">
          {/* Chat List */}
          {[...Array(10)].map((_, idx) => (
            <div
              key={idx}
              className="p-4 hover:bg-base-200 cursor-pointer border-b border-base-300"
            >
              <div className="font-semibold">User {idx + 1}</div>
              <div className="text-sm text-base-content/70">Last message...</div>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-base-300 bg-base-200 flex items-center justify-between">
          <div className="font-semibold">User Name</div>
          <div className="text-sm text-base-content/70">Online</div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-base-100">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className={`max-w-[70%] p-3 rounded-xl ${idx % 2 === 0
                  ? "bg-primary text-primary-content self-end ml-auto"
                  : "bg-base-300 self-start"
                }`}
            >
              <p className="text-sm">Message {idx + 1}</p>
            </div>
          ))}
        </div>

        {/* Chat Input */}
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

