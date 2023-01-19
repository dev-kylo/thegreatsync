import axios from "axios";
import { logError } from "./errorHandler";

export const httpClient = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_STRAPI_URL}`
});

httpClient.interceptors.response.use(response => {
    return response;
}, error => {
    console.log('Response intercepted');
    logError(error);
    return error.response;
});

export const setAuthToken = (token: string) => {
    console.log('SETTING AUTH TOKEN')
    console.log(token)
    if (!!token) {
        httpClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete httpClient.defaults.headers.common["Authorization"];
    }
};

