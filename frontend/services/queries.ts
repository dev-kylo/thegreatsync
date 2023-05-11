/* eslint-disable @typescript-eslint/no-var-requires */
import qs from 'qs';
import { ChaptersResponse, CourseResponse, CoursesByUserResponse, PageResponse } from '../types';

import { httpClient } from '../libs/axios';

export const getChapters = async (courseId: string | number): Promise<ChaptersResponse> => {
    if (!courseId) throw new Error('Missing course Id');
    const query = qs.stringify(
        {
            populate: ['menu', 'sub_chapters', 'sub_chapters.menu', 'sub_chapters.pages', 'sub_chapters.pages.menu'],
            filters: {
                courses: {
                    id: {
                        $eq: courseId,
                    },
                },
            },
        },
        {
            encodeValuesOnly: true, // prettify URL
        }
    );
    console.log('About to fetch CHAPTERS data');
    const res = await httpClient.get<ChaptersResponse>(`/api/chapters?${query}`);
    return res && res.data;
};

export const getPage = async (id: string | number): Promise<PageResponse> => {
    const query = qs.stringify(
        {
            populate: ['content', 'content.image', 'content.video'],
        },
        {
            encodeValuesOnly: true, // prettify URL
        }
    );
    console.log('About to fetch PAGE data');
    const res = await httpClient.get<PageResponse>(`/api/pages/${id}?${query}`);
    return res && res.data;
};

export const getEnrolledCourses = async (): Promise<CoursesByUserResponse> => {
    console.log('About to fetch all COURSES ');
    const res = await httpClient.get<CoursesByUserResponse>(`/api/coursesByUser`);
    return res && res.data;
};

export const getCourse = async (id: string | number): Promise<CourseResponse> => {
    const query = qs.stringify(
        {
            populate: ['description', 'description.video'],
        },
        {
            encodeValuesOnly: true, // prettify URL
        }
    );
    console.log('About to fetch COURSE data');
    const res = await httpClient.get<CourseResponse>(`/api/courses/${id}?${query}`);
    return res && res.data;
};
