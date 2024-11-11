import {
    ChaptersResponse,
    MenuItem,
    MenuType,
    Page,
    ChapterData,
    SubChapter,
    UserCourseProgressResponse,
    MenuParentChapter,
    MenuParentSubchapter,
    Menu,
} from '../types';

export function serverRedirectObject(url: string, permanent = true) {
    return {
        redirect: {
            destination: url,
            permanent,
        },
    };
}

function calculateChapterProgress(id: number | string, progressData?: UserCourseProgressResponse) {
    const data = progressData?.subchapters;
    if (!data || data.length < 1) return 0;
    const subchapters = data.filter((sb) => sb.chapter === +id);
    const completed = subchapters.filter((sub) => sub.completed);
    return (completed.length / subchapters.length) * 100;
}

function calculateSubchapterProgress(id: number | string, progressData?: UserCourseProgressResponse) {
    const data = progressData?.pages;
    if (!data || data.length < 1) return 0;
    const subchapterPages = data.filter((sb) => sb.subchapter === id);
    const completed = subchapterPages.filter((sub) => sub.completed);
    return (completed.length / subchapterPages.length) * 100;
}

type EntityWithMenuOrder = ChapterData | SubChapter | Page;

function getMenuData(menu: Menu[] | null, courseId: string | number) {
    if (!menu || menu.length === 0) return { id: 0, orderNumber: 1 } as Menu; // fallback if missing menu data
    // If there is only 1 menu, it will use this one
    if (menu.length === 1) return menu[0];
    // otherwise it looks for the one with matching courseID
    return menu.find((m) => `${m?.course?.data.id}` === `${courseId}`) || menu[0];
}

function sortByOrderNumber(a: EntityWithMenuOrder, b: EntityWithMenuOrder) {
    const aMenu = a.attributes.menu as Menu;
    const bMenu = b.attributes.menu as Menu;
    return +aMenu.orderNumber - bMenu.orderNumber;
}

function sortPagesWithMultipleMenusByOrderNumber(courseId: string | number) {
    return (a: EntityWithMenuOrder, b: EntityWithMenuOrder) => {
        const aMenu = getMenuData(a.attributes.menu as Menu[], courseId);
        const bMenu = getMenuData(b.attributes.menu as Menu[], courseId);
        return +aMenu.orderNumber - +bMenu.orderNumber;
    };
}

function mapMenuPages(
    pages: Page[],
    parent: MenuParentSubchapter,
    prependLinkUrl: string,
    courseId: string,
    completionData?: UserCourseProgressResponse
): MenuItem[] {
    if (!pages || pages.length === 0) return [];
    return pages
        .filter((page) => page.attributes.visible)
        .sort(sortPagesWithMultipleMenusByOrderNumber(courseId))
        .map((page) => {
            const mappedPage = {} as Partial<MenuItem>;
            const menuData = getMenuData(page.attributes.menu, courseId);
            mappedPage.level = 3;
            mappedPage.id = page.id;
            mappedPage.name = page.attributes.title;
            const icon = menuData.icon as MenuType;
            mappedPage.type = icon || 'read';
            mappedPage.orderNumber = menuData.orderNumber;
            mappedPage.completed = completionData && completionData.pages.find((pg) => pg.id === page.id)?.completed;
            mappedPage.href = `${prependLinkUrl}/${page.id}`;
            mappedPage.parent = { ...parent };
            return mappedPage as MenuItem;
        });
}

function mapMenuSubChapters(
    subchapters: SubChapter[],
    parent: MenuParentChapter,
    prependLinkUrl: string,
    courseId: string,
    completionData?: UserCourseProgressResponse
): MenuItem[] {
    if (!subchapters || subchapters.length === 0) return [];
    return subchapters
        .filter((subchapter) => subchapter.attributes.visible)
        .sort(sortByOrderNumber)
        .map((subchapter) => {
            const mappedSubChapter = {} as Partial<MenuItem>;
            const pages = subchapter.attributes.pages?.data;
            const parentData = {
                ...parent,
                subchapter: { id: subchapter.id, name: subchapter.attributes.title },
            };
            if (pages)
                mappedSubChapter.children = mapMenuPages(
                    pages,
                    parentData,
                    `/${prependLinkUrl}/${subchapter.id}`,
                    courseId,
                    completionData
                );
            mappedSubChapter.name = subchapter.attributes.title;
            mappedSubChapter.progress = calculateSubchapterProgress(subchapter.id, completionData);
            mappedSubChapter.level = 2;
            mappedSubChapter.id = subchapter.id;
            mappedSubChapter.completed =
                completionData && completionData.subchapters.find((sb) => sb.id === subchapter.id)?.completed;
            return mappedSubChapter as MenuItem;
        });
}

export function mapMenuChapters(
    chaptersResponse: ChaptersResponse,
    courseUid: string,
    completionData?: UserCourseProgressResponse
): MenuItem[] {
    const chapters = chaptersResponse?.data?.data;
    if (!Array.isArray(chapters) || !chapters || chapters.length === 0) return [];
    const completed = completionData && completionData.chapters ? completionData : undefined;

    return chapters
        .filter((chapter) => chapter.attributes.visible)
        .sort(sortByOrderNumber)
        .map((chapter) => {
            const { id: chapterId, attributes } = chapter;
            const chapterTitle = attributes.title;
            const parentData = { chapter: { id: chapterId, name: chapterTitle } };
            const subchapters = attributes.subchapters?.data;
            const mappedChapter = {} as Partial<MenuItem>;
            mappedChapter.name = chapterTitle;
            mappedChapter.completed = completed && completed.chapters.find((chp) => chp.id === chapter.id)?.completed;
            mappedChapter.children = mapMenuSubChapters(
                subchapters,
                parentData,
                `courses/${courseUid}/${chapterId}`,
                courseUid,
                completed
            );
            mappedChapter.progress = calculateChapterProgress(chapter.id, completed);
            mappedChapter.id = chapter.id;
            mappedChapter.level = 1;
            return mappedChapter as MenuItem;
        });
}

export function getDomainName(url: string) {
    let hostname;
    try {
        const urlObj = new URL(url);
        hostname = urlObj.hostname;
        // Remove "www" subdomain if present
        if (hostname.startsWith('www.')) {
            hostname = hostname.substring(4);
        }
    } catch (error) {
        console.error(`Invalid URL: ${error}`);
    }

    return hostname;
}
