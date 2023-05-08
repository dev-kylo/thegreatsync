import axios from 'axios';
import type { RegisterResponse } from '../types';

const strapiUrl = process.env.STRAPI_URL;

export type RegisterPayload = {
    username: string;
    existingAccount: boolean;
    password: string;
    orderId: string;
};

export async function register(payload: RegisterPayload) {
    const res = await axios.post<RegisterResponse>(`${strapiUrl}/api/customer/register`, payload);
    return res.data;
}
