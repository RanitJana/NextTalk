import { createContext, useContext, useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore.js";

const ChatContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useChatContext = () => {
  return useContext(ChatContext);
};

const ChatProvider = ({ children }) => {
  const currentUser = useAuthStore();

  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [PicInfo, setPicInfo] = useState(null);
  const [chatName, setChatName] = useState(null);

  useEffect(() => {
    setUser(currentUser?.authUser?.user);
  }, [currentUser?.authUser?.user]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        PicInfo,
        setPicInfo,
        chatName,
        setChatName,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
