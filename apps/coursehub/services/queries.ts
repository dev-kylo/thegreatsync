/* eslint-disable @typescript-eslint/no-var-requires */
import qs from 'qs';
import { AxiosResponse } from 'axios';
import {
    ChaptersResponse,
    CourseData,
    CourseResponse,
    PageResponse,
    ReflectionsResponse,
    UserCourseProgressResponse,
    FetchImagimodelResponse,
} from '../types';

import { httpClient } from '../libs/axios';

export const getChapters = async (courseId: string | number): Promise<ChaptersResponse> => {
    if (!courseId) throw new Error('Missing course Id');
    const query = qs.stringify(
        {
            populate: [
                'menu',
                'subchapters',
                'subchapters.menu',
                'subchapters.pages',
                'subchapters.pages.menu',
                'subchapters.pages.menu.course',
            ],
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
    const res = await httpClient.get<ChaptersResponse>(`/api/chapters?${query}`);
    return res && res?.data;
};

export const getPage = async (id: string | number): Promise<PageResponse> => {
    const query = qs.stringify(
        {
            populate: [
                'content',
                'content.image',
                'content.video',
                'content.menu',
                'content.menu.course',
                'links',
                'links.file',
                'content.file',
                'media.description',
                'content.description',
                'menu.course',
            ],
        },
        {
            encodeValuesOnly: true, // prettify URL
        }
    );
    const res = await httpClient.get<PageResponse>(`/api/pages/${id}?${query}`);
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
    const res = await httpClient.get<UserCourseProgressResponse>(`/api/user-course-progress/?courseId=${courseId}`);
    return res && res?.data;
};

export const getReflections = async (courseId: string | number): Promise<ReflectionsResponse> => {
    const res = await httpClient.get<ReflectionsResponse>(`/api/reflectionsByUser/${courseId}`);
    return res && res?.data;
};

export const getImagimodel = async (courseId: string | number): Promise<FetchImagimodelResponse> => {
    const query = qs.stringify(
        {
            populate: {
                layers: {
                    populate: {
                        image: {
                            populate: ['image'],
                        },
                        summaries: {
                            populate: ['content', 'image', 'content.image'],
                        },
                    },
                },
                zones: true,
            },
            filters: {
                course: {
                    id: {
                        $eq: courseId,
                    },
                },
            },
        },
        {
            encodeValuesOnly: true,
        }
    );
    const res = await httpClient.get<FetchImagimodelResponse>(`/api/imagimodels?${query}`);
    return res && res?.data;
};
