import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../socket.js";

import { useChatContext } from "./ChatProvider.jsx";

const SocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSocketContext = () => {
  return useContext(SocketContext);
};

const SocketProvider = ({ children }) => {
  const { user } = useChatContext();

  const [online, setOnline] = useState({});

  useEffect(() => {
    if (user?._id) socket.emit("connect:user", { userId: user._id.toString() });
  }, [user]);

  useEffect(() => {
    socket.on("online:users", ({ users }) => {
      setOnline(users);
    });
  }, []);

  return (
    <SocketContext.Provider value={{ socket, online }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
