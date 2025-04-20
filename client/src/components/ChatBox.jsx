import React, { memo, useEffect, useRef } from "react";

const SCROLL_THRESHOLD = 100; // pixels from bottom

const ChatBox = memo(({ messages = [], myId }) => {
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const autoScrollRef = useRef(true);

  // Track user scroll position
  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const distanceFromBottom =
      el.scrollHeight - (el.scrollTop + el.clientHeight);
    autoScrollRef.current = distanceFromBottom < SCROLL_THRESHOLD;
  };

  useEffect(() => {
    if (autoScrollRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }, [messages]);

  return (
    <div className="relative w-full h-full overflow-y-auto">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="absolute top-0 left-0 h-full w-full flex-1 overflow-y-auto p-4 space-y-2 bg-base-100"
      >
        {messages?.map((message, idx) => {
          const ownMessage = message.sender._id.toString() === myId.toString();
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

        {/* Invisible anchor for scrolling */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
});

export default ChatBox;
