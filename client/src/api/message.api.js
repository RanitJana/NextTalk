import { axiosInstance } from "../lib/axios.js";

const fetchMessages = async (chatId) => {
  try {
    const res = await axiosInstance.get("message/" + chatId);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const postMessage = async (chat, content) => {
  try {
    const res = await axiosInstance.post("message/", { chat, content });
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { fetchMessages, postMessage };
