import axios from 'axios';
let baseURL = ''
if (process.env.NODE_ENV == 'production')
    baseURL = `https://stgmb.com/`;
else
    baseURL = `http://localhost:5000/`;
export const axiosInstance = axios.create({
    baseURL
});
// axiosMessenger.interceptors.request.use(config => {
//     config.params = {
//         access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN
//     };
//     return config;
// });