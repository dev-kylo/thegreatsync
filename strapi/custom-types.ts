import type { ApiChapterChapter, ApiOrderOrder, ApiPagePage, ApiSubchapterSubchapter, PluginUsersPermissionsUser } from "./schemas";
import type { Service } from '@strapi/strapi/lib/core-api/service';
import { ApiCourseCourse } from "./schemas";

export type CustomPaddleData = {
    release_course_id: number | string; 
    release_enrolment_id: number | string; 
    email: string;
    customer_name: string;  
    marketing_consent: string | number;
}

export type PaddleFulfillment = {
    event_time: string;
    p_country: string;
    p_coupon: string;
    p_coupon_savings: string;
    p_currency: string;
    p_earnings: string;
    p_order_id: string;
    p_paddle_fee: string;
    p_price: string;
    p_product_id: string;
    p_quantity: string;
    p_sale_gross: string;
    p_tax_amount: string;
    p_used_price_override: string;
    passthrough: string;
    p_signature: string;
    p_custom_data: CustomPaddleData;
} & CustomPaddleData



export type Page = ApiPagePage['attributes'] & { id: number}
export type User = PluginUsersPermissionsUser['attributes'] & { id: number}
export type Order = ApiOrderOrder['attributes'] & { id: number, user: User}
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
    createUserEnrollment?(order: Order, userId: string|number): Promise<void>;
    createUserCourseCompletionEntry?(order: Order, userId: string|number): Promise<void>;
};


