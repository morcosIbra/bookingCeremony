import axios from 'axios';
import store from '../store';
let baseURL = ''
if (process.env.NODE_ENV == 'production')
    baseURL = `https://stgmb-testing.herokuapp.com/`;
else
    baseURL = `http://localhost:5000/`;

export const axiosInstance = axios.create({
    baseURL
});
axiosInstance.interceptors.request.use(function (config) {
    const isAdmin = store.getState().auth.isAdmin;
    config.headers.isAdmin = isAdmin;

    return config;
});