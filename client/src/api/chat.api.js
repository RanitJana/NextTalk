import { axiosInstance } from "../lib/axios.js";

const fetchChats = async () => {
  try {
    const res = await axiosInstance.get("chat/");
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { fetchChats };
