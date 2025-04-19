import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SocketProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </SocketProvider>
  </BrowserRouter>
);
