import axios from "axios";
const strapiUrl = process.env.STRAPI_URL;

export const axiosInst = axios.create({
    baseURL: `${strapiUrl}`,
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' }
});

    // axios.interceptors.request.use(
    //     (config) => {
    //         if (config.headers) config.headers['Authorization'] = `Bearer ${session.jwt}`;
    //         return config;
    //     }
    // )