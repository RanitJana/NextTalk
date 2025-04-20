import axios from "axios";

const url = "https://nexttalk.onrender.com/api/v1";

export const axiosInstance = axios.create({
  baseURL: url,
  withCredentials: true,
});
