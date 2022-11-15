import axios, { AxiosStatic } from "axios";
import { ChaptersResponse } from "../types";
const qs = require('qs');
import type { Session } from "next-auth";

const strapiUrl = process.env.STRAPI_URL;

export const getText = async (id: string, axios: AxiosStatic) => {
    const res = await axios.get(`${strapiUrl}/api/text-image-codes/${id}`);
    return res.data;
};




export const getChapters = async (axios: AxiosStatic, session: Session) => {

    const query = qs.stringify({
        populate: ['menu', 'sub_chapters', 'sub_chapters.menu', 'sub_chapters.pages', 'sub_chapters.pages.menu'],
    }, {
        encodeValuesOnly: true, // prettify URL
    });

    console.log('--------QUERY-------');
    console.log(query)

    const res = await axios.get<ChaptersResponse>(`${strapiUrl}/api/chapters?${query}`, { headers: { Authorization: `Bearer ${session.jwt}` } });
    return res.data;
};
