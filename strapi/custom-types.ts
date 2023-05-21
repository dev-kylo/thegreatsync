import type { ApiOrderOrder, ApiPagePage } from "./schemas";

export type PaddleOrder = ApiOrderOrder['attributes'];
export type Page = ApiPagePage['attributes']

export type CompletionProgress = {
    id: number;
    completed: boolean;
}

export type PageCompletion = CompletionProgress & { subchapter?: number };
export type SubchapterCompletion = CompletionProgress & { chapter?: number }
export type ChapterCompletion = CompletionProgress & { course?: number }