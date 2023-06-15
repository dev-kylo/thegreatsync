import type { ApiChapterChapter, ApiOrderOrder, ApiPagePage, ApiSubchapterSubchapter, PluginUsersPermissionsUser } from "./schemas";
import type { Service } from '@strapi/strapi/lib/core-api/service';
import { ApiCourseCourse } from "./schemas";

export type CustomData = {
    courseId: number;
    date: string;
    price: string;
}
export type Page = ApiPagePage['attributes'] & { id: number}
export type User = PluginUsersPermissionsUser['attributes'] & { id: number}
export type PaddleOrder = ApiOrderOrder['attributes'] & { id: number}
export type Order = PaddleOrder & { user: User, custom_data: CustomData}
export type Subchapter = ApiSubchapterSubchapter['attributes'] & { id: number} & {pages: Page[]}
export type Chapter = ApiChapterChapter['attributes'] & { id: number} & {subchapters: Subchapter[]}
export type Course = ApiCourseCourse['attributes'] & { id: number} & {chapters: Chapter[]}

export type CompletionProgress = {
    id: number;
    completed: boolean;
}

export type PageCompletion = CompletionProgress & { subchapter?: number };
export type SubchapterCompletion = CompletionProgress & { chapter?: number }
export type ChapterCompletion = CompletionProgress & { course?: number }
export type UserCourseProgress = { chapters: ChapterCompletion[], pages: PageCompletion[], subchapters: SubchapterCompletion[], id: number, user: number}


export type CustomerService = Service & {
    createUserEnrollment?(customData: CustomData, userId: string|number): Promise<void>;
    createUserCourseCompletionEntry?(customData: CustomData, userId: string|number): Promise<void>;
};