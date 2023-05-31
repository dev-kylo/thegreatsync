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
    console.log(menuItems);
    menuItems.forEach((item) => addToList(item, list));
    return list;
}

const NavContextProvider = ({ children }: { children: ReactNode | ReactNode[] }) => {
    // const [showNextButton, setNextButton] = useState(true);
    // const [showPrevButton, setPrevButton] = useState(true);
    const { data: session } = useSession();
    const [loadingPage, setLoadingPage] = useState(false);
    const router = useRouter();
    const { courseId, pageId } = router.query as { courseId: string; pageId: string };

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
            router.replace(prevNode.data.href!);
        } else setLoadingPage(false);
    };

    useEffect(() => {
        const list = courseSequence;
        if (pageId && list) {
            if (+pageId !== list.currentPageNode?.data.id) {
                const foundNode = list.getByDataId(+pageId);
                if (foundNode) list.currentPageNode = foundNode;
            }
        }
    }, [pageId, courseSequence]);

    console.log({ error, completionError });

    const completionStat = () => {
        if (!usercompletion || !courseSequence) return null;
        const completed = usercompletion.pages.filter((pg) => pg.completed);
        return Math.round((completed.length / courseSequence.getTotalNodes()) * 100);
    };

    const courseCompletionStat = usercompletion && courseSequence ? completionStat() : null;

    console.log({ courseCompletionStat });
    const chapterName = courseSequence?.currentPageNode?.data?.parent.chapter?.name;
    const subChapterName = courseSequence?.currentPageNode?.data?.parent.subchapter?.name;

    return (
        <NavContext.Provider
            value={{
                chapterName,
                courseId,
                subChapterName,
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
