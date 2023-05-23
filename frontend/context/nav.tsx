/* eslint-disable react/jsx-no-constructed-context-values */
import React, { ReactNode, useCallback, useEffect, useMemo } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { mapMenuChapters } from '../libs/helpers';
import { MenuItem } from '../types';
import { getChapters, getUserCompletions } from '../services/queries';
import { DoublyLinkedList } from '../libs/doublyLinkedList';
import { httpClient, setAuthToken } from '../libs/axios';

type NavProviderValues = {
    menuData?: MenuItem[];
    courseSequence?: DoublyLinkedList | null;
    nextPage: () => void;
    prevPage: () => void;
    showNext: boolean;
    showPrev: boolean;
    courseCompletionStat: number | null;
};

export const NavContext = React.createContext<NavProviderValues>({
    menuData: undefined,
    courseSequence: null,
    nextPage: () => {},
    prevPage: () => {},
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
    console.log('-------- AND Queue of PAGES -------');
    console.log(list.printList());
    return list;
}

const NavContextProvider = ({ children }: { children: ReactNode | ReactNode[] }) => {
    // const [showNextButton, setNextButton] = useState(true);
    // const [showPrevButton, setPrevButton] = useState(true);
    const { data: session } = useSession();

    const router = useRouter();
    const { courseId, pageId } = router.query as { courseId: string; pageId: string };

    const { data, error } = useSWR(
        () => (session && !!httpClient.defaults.headers.common.Authorization && courseId ? courseId : null),
        getChapters,
        { revalidateOnFocus: false, revalidateOnReconnect: false, shouldRetryOnError: false }
    );

    const { data: usercompletion, error: completionError } = useSWR(
        () =>
            session && !!httpClient.defaults.headers.common.Authorization && courseId
                ? { url: '/api/getUserCompletions', courseId }
                : null,
        getUserCompletions,
        { revalidateOnFocus: false, revalidateOnReconnect: false, shouldRetryOnError: false }
    );

    const menuChapters = useMemo(
        () => (data && courseId ? mapMenuChapters(data, courseId) : undefined),
        [data, courseId]
    );
    const courseSequence = useMemo(() => menuChapters && createList(menuChapters), [menuChapters]);

    useEffect(() => {
        if (session?.jwt) setAuthToken((session?.jwt as string) || '');
    }, [session?.jwt]);

    const nextPage = () => {
        if (!courseSequence) return;
        const nextNode = courseSequence.currentPageNode?.next;
        if (nextNode) {
            courseSequence.currentPageNode = nextNode;
            router.replace(nextNode.data.href!);
        }

        // STEPS TO SET COMPLETED
        // CHECK IF EXISTING IS ALREADY COMPLETED
        // IF NOT
        // FETCH CALL TO ADD ID TO COMPLETED ARRAY IN STRAPI
        // UPDATE COURSE SEQUENCE
    };

    const prevPage = () => {
        if (!courseSequence) return;
        const prevNode = courseSequence.currentPageNode?.previous;
        if (prevNode) {
            courseSequence.currentPageNode = prevNode;
            router.replace(prevNode.data.href!);
        }
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
        return (completed.length / courseSequence.getTotalNodes()) * 100;
    };

    const courseCompletionStat = usercompletion && courseSequence ? completionStat() : null;

    console.log({ courseCompletionStat });

    return (
        <NavContext.Provider
            value={{
                menuData: menuChapters,
                courseSequence,
                courseCompletionStat,
                showNext: !!courseSequence?.currentPageNode?.next,
                showPrev: true,
                nextPage,
                prevPage,
            }}
        >
            {children}
        </NavContext.Provider>
    );
};

export default NavContextProvider;
