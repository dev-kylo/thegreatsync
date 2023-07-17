import { httpClient } from '../libs/axios';

export const completePage = async (
    courseId: string | number,
    pageId: string | number
): Promise<{ success: boolean }> => {
    const res = await httpClient.put<{ success: boolean }>(
        `/api/user-course-progress?courseId=${courseId}&pageId=${pageId}`
    );
    return res && res.data;
};
