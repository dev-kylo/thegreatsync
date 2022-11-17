export type MenuType = 'watch' | 'code' | 'read' | 'draw' | 'imagine' | 'listen' | 'play';

export type PageType = 'text_image_code' | 'video' | 'text_image'

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


export type PageStepT = {
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

export interface PageResponse {
    data: PageData;
    meta: Meta;
}

export interface StrapiData {
    id: number;
    attributes: ChaptersAttributes;
}

export interface PageData {
    id: number;
    attributes: PageAttributes;
}

export interface PageAttributes {
    title: string;
    type: PageType;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
    content: PageContent[];
}

export interface PageContent {
    id: number;
    __component: string;
    code?: string;
    image_alt: string;
    transparent_image?: boolean;
    text: string;
    orderNumber?: number;
    image: ImageComp;
}


export type PageStep = PageContent & {
    status: 'current' | 'complete' | 'default'
}


export interface ImageComp {
    data: ImageData;
}

export interface ImageData {
    id: number;
    attributes: ImageAttributes;
}

export interface ImageAttributes {
    width: number;
    height: number;
    url: string;
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
