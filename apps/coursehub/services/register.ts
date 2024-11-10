import axios from 'axios';
import type { RegisterResponse } from '../types';

export type RegisterPayload = {
    username: string;
    existingAccount: boolean;
    password: string;
    orderId: string;
};
const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function register(payload: RegisterPayload) {
    const res = await axios.post<RegisterResponse>(`${strapiUrl}/api/customer/register`, { ...payload });
    return res.data;
}
