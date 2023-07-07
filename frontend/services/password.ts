import axios from 'axios';
import type { SignInResponse } from '../types';
import { httpClient } from '../libs/axios';

const strapiUrl = process.env.STRAPI_URL;

export type LostPasswordPayload = {
    code: string;
    password: string;
    passwordConfirmation: string; // same as field above
};

export type ChangePasswordPayload = {
    currentPassword: string;
    password: string;
    passwordConfirmation: string; // same as field above
};

export async function forgotPassword({ email }: { email: string }) {
    const res = await axios.post<SignInResponse>(`${strapiUrl}/api/auth/forgot-password`, {
        email,
    });
    return res.data;
}

export async function resetLostPassword(payload: LostPasswordPayload) {
    const res = await axios.post<SignInResponse>(`${strapiUrl}/api/auth/reset-password`, payload);
    return res.data;
}

export async function changePassword(payload: ChangePasswordPayload) {
    const res = await httpClient.post<SignInResponse>(`${strapiUrl}/api/auth/change-password`, payload);
    return res.data;
}
