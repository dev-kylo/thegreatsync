import axios, { AxiosError } from "axios";
import { logError } from "./errorHandler";
import { signOut } from "next-auth/react";

export const httpClient = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_STRAPI_URL}`
});

httpClient.interceptors.response.use(response => {
    return response;
}, (error) => {
    console.log('Response intercepted');
    logError(error);
    if (error.response.status === 403) signOut();
    return error.response;
});

export const setAuthToken = (token: string) => {
    console.log('SETTING AUTH TOKEN')
    if (!!token) {
        httpClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete httpClient.defaults.headers.common["Authorization"];
    }
};

