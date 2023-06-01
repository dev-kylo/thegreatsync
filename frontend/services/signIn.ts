import axios from 'axios';
import type { SignInResponse } from '../types';

const strapiUrl = process.env.STRAPI_URL;

export async function signIn({ email, password }: { email: string; password: string }) {
    const res = await axios.post<SignInResponse>(`${strapiUrl}/api/auth/local`, {
        identifier: email,
        password,
    });
    return res.data;
}
