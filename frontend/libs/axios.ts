import axios from "axios";
import { createErrorString } from "./errorHandler";
import { serverRedirectObject } from "./helpers";
// import { getSession } from "next-auth/react";
// const strapiUrl = process.env.STRAPI_URL;

const isServer = () => {
    return typeof window === "undefined";
}


export const httpClient = axios.create({});

// THIS CAN ONLY RUN ON THE CLIENT WITH GETSESSION
// httpClient.interceptors.request.use(
//     async (config) => {
//         const session = isServer() ? await : await getSession();
//         if (config.headers) config.headers['Authorization'] = `Bearer ${session?.jwt}`;
//         return config;
//     }
// );

httpClient.interceptors.response.use(response => {
    return response;
}, error => {
    console.log('Response intercepted');
    console.log(error)
    console.log('-----')
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

// export function createServersideAxios(session: Session) {
//     if (!session) return undefined;
//     const httpClient = axios.create({});
//     httpClient.interceptors.request.use(
//         async (config) => {
//             if (config.headers) config.headers['Authorization'] = `Bearer ${session.jwt}`;
//             return config;
//         }
//     )
//     httpClient.interceptors.response.use(response => {
//         return response;
//     }, error => {
//         if (error.response.status === 401) {
//             //place your reentry code
//             console.log('WE CAUGHT THE 401 ERROR')
//         }
//         return error;
//     });
//     return httpClient;
// }

