import axios from "axios";
import { Cookies } from "react-cookie";

const axiosInstance = axios.create({});

axiosInstance.interceptors.request.use(
  function (config) {
    const cookies = new Cookies();
    config.headers.Authorization = cookies.get("chatId")
      ? cookies.get("chatId")
      : "";
    config.params = { ...config.params, timestamp: Date.now() };
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosInstance;
