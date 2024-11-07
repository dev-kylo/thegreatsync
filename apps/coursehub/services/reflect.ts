import type { RegisterResponse } from '../types';
import { httpClient } from '../libs/axios';

export type ReflectionPayload = {
    user?: string;
    course: string;
    chapter?: string;
    subchapter?: string;
    reflection?: string;
    comment?: string;
};
const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function reflect(payload: ReflectionPayload) {
    const res = await httpClient.post<RegisterResponse>(`${strapiUrl}/api/reflection/create`, { ...payload });
    return res.data;
}
