import { createContext, useContext, useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const ChatContext = createContext();
export const useChatContext = () => {
  return useContext(ChatContext);
};

const ChatProvider = ({ children }) => {
  const currentUser = useAuthStore();

  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    setUser(currentUser?.authUser?.user);
  }, [currentUser?.authUser?.user]);

  return (
    <ChatContext.Provider
      value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
