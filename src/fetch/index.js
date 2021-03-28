import axios from 'axios';
import store from '../store';
const baseURL = process.env.REACT_APP_BASE_URL

export const axiosInstance = axios.create({
    baseURL
});
axiosInstance.interceptors.request.use(function (config) {
    const isAdmin = store.getState().auth.isAdmin;
    config.headers.isAdmin = isAdmin;

    return config;
});