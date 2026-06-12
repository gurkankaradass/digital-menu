import axios from "axios";

const axiosInstance = axios.create({
    baseURL: `http://${window.location.hostname}:5000/`
});

export default axiosInstance;