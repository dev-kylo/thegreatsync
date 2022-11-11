import axios from 'axios';

const axiosdb = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});


export default axiosdb;
