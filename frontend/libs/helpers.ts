import {
    ChaptersResponse,
    MenuItem,
    MenuType,
    Page,
    ChapterData,
    SubChapter,
    UserCourseProgressResponse,
} from '../types';

export function serverRedirectObject(url: string, permanent = true) {
    return {
        redirect: {
            destination: url,
            permanent,
        },
    };
}

function calculateChapterProgress(id: number | string, progressData: UserCourseProgressResponse) {
    const data = progressData.subchapters;
    const subchapters = data.filter((sb) => sb.chapter === +id);
    const completed = subchapters.filter((sub) => sub.completed);
    return (completed.length / subchapters.length) * 100;
}

function calculateSubchapterProgress(id: number | string, progressData: UserCourseProgressResponse) {
    const data = progressData.pages;
    const subchapterPages = data.filter((sb) => sb.subchapter === id);
    const completed = subchapterPages.filter((sub) => sub.completed);
    return (completed.length / subchapterPages.length) * 100;
}

type EntityWithMenuOrder = ChapterData | SubChapter | Page;

function sortByOrderNumber(a: EntityWithMenuOrder, b: EntityWithMenuOrder) {
    return +a.attributes.menu!.orderNumber - b.attributes.menu!.orderNumber;
}

function mapMenuPages(pages: Page[], completionData: UserCourseProgressResponse, prependLinkUrl: string): MenuItem[] {
    if (!pages || pages.length === 0) return [];
    return pages
        .filter((page) => page.attributes.visible)
        .sort(sortByOrderNumber)
        .map((page) => {
            const mappedPage = {} as Partial<MenuItem>;
            mappedPage.level = 3;
            mappedPage.id = page.id;
            mappedPage.name = page.attributes.title;
            const icon = page.attributes.menu.icon as MenuType;
            mappedPage.type = icon || 'read';
            mappedPage.orderNumber = page.attributes.menu.orderNumber;
            mappedPage.completed = completionData.pages.find((pg) => pg.id === page.id)?.completed;
            mappedPage.href = `${prependLinkUrl}/${page.id}`;
            return mappedPage as MenuItem;
        });
}

function mapMenuSubChapters(
    subchapters: SubChapter[],
    completionData: UserCourseProgressResponse,
    prependLinkUrl: string
): MenuItem[] {
    if (!subchapters || subchapters.length === 0) return [];
    return subchapters
        .filter((subchapter) => subchapter.attributes.visible)
        .sort(sortByOrderNumber)
        .map((subchapter) => {
            const mappedSubChapter = {} as Partial<MenuItem>;
            const pages = subchapter.attributes.pages?.data;
            if (pages)
                mappedSubChapter.children = mapMenuPages(pages, completionData, `/${prependLinkUrl}/${subchapter.id}`);
            mappedSubChapter.name = subchapter.attributes.title;
            mappedSubChapter.progress = calculateSubchapterProgress(subchapter.id, completionData);
            mappedSubChapter.level = 2;
            mappedSubChapter.id = subchapter.id;
            mappedSubChapter.completed = completionData.subchapters.find((sb) => sb.id === subchapter.id)?.completed;
            return mappedSubChapter as MenuItem;
        });
}

export function mapMenuChapters(
    chaptersResponse: ChaptersResponse,
    completionData: UserCourseProgressResponse,
    courseUid: string
): MenuItem[] {
    const chapters = chaptersResponse.data?.data;
    if (!Array.isArray(chapters) || !chapters || chapters.length === 0) return [];
    return chapters
        .filter((chapter) => chapter.attributes.visible)
        .sort(sortByOrderNumber)
        .map((chapter) => {
            const { id: chapterId, attributes } = chapter;
            const chapterTitle = attributes.title;
            const subchapters = attributes.subchapters.data;
            const mappedChapter = {} as Partial<MenuItem>;
            mappedChapter.name = chapterTitle;
            mappedChapter.completed = completionData.chapters.find((chp) => chp.id === chapter.id)?.completed;
            mappedChapter.children = mapMenuSubChapters(
                subchapters,
                completionData,
                `courses/${courseUid}/${chapterId}`
            );
            mappedChapter.progress = calculateChapterProgress(chapter.id, completionData);
            mappedChapter.id = chapter.id;
            mappedChapter.level = 1;
            return mappedChapter as MenuItem;
        });
}
