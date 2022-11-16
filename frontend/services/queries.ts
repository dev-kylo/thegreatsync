import axios, { AxiosInstance, AxiosStatic } from "axios";
import { ChaptersResponse } from "../types";
const qs = require('qs');
import type { Session } from "next-auth";
import { httpClient } from "../libs/axios";

const strapiUrl = process.env.STRAPI_URL;

export const getText = async (id: string, axios: AxiosStatic) => {
    const res = await axios.get(`${strapiUrl}/api/text-image-codes/${id}`);
    return res.data;
};




export const getChapters = async (url?: string, session?: Session) => {

    const query = qs.stringify({
        populate: ['menu', 'sub_chapters', 'sub_chapters.menu', 'sub_chapters.pages', 'sub_chapters.pages.menu'],
    }, {
        encodeValuesOnly: true, // prettify URL
    });

    console.log('--------QUERY-------');
    console.log(query);

    const res = !session ? await httpClient.get<ChaptersResponse>(`${process.env.NEXT_PUBLIC_STRAPI_URL}${url || '/api/chapters'}?${query}`)
        : await axios.get<ChaptersResponse>(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/chapters?${query}`, { headers: { Authorization: `Bearer ${session.jwt}` } });;
    return res.data;
};

export const getPage = async (url?: string, session?: Session) => {

    const query = qs.stringify({
        populate: ['content', 'content.image'],
    }, {
        encodeValuesOnly: true, // prettify URL
    });

    console.log('--------PAGE QUERY-------');
    console.log(query);

    const res = !session ? await httpClient.get<ChaptersResponse>(`${process.env.NEXT_PUBLIC_STRAPI_URL}${url || '/api/pages'}?${query}`)
        : await axios.get<ChaptersResponse>(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/pages?${query}`, { headers: { Authorization: `Bearer ${session.jwt}` } });;
    return res.data;
};
