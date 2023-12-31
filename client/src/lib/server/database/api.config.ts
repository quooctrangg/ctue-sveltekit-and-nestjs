import axios from 'axios';

const axiosClient = axios.create({
    baseURL:
        process.env.NODE_ENV === 'development'
            ? process.env.API_LOCAL_BASE_URL
            : process.env.API_BASE_URL,
    headers: {
        'content-type': 'application/json',
    },
    withCredentials: true,
});

axiosClient.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        throw error;
    },
);

axios.interceptors.response.use(
    (res) => {
        return res;
    },
    (error) => {
        throw error;
    },
);

export default axiosClient;