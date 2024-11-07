/* eslint-disable react/jsx-no-constructed-context-values */
import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { mapMenuChapters } from '../libs/helpers';
import { MenuItem, UserCourseProgressResponse } from '../types';
import { getChapters, getUserCompletions } from '../services/queries';
import { DoublyLinkedList } from '../libs/doublyLinkedList';
import { setAuthToken } from '../libs/axios';
import { completePage } from '../services/mutations';

type NavProviderValues = {
    courseId?: string | number;
    subChapterName?: string;
    pageName?: string;
    chapterName?: string;
    menuData?: MenuItem[];
    courseSequence?: DoublyLinkedList | null;
    nextPage: () => void;
    prevPage: () => void;
    markPage: (page: string | number, unMark?: boolean) => Promise<void>;
    setLoadingPage: (val: boolean) => void;
    loadingPage: boolean;
    showNext: boolean;
    showPrev: boolean;
    courseCompletionStat: number | null;
};

export const NavContext = React.createContext<NavProviderValues>({
    courseId: undefined,
    subChapterName: '',
    chapterName: '',
    pageName: '',
    menuData: undefined,
    courseSequence: null,
    nextPage: () => {},
    prevPage: () => {},
    markPage: () => Promise.resolve(),
    setLoadingPage: () => {},
    loadingPage: false,
    showNext: false,
    showPrev: false,
    courseCompletionStat: null,
});

function addToList(item: MenuItem, list: DoublyLinkedList) {
    if (item.children) item.children.forEach((itemChild) => addToList(itemChild, list));
    else list.addToTail(item);
}

function createList(menuItems: MenuItem[]) {
    const list = new DoublyLinkedList();
    menuItems.forEach((item) => addToList(item, list));
    return list;
}

function receivedCompletionData(completionData?: UserCourseProgressResponse) {
    return !!(completionData && completionData?.pages);
}

const NavContextProvider = ({ children }: { children: ReactNode | ReactNode[] }) => {
    const { data: session } = useSession();
    const [loadingPage, setLoadingPage] = useState(false);
    const router = useRouter();
    const { courseId, pageId } = router.query as { courseId: string; pageId: string };
    const [chapterLocation, setChapterLocation] = useState<{ chapter: string; subchapter: string } | null>();
    const lastCompletedPage = useRef<string | number>('');

    const { data, error } = useSWR(() => (session && courseId ? courseId : null), getChapters, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,
    });

    const {
        data: usercompletion,
        error: completionError,
        mutate,
    } = useSWR(() => (session && courseId ? { url: '/api/getUserCompletions', courseId } : null), getUserCompletions, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        shouldRetryOnError: false,
    });

    const menuChapters = useMemo(
        () => (data && usercompletion ? mapMenuChapters(data, courseId, usercompletion) : undefined),
        [data, courseId, usercompletion]
    );

    const courseSequence = useMemo(() => menuChapters && createList(menuChapters), [menuChapters]);

    useEffect(() => {
        if (session?.jwt) setAuthToken((session?.jwt as string) || '');
    }, [session?.jwt]);

    const setLocation = (menuItem?: MenuItem) => {
        if (!menuItem) return;
        const chapterName = menuItem.parent.chapter?.name;
        const subChapterName = menuItem.parent.subchapter?.name;
        setChapterLocation({ chapter: chapterName || '', subchapter: subChapterName || '' });
    };

    const nextPage = useCallback(() => {
        if (!courseSequence || !courseSequence.currentPageNode) return;
        setLoadingPage(true);
        if (courseSequence.currentPageNode?.data) courseSequence.currentPageNode.data.completed = true;
        const nextNode = courseSequence.currentPageNode?.next || courseSequence.getFirstUncompleted();
        let redirectUrl = '/';
        if (nextNode && nextNode?.data) {
            courseSequence.currentPageNode = nextNode;
            setLocation(nextNode.data);
            redirectUrl = nextNode.data.href!;
        } else redirectUrl = '/courseCompleted';
        setLoadingPage(false);
        router.push(redirectUrl);
    }, [courseSequence, router]);

    const prevPage = useCallback(() => {
        if (!courseSequence) return;
        setLoadingPage(true);
        const prevNode = courseSequence.currentPageNode?.previous;
        if (prevNode && prevNode?.data) {
            courseSequence.currentPageNode = prevNode;
            setLoadingPage(false);
            setLocation(prevNode.data);
            router.push(prevNode.data.href!);
        } else setLoadingPage(false);
    }, [courseSequence, router]);

    // mark a page complete
    const markPage = useCallback(
        async (page: string | number, unMark?: boolean) => {
            await completePage(courseId, page, unMark);
            await mutate();
        },
        [courseId, mutate]
    );

    // On load of a page, update pageId
    useEffect(() => {
        if (
            courseId &&
            receivedCompletionData(usercompletion) &&
            !usercompletion?.pages?.find((cm) => cm.id === +pageId)?.completed &&
            lastCompletedPage.current !== pageId
        ) {
            if (courseId && pageId) {
                completePage(courseId, pageId);
                lastCompletedPage.current = pageId;
            }
            mutate(); // Fetch new completion data
        }
    }, [courseId, pageId, usercompletion, mutate]);

    useEffect(() => {
        const list = courseSequence;
        if (!chapterLocation) setLocation(courseSequence?.currentPageNode?.data);
        if (pageId && list) {
            if (+pageId !== list.currentPageNode?.data?.id) {
                const foundNode = list.getByDataId(+pageId);
                if (foundNode && foundNode?.data) {
                    list.currentPageNode = foundNode;
                    setLocation(foundNode.data);
                }
            }
        }
    }, [pageId, courseSequence, chapterLocation]);

    const completionStat = () => {
        if (!usercompletion || !usercompletion.pages || !courseSequence) return null;
        const completed = usercompletion.pages.filter((pg) => pg.completed);
        return Math.round((completed.length / courseSequence.getTotalNodes()) * 100);
    };

    if (error) console.error(error);
    if (completionError) console.error(completionError);

    const courseCompletionStat = receivedCompletionData(usercompletion) && courseSequence ? completionStat() : null;

    return (
        <NavContext.Provider
            value={{
                chapterName: chapterLocation?.chapter || '',
                subChapterName: chapterLocation?.subchapter || '',
                pageName: courseSequence?.currentPageNode?.data?.name || '',
                courseId,
                menuData: menuChapters,
                courseSequence,
                courseCompletionStat,
                showNext: !courseSequence?.currentPageNode ? false : !(`${courseSequence?.tail?.data?.id}` === pageId),
                showPrev: !courseSequence?.currentPageNode ? false : !(`${courseSequence?.head?.data?.id}` === pageId),
                loadingPage,
                setLoadingPage,
                nextPage,
                prevPage,
                markPage,
            }}
        >
            {children}
        </NavContext.Provider>
    );
};

export default NavContextProvider;
