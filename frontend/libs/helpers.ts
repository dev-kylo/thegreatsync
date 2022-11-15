import { ChaptersResponse, MenuItem, MenuType, Page, SubChapters } from "../types";

export function serverRedirectObject(url: string, permanent: boolean = true) {
    return {
        redirect: {
            destination: url,
            permanent: permanent,
        },
    };
}

function mapMenuPages(pages: Page[]): MenuItem[] {
    return pages.map((page) => {
        const mappedPage = {} as Partial<MenuItem>;
        mappedPage.level = 3;
        mappedPage.name = page.attributes.title;
        const icon = page.attributes.menu.icon as MenuType;
        mappedPage.type = icon || 'read';
        mappedPage.orderNumber = page.attributes.menu.orderNumber;
        mappedPage.completed = false;
        return mappedPage as MenuItem;;
    })
}

function mapMenuSubChapters(subchapters: SubChapters[]): MenuItem[] {
    return subchapters.map((subchapter) => {
        const mappedSubChapter = {} as Partial<MenuItem>;
        const pages = subchapter.attributes.pages?.data;
        if (pages) mappedSubChapter.children = mapMenuPages(pages);
        mappedSubChapter.name = subchapter.attributes.title;
        mappedSubChapter.progress = 0;
        mappedSubChapter.level = 2;
        mappedSubChapter.completed = false;
        return mappedSubChapter as MenuItem;
    })
}

export function mapMenuChapters(data: ChaptersResponse): MenuItem[] {
    const chapters = data.data;
    return chapters.map(chapter => {
        const { id: chapterId, attributes } = chapter;
        const chapterTitle = attributes.title;
        const subchapters = attributes.sub_chapters.data;
        const mappedChapter = {} as Partial<MenuItem>;
        mappedChapter.name = chapterTitle;
        mappedChapter.completed = false;
        mappedChapter.progress = 0;
        mappedChapter.children = mapMenuSubChapters(subchapters);
        mappedChapter.level = 1;
        return mappedChapter as MenuItem;
    })
}