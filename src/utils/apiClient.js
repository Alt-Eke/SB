import axios from "axios";
const baseURL = import.meta.env.VITE_API_LOCAL_URL || "https://study-buddy-api-yaoz.onrender.com/api/v1";
const axiosClient = axios.create({
    baseURL: baseURL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    // withCredentials: true,
});

axiosClient.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);


axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            window.location.href = "/auth";
        }
        return Promise.reject(error);
    },
);

export default axiosClient;
