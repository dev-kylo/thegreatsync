import axios, { AxiosInstance, AxiosStatic } from "axios";
import { ChaptersResponse, CourseResponse, PageData, PageResponse } from "../types";
const qs = require('qs');
import type { Session } from "next-auth";
import { httpClient } from "../libs/axios";

export const getText = async (id: string, axios: AxiosStatic) => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/text-image-codes/${id}`);
    return res.data;
};


export const getChapters = async (url?: string, session?: Session) => {

    const query = qs.stringify({
        populate: ['menu', 'sub_chapters', 'sub_chapters.menu', 'sub_chapters.pages', 'sub_chapters.pages.menu'],
    }, {
        encodeValuesOnly: true, // prettify URL
    });

    const res = !session ? await httpClient.get<ChaptersResponse>(`${process.env.NEXT_PUBLIC_STRAPI_URL}${url || '/api/chapters'}?${query}`)
        : await axios.get<ChaptersResponse>(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/chapters?${query}`, { headers: { Authorization: `Bearer ${session.jwt}` } });;
    return res.data;
};

export const getPage = async (id: string | number, session: Session): Promise<PageResponse> => {

    const query = qs.stringify({
        populate: ['content', 'content.image', 'content.video']
    }, {
        encodeValuesOnly: true, // prettify URL
    });
    const res = await axios.get<PageResponse>(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/pages/${id}?${query}`, { headers: { Authorization: `Bearer ${session.jwt}` } });
    return res.data;
};

export const getCourse = async (id: string | number, session: Session): Promise<CourseResponse> => {

    const query = qs.stringify({
        populate: ['description', 'description.video']
    }, {
        encodeValuesOnly: true, // prettify URL
    });
    const res = await axios.get<CourseResponse>(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/courses/${id}?${query}`, { headers: { Authorization: `Bearer ${session.jwt}` } });
    return res.data;
};
