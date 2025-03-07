import axios from 'axios';

import { httpClient } from '../libs/axios';
import { SignInResponse } from '../types';

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

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
    const res = await axios.post<{ ok: boolean }>(`${strapiUrl}/api/auth/forgot-password`, {
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
