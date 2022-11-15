export type MenuType = 'watch' | 'code' | 'read' | 'draw' | 'imagine' | 'listen' | 'play';

export type MenuItem = {
    name: string;
    level: number,
    progress?: number | string,
    completed?: boolean,
    type?: MenuType
    current?: boolean;
    href?: string;
    orderNumber: number;
    children?: MenuItem[]
}


export type TopicStepT = {
    image: string;
    code?: string;
    text: string;
    id: number,
    orderNumber: number,
    name: string,
    status: 'current' | 'complete' | 'default'
}

export type ErrorResponse = {
    data: null,
    error: {
        status: number,
        name: string,
        message: string,
        details?: unknown
    }
}

export type SignInResponse = {
    jwt: string,
    user: {
        id: number,
        username: string,
        email: string,
        provider: string,
        confirmed: boolean,
        blocked: boolean,
        createdAt: Date,
        updatedAt: Date
    }
}

export interface StrapiResponseMetaData {
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
}

export interface ChaptersResponse {
    data: StrapiData[];
    meta: Meta;
}

export interface StrapiData {
    id: number;
    attributes: ChaptersAttributes;
}

export interface ChaptersAttributes extends StrapiResponseMetaData {
    title: string;
    menu: Menu;
    sub_chapters: {
        data: SubChapters[]
    };
}

export interface Menu {
    id: number;
    icon?: null | string;
    orderNumber: number;
}

export interface Pages {
    data: Page[];
}

export interface SubChapters {
    id: number;
    attributes: SubChapterAttributes;
}

export interface SubChapterAttributes extends StrapiResponseMetaData {
    title: string;
    menu: Menu | null;
    pages?: Pages;
}

export interface Page {
    id: number;
    attributes: PageAttributes;
}

export interface PageAttributes extends StrapiResponseMetaData {
    title: string;
    type: string;
    menu: Menu;
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
