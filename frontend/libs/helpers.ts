import { ChaptersResponse, MenuItem, MenuType, Page, ChapterData, SubChapter } from "../types";

export function serverRedirectObject(url: string, permanent: boolean = true) {
    return {
        redirect: {
            destination: url,
            permanent: permanent,
        },
    };
}


const completedPageIds = [1];

type EntityWithMenuOrder = ChapterData | SubChapter | Page

function sortByOrderNumber(a: EntityWithMenuOrder, b: EntityWithMenuOrder) {
    return +a.attributes.menu!.orderNumber - b.attributes.menu!.orderNumber;
}

function mapMenuPages(pages: Page[], prependLinkUrl: string): MenuItem[] {
    return pages
        .filter(page => page.attributes.visible)
        .sort(sortByOrderNumber)
        .map((page) => {
            const mappedPage = {} as Partial<MenuItem>;
            mappedPage.level = 3;
            mappedPage.id = page.id
            mappedPage.name = page.attributes.title;
            const icon = page.attributes.menu.icon as MenuType;
            mappedPage.type = icon || 'read';
            mappedPage.orderNumber = page.attributes.menu.orderNumber;
            mappedPage.completed = completedPageIds.includes(page.id);
            mappedPage.href = `${prependLinkUrl}/${page.id}`
            return mappedPage as MenuItem;;
        })
}

function pageCompletionCount(pages: Page[]) {
    return pages.reduce((accumulator: number, current: Page) => {
        if (completedPageIds.includes(current.id)) return accumulator + 1;
        return accumulator
    }, 0)
}

function mapMenuSubChapters(subchapters: SubChapter[], prependLinkUrl: string): MenuItem[] {
    return subchapters
        .filter(subchapter => subchapter.attributes.visible)
        .sort(sortByOrderNumber)
        .map((subchapter) => {
            const mappedSubChapter = {} as Partial<MenuItem>;
            const pages = subchapter.attributes.pages?.data;
            if (pages) mappedSubChapter.children = mapMenuPages(pages, `/${prependLinkUrl}/${subchapter.id}`);
            mappedSubChapter.name = subchapter.attributes.title;
            mappedSubChapter.progress = +pageCompletionCount(pages!) / (mappedSubChapter.children!.length) * 100;
            mappedSubChapter.level = 2;
            mappedSubChapter.id = subchapter.id;
            mappedSubChapter.completed = mappedSubChapter.progress === 100;
            return mappedSubChapter as MenuItem;
        })
}

export function mapMenuChapters(data: ChaptersResponse, courseUid: string): MenuItem[] {
    const chapters = data.data;
    if (!chapters) return [];
    return chapters
        .filter(chapter => chapter.attributes.visible)
        .sort(sortByOrderNumber)
        .map(chapter => {
            const { id: chapterId, attributes } = chapter;
            const chapterTitle = attributes.title;
            const subchapters = attributes.sub_chapters.data;
            const mappedChapter = {} as Partial<MenuItem>;
            mappedChapter.name = chapterTitle;
            mappedChapter.completed = false;
            mappedChapter.children = mapMenuSubChapters(subchapters, `courses/${courseUid}/${chapterId}`);
            mappedChapter.progress = 0;
            mappedChapter.id = chapter.id;
            mappedChapter.level = 1;
            return mappedChapter as MenuItem;
        })
}