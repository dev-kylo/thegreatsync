import axios from "axios";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
const strapiUrl = process.env.STRAPI_URL;

const httpClient = axios.create({});

// THIS CAN ONLY RUN ON THE CLIENT WITH GETSESSION
httpClient.interceptors.request.use(
    async (config) => {
        const session = await getSession();
        if (config.headers) config.headers['Authorization'] = `Bearer ${session?.jwt}`;
        return config;
    }
)

export function createServersideAxios(session: Session) {
    if (!session) return undefined;
    const httpClient = axios.create({});
    httpClient.interceptors.request.use(
        async (config) => {
            if (config.headers) config.headers['Authorization'] = `Bearer ${session.jwt}`;
            return config;
        }
    )
    console.log('client made')
    return httpClient;
}

export { httpClient }