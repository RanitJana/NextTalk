import axios from 'axios';


const url = "http://localhost:5000/api/v1";

export const axiosInstance = axios.create({
    baseURL: url,
    withCredentials: true,
})