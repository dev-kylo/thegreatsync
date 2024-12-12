import axios from 'axios';
import { signOut } from 'next-auth/react';
import { logError } from './errorHandler';

export const httpClient = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_STRAPI_URL}`,
});

httpClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.log('interceptor');
        console.log(error);
        const isAxiosEr = axios.isAxiosError(error);
        logError(isAxiosEr ? error.message : (error as string));
        if (isAxiosEr && error?.response?.status === 403) signOut();
        if (isAxiosEr) return error.response;
    }
);

export const setAuthToken = (token: string) => {
    if (token) {
        httpClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete httpClient.defaults.headers.common.Authorization;
    }
};
