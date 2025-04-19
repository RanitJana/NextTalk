import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import SocketProvider from "./context/SocketProvider.jsx";
import ChatProvider from "./context/ChatProvider.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ChatProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </ChatProvider>
  </BrowserRouter>
);
