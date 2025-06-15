import { useState, useEffect } from "react";
// import { useAuthStore } from "../store/useAuthStore.js";
import { useChatContext } from "../context/ChatProvider.jsx";

export default function useFetchChatDetails(chat) {
  const { user } = useChatContext();

  const isGroupChat = chat.isGroupChat;

  const [chatName, setChatName] = useState("");
  const [chatIcon, setChatIcon] = useState(null);
  const [anotherUserId, setAnotherUserId] = useState("");

  useEffect(() => {
    (() => {
      if (isGroupChat) {
        setChatName(chat.chatName);
        setChatIcon(chat.groupIcon);
      } else {
        const firstUser = chat.users[0],
          secondUser = chat.users[1];

        if (firstUser._id.toString() == user._id.toString()) {
          setChatName(secondUser.name);
          setChatIcon(secondUser.profilePic);
          setAnotherUserId(secondUser._id);
        } else {
          setChatName(firstUser.name);
          setChatIcon(firstUser.profilePic);
          setAnotherUserId(firstUser._id);
        }
      }
    })();
  }, [chat, user._id, isGroupChat]);

  return { ...chat, chatName, chatIcon, anotherUserId };
}
