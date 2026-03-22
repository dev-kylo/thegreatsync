export type MenuType = 'watch' | 'code' | 'read' | 'draw' | 'imagine' | 'listen' | 'play' | 'share' | 'discover';

export type PageType = 'text_image_code' | 'video' | 'text_image' | 'text' | 'text_code' | 'blocks' | 'reflection';

export type MenuParentSubchapter = {
    subchapter?: {
        name: string;
        id: string | number;
    };
};

export type MenuParentChapter = {
    chapter?: {
        name: string;
        id: string | number;
    };
};

export type MenuItem = {
    name: string;
    id: number;
    level: number;
    progress?: number | string;
    completed?: boolean;
    type?: MenuType;
    current?: boolean;
    href?: string;
    orderNumber: number;
    children?: MenuItem[];
    parent: MenuParentChapter & MenuParentSubchapter;
    isLocked?: boolean;
};

export type CurrentLocation = { pageId: string | number; subchapterId: string | number; chapterId: string | number };

export type PageStepT = {
    image: string;
    code?: string;
    text: string;
    id: number;
    orderNumber: number;
    name: string;
    status: 'current' | 'complete' | 'default';
};

export type ErrorResponse = {
    data: null;
    error: ErrorData;
};

export type SignInResponse = {
    jwt: string;
    user: {
        id: number;
        username: string;
        email: string;
        provider: string;
        confirmed: boolean;
        blocked: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
};

export type ServerResponse<T> = {
    data?: T;
    error: ErrorData;
    meta: Meta;
};

export type RegisterResponse = {
    success: boolean;
    message: string;
    error?: ErrorData;
};

export type LinkTypes = 'link' | 'download';

export interface StrapiResponseMetaData {
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
}

export interface CourseResponse {
    data?: CourseData;
    error: ErrorData;
    meta: Meta;
}

export type ReflectionsResponse = ReflectionsAttributes[];

export interface CoursesByUserResponse {
    data?: CourseData[];
    error: ErrorData;
    meta: Meta;
}

export interface ErrorData {
    status: number; // HTTP status
    name: string; // Strapi error name ('ApplicationError' or 'ValidationError')
    message: string; // A human readable error message
    details: any;
}

export interface ChaptersResponse {
    data?: {
        data: ChapterData[];
        completed: number[];
    };
    error?: ErrorData;
    meta: Meta;
}

export interface PageResponse {
    data?: PageData;
    error: ErrorData;
    meta: Meta;
}

export interface CourseData {
    id: number;
    attributes: CourseAttributes;
}

export interface ReflectionsData {
    id: number;
    attributes: ReflectionsAttributes;
}

export interface CourseByUser extends StrapiResponseMetaData {
    id: number;
    uid: string;
    title: string;
}

export interface ChapterData {
    id: number;
    attributes: ChaptersAttributes;
}

export interface PageData {
    id: number;
    attributes: PageAttributes;
}

export type ExternalFile = {
    data: null | {
        id: number;
        attributes: {
            name: string;
            alternativeText: string;
            caption: string;
            hash: string;
            ext: string;
            mime: 'text/javascript';
            size: 1.12;
            url: string;
            createdAt: Date;
            updatedAt: Date;
        };
    };
};

export type ResourceLink = {
    id: number;
    type: LinkTypes;
    external_url: string | null;
    title: string;
    subtitle: string;
    file: ExternalFile;
};
export interface CodeFile {
    id: number;
    fileName: string;
    fileExtension: string;
    code: string;
}

export interface PageContent {
    id: number;
    __component:
        | 'media.text'
        | 'media.video'
        | 'media.image'
        | 'media.text_image_code'
        | 'media.text_image'
        | 'media.code-editor';
    code?: string;
    image_alt: string;
    text: string;
    orderNumber?: number;
    image: ImageComp;
    video?: VideoT;
    showLineNumbers?: boolean;
    showPreview?: boolean;
    file?: CodeFile[];
    description?: {
        id: string;
        text: string;
    };
    descriptionType?: string;
    wrapContent?: boolean | null;
    hideRunButtons?: boolean | null;
}

export type PageStep = PageContent & {
    status: 'current' | 'complete' | 'default';
};

export interface ImageComp {
    data: ImageData | ImageData[];
}

export interface ImageData {
    id: number;
    attributes: ImageAttributes;
}

export interface ImageAttributes {
    width: number;
    height: number;
    url: string;
    title: string;
    placeholder: string;
    size: number;
    hash: string;
}

export interface CourseAttributes extends StrapiResponseMetaData {
    description: { id: string; text?: string; __component: 'media.text' | 'media.video'; video?: VideoT }[];
    uid: string;
    title: string;
}

export interface ReflectionsAttributes extends StrapiResponseMetaData {
    id: number;
    reflection: string;
    comment: string;
    subchapter: SubChapterAttributes | null;
    chapter: ChaptersAttributes | null;
}

export interface ChaptersAttributes extends StrapiResponseMetaData {
    title: string;
    visible: boolean;
    menu: Menu;
    isLocked?: boolean;
    subchapters: {
        data: SubChapter[];
    };
}

export interface VideoT {
    data: {
        id: 1;
        attributes: {
            title: string;
            upload_id: string;
            asset_id: string;
            playback_id: string;
            error_message: null | string;
            isReady: boolean;
            duration: number;
            aspect_ratio: string;
            createdAt: Date;
            updatedAt: Date;
        };
    };
}

export interface Menu {
    id: number;
    icon?: null | string;
    orderNumber: number;
    course?: {
        data: CourseData;
    };
}

export interface Pages {
    data?: Page[];
    error?: ErrorData;
}

export interface SubChapter {
    id: number;
    attributes: SubChapterAttributes;
}

export interface SubChapterAttributes extends StrapiResponseMetaData {
    title: string;
    visible: boolean;
    menu: Menu | null;
    pages?: Pages;
}

export interface Page {
    id: number;
    attributes: PageAttributes;
}

export interface PageAttributes extends StrapiResponseMetaData {
    title: string;
    type: PageType;
    visible: boolean;
    menu: Menu[];
    content: PageContent[];
    links: ResourceLink[];
}

export interface Meta {
    pagination: Pagination;
}

export interface Pagination {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
}

export type CompletionProgress = {
    id: number;
    completed: boolean;
};

export type PageCompletion = CompletionProgress & { subchapter?: number };
export type SubchapterCompletion = CompletionProgress & { chapter?: number };
export type ChapterCompletion = CompletionProgress & { course?: number };
export type UserCourseProgressResponse = {
    chapters: ChapterCompletion[];
    pages: PageCompletion[];
    subchapters: SubchapterCompletion[];
    id: number;
    user: number;
} & StrapiResponseMetaData;

export interface Summary {
    id: number;
    attributes: {
        title: string;
        content: PageContent[];
        image: {
            data: ImageData;
        };
    };
}

export interface Layer {
    id: string;
    name: string;
    imageElement?: HTMLImageElement;
    enabled: boolean;
    tiltEnabled: boolean;
    image: {
        id: number;
        image_alt: string | null;
        image: {
            data: ImageData[];
        };
    };
    position: {
        id: number;
        x: number;
        y: number;
        width: number;
        height: number;
    };
    zIndex?: number;
    summaries?: {
        data: Summary[];
    };
    description: string;
}
export interface Zone {
    id: string;
    name: string;
    centerPosition: number; // percentage from top (0-100)
    focusPoint: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left' | 'right';
    zoom: number;
}

export type FetchImagimodelResponse = {
    data: [
        {
            id: number;
            attributes: {
                layers: Layer[];
                zones: Zone[];
                width: number;
                height: number;
                containerHeightPercent: number;
                alignment: 'left' | 'center' | 'right';
                overrideZoomSpeed?: number;
                tiltEnabled: boolean;
            };
        }
    ];
};

// ============================================================================
// Agent Types
// ============================================================================

/**
 * Agent identifiers
 */
export type AgentId =
    | 'product_owner'
    | 'model_builder'
    | 'teacher_qa'
    | 'realm_builder'
    | 'course_instructor';

/**
 * Session types for agents
 */
export type SessionType = 'improvement' | 'model_build' | 'qa' | 'lesson';

/**
 * Message role
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * Chat message (frontend)
 */
export interface ChatMessage {
    id: string;
    role: MessageRole;
    content: string;
    timestamp: Date;
    sources?: SourceReference[];
    metadata?: Record<string, any>;
}

/**
 * Source reference for RAG chunks
 */
export interface SourceReference {
    chunk_uid: string;
    collection: string;
    page_title?: string;
    course_title?: string;
    chapter_title?: string;
    subchapter_title?: string;
    score: number;
    has_image: boolean;
    code_languages: string[];
}

/**
 * Agent info (from backend)
 */
export interface AgentInfo {
    id: AgentId;
    name: string;
    description: string;
    session_type: SessionType;
}

/**
 * API request for chat
 */
export interface AgentChatRequest {
    query: string;
    session_id?: string;
    user_id?: string;
    topic?: string;
    domain?: string;
    filters?: {
        domain?: string;
        concepts?: string[];
        mnemonic_tags?: string[];
        has_image?: boolean;
        code?: boolean;
    };
    topK?: number;
    temperature?: number;
    maxTokens?: number;
    context?: Record<string, any>;
}

/**
 * API response for chat (non-streaming)
 */
export interface AgentChatResponse {
    ok: boolean;
    reply: string;
    session_id: string;
    sources: SourceReference[];
    metadata: {
        agent: AgentId;
        model: string;
        chunks_retrieved: number;
        temperature: number;
        max_tokens: number;
        messages_in_context: number;
    };
}

/**
 * Error response from agent service
 */
export interface AgentErrorResponse {
    ok: false;
    error: string;
    message: string;
    details?: any;
}

/**
 * Session message from backend
 */
export interface SessionMessage {
    id: string;
    session_id: string;
    role: MessageRole;
    content: string;
    attachments?: Record<string, any>;
    metadata?: Record<string, any>;
    created_at: string;
}

/**
 * Agent session metadata from backend
 */
export interface AgentSession {
    id: string;
    user_id?: string;
    agent: AgentId;
    session_type?: SessionType;
    topic?: string;
    domain?: string;
    started_at: string;
    ended_at?: string;
}

/**
 * Session list response from backend
 */
export interface AgentSessionsResponse {
    ok: boolean;
    sessions: AgentSession[];
    count: number;
}

/**
 * Streaming event types
 */
export type StreamEventType = 'session' | 'sources' | 'token' | 'done' | 'error';

/**
 * Generic menu item for reusable menu component
 */
export interface GenericMenuItem<T = any> {
    id: string | number;
    name: string;
    description?: string;
    level: 1 | 2 | 3;
    icon?: React.ReactNode;
    data?: T;
    children?: GenericMenuItem<T>[];
    isDisabled?: boolean;
}
