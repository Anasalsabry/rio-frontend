import Axios from "axios";
import { SERVER_URL } from "@/constants";
import { getAuthToken } from "./auth";

/**
Axios instance to send requests
 */
const API = Axios.create({
   //baseURL: `http://localhost:1337/`,
   baseURL: `${SERVER_URL[process.env.NODE_ENV]}/`,
  timeout: 10000,
});

API.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `bearer ${token}`;
  // config.headers["Content-Type"] = "application/json"; // I needed to send multipart data
  return config;
});

export default API;
