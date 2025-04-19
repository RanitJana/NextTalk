import React from 'react'

const ChatBox = () => {
    return (
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
    )
}

export default ChatBox
