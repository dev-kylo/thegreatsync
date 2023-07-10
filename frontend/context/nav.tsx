/* eslint-disable react/jsx-no-constructed-context-values */
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { mapMenuChapters } from '../libs/helpers';
import { MenuItem } from '../types';
import { getChapters, getUserCompletions } from '../services/queries';
import { DoublyLinkedList } from '../libs/doublyLinkedList';
import { httpClient, setAuthToken } from '../libs/axios';
import { completePage } from '../services/mutations';

type NavProviderValues = {
    courseId?: string | number;
    subChapterName?: string;
    chapterName?: string;
    menuData?: MenuItem[];
    courseSequence?: DoublyLinkedList | null;
    nextPage: () => void;
    prevPage: () => void;
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
    menuData: undefined,
    courseSequence: null,
    nextPage: () => {},
    prevPage: () => {},
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

const NavContextProvider = ({ children }: { children: ReactNode | ReactNode[] }) => {
    const { data: session } = useSession();
    const [loadingPage, setLoadingPage] = useState(false);
    const router = useRouter();
    const { courseId, pageId } = router.query as { courseId: string; pageId: string };
    const [chapterLocation, setChapterLocation] = useState<{ chapter: string; subchapter: string } | null>();

    const { data, error } = useSWR(
        () => (session && !!httpClient.defaults.headers.common.Authorization && courseId ? courseId : null),
        getChapters,
        { revalidateOnFocus: false, revalidateOnReconnect: false, shouldRetryOnError: false }
    );

    const {
        data: usercompletion,
        error: completionError,
        mutate,
    } = useSWR(
        () =>
            session && !!httpClient.defaults.headers.common.Authorization && courseId
                ? { url: '/api/getUserCompletions', courseId }
                : null,
        getUserCompletions,
        { revalidateOnFocus: false, revalidateOnReconnect: false, shouldRetryOnError: false }
    );

    const menuChapters = useMemo(
        () => (data && usercompletion ? mapMenuChapters(data, usercompletion, courseId) : undefined),
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

    const nextPage = async () => {
        if (!courseSequence || !courseSequence.currentPageNode) return;
        setLoadingPage(true);
        await completePage(courseId, courseSequence.currentPageNode.data.id);
        courseSequence.currentPageNode.data.completed = true;
        mutate(); // Fetch new completion data
        const nextNode = courseSequence.currentPageNode?.next || courseSequence.getFirstUncompleted();
        if (nextNode) {
            courseSequence.currentPageNode = nextNode;
            setLoadingPage(false);
            setLocation(nextNode.data);
            router.replace(nextNode.data.href!);
        } else {
            setLoadingPage(false);
            router.replace('/courseCompleted');
        }
    };

    const prevPage = () => {
        if (!courseSequence) return;
        setLoadingPage(true);
        const prevNode = courseSequence.currentPageNode?.previous;
        if (prevNode) {
            courseSequence.currentPageNode = prevNode;
            setLoadingPage(false);
            setLocation(prevNode.data);
            router.replace(prevNode.data.href!);
        } else setLoadingPage(false);
    };

    useEffect(() => {
        const list = courseSequence;
        if (pageId && list) {
            if (+pageId !== list.currentPageNode?.data.id) {
                const foundNode = list.getByDataId(+pageId);
                if (foundNode) {
                    list.currentPageNode = foundNode;
                    setLocation(foundNode.data);
                }
            }
        }
    }, [pageId, courseSequence]);

    const completionStat = () => {
        if (!usercompletion || !courseSequence) return null;
        const completed = usercompletion.pages.filter((pg) => pg.completed);
        return Math.round((completed.length / courseSequence.getTotalNodes()) * 100);
    };

    if (error) console.log(error);
    if (completionError) console.log(completionError);

    const courseCompletionStat = usercompletion && courseSequence ? completionStat() : null;

    return (
        <NavContext.Provider
            value={{
                chapterName: chapterLocation?.chapter || '',
                subChapterName: chapterLocation?.subchapter || '',
                courseId,
                menuData: menuChapters,
                courseSequence,
                courseCompletionStat,
                showNext: !!courseSequence?.currentPageNode?.next,
                showPrev: true,
                loadingPage,
                setLoadingPage,
                nextPage,
                prevPage,
            }}
        >
            {children}
        </NavContext.Provider>
    );
};

export default NavContextProvider;
