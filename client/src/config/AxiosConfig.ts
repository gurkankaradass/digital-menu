import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://192.168.76.111:5173/'
});

export default axiosInstance;