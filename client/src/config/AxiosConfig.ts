import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || (import.meta.env.DEV ? `http://${window.location.hostname}:5000/` : "https://digital-menu-backend-gzqe.onrender.com/")
});

export default axiosInstance;