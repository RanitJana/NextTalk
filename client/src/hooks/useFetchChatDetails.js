import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore.js";

export default function useFetchChatDetails(chat) {
  const currentUser = useAuthStore();

  const isGroupChat = chat.isGroupChat;

  const [chatName, setChatName] = useState("");
  const [chatIcon, setChatIcon] = useState(null);

  useEffect(() => {
    (() => {
      if (isGroupChat) {
        setChatName(chat.chatName);
        setChatIcon(chat.groupIcon);
      } else {
        const firstUser = chat.users[0],
          secondUser = chat.users[1];

        if (firstUser._id.toString() == currentUser._id.toString()) {
          setChatName(secondUser.name);
          setChatIcon(secondUser.profilePic);
        } else {
          setChatName(firstUser.name);
          setChatIcon(firstUser.profilePic);
        }
      }
    })();
  }, [chat, currentUser._id, isGroupChat]);

  return { ...chat, chatName, chatIcon };
}
