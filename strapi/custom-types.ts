import type { ApiOrderOrder, ApiPagePage } from "./schemas";

export type PaddleOrder = ApiOrderOrder['attributes'] & { id: number}
export type Page = ApiPagePage['attributes'] & { id: number}

export type CompletionProgress = {
    id: number;
    completed: boolean;
}

export type PageCompletion = CompletionProgress & { subchapter?: number };
export type SubchapterCompletion = CompletionProgress & { chapter?: number }
export type ChapterCompletion = CompletionProgress & { course?: number }
export type UserCourseProgress = { chapters: ChapterCompletion[], pages: PageCompletion[], subchapters: SubchapterCompletion[], id: number, user: number}