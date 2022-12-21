import axios from 'axios';

const axiosdb = axios.create({
<<<<<<< HEAD
    baseURL: process.env.NEXT_PUBLIC_API_URL,
=======
    baseURL: process.env.STRAPI_URL,
>>>>>>> development
});


export default axiosdb;
