import axios from 'axios';

const axiosdb = axios.create({
    baseURL: process.env.STRAPI_URL,
});

export default axiosdb;
