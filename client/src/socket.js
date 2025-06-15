import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
// const URL = "http://localhost:5000";
const URL = "https://nexttalk.onrender.com";

export const socket = io(URL, { withCredentials: true });
