/* eslint-disable @typescript-eslint/no-var-requires */
import qs from 'qs';
import { AxiosResponse } from 'axios';
import { ChaptersResponse, CourseData, CourseResponse, PageResponse, UserCourseProgressResponse } from '../types';

import { httpClient } from '../libs/axios';

export const getChapters = async (courseId: string | number): Promise<ChaptersResponse> => {
    if (!courseId) throw new Error('Missing course Id');
    const query = qs.stringify(
        {
            populate: ['menu', 'subchapters', 'subchapters.menu', 'subchapters.pages', 'subchapters.pages.menu'],
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
    console.log('Querying CHAPTERS data');
    const res = await httpClient.get<ChaptersResponse>(`/api/chapters?${query}`);
    return res && res?.data;
};

export const getPage = async (id: string | number): Promise<PageResponse> => {
    const query = qs.stringify(
        {
            populate: ['content', 'content.image', 'content.video', 'links', 'links.file', 'content.file'],
        },
        {
            encodeValuesOnly: true, // prettify URL
        }
    );
    const res = await httpClient.get<PageResponse>(`/api/pages/${id}?${query}`);
    console.log({ pageData: res?.data });
    return res && res?.data;
};

export const getEnrolledCourses = async (): Promise<AxiosResponse<CourseData[]>> => {
    const res = await httpClient.get<CourseData[]>(`/api/coursesByUser`);
    return res;
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
    const res = await httpClient.get<CourseResponse>(`/api/courses/${id}?${query}`);
    return res && res?.data;
};

export const getUserCompletions = async ({
    courseId,
}: {
    url: string;
    courseId: string | number;
}): Promise<UserCourseProgressResponse> => {
    console.log('Querying USER data');
    const res = await httpClient.get<UserCourseProgressResponse>(`/api/user-course-progress/?courseId=${courseId}`);
    return res && res?.data;
};
