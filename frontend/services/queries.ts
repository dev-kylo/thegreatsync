
import { ChaptersResponse, CourseResponse, PageResponse } from "../types";
const qs = require('qs');
import { httpClient } from "../libs/axios";

export const getText = async (id: string) => {
    console.log('About to fetch TEXT data')
    const res = await httpClient.get(`/api/text-image-codes/${id}`);
    return res && res.data;
};

export const getChapters = async (url?: string) => {
    const query = qs.stringify({
        populate: ['menu', 'sub_chapters', 'sub_chapters.menu', 'sub_chapters.pages', 'sub_chapters.pages.menu'],
    }, {
        encodeValuesOnly: true, // prettify URL
    });
    console.log('About to fetch CHAPTERS data')
    const res = await httpClient.get<ChaptersResponse>(`${url || '/api/chapters'}?${query}`)
    return res && res.data;
};

export const getPage = async (id: string | number): Promise<PageResponse> => {

    const query = qs.stringify({
        populate: ['content', 'content.image', 'content.video']
    }, {
        encodeValuesOnly: true, // prettify URL
    });
    console.log('About to fetch PAGE data')
    const res = await httpClient.get<PageResponse>(`/api/pages/${id}?${query}`);
    return res && res.data
};


export const getCourse = async (id: string | number): Promise<CourseResponse> => {

    const query = qs.stringify({
        populate: ['description', 'description.video']
    }, {
        encodeValuesOnly: true, // prettify URL
    });
    console.log('About to fetch COURSE data')
    const res = await httpClient.get<CourseResponse>(`/api/courses/${id}?${query}`);
    return res && res.data;
};
