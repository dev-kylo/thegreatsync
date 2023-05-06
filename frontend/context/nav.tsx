import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { mapMenuChapters } from '../libs/helpers';
import { MenuItem } from '../types';
import { getChapters } from '../services/queries';
import { DoublyLinkedList } from '../libs/doublyLinkedList';
import { httpClient, setAuthToken } from '../libs/axios';

type NavProviderValues = {
    menuData?: MenuItem[];
    courseSequence?: DoublyLinkedList | null;
    nextPage: () => void;
    prevPage: () => void;
    showNext: boolean;
    showPrev: boolean;
};

export const NavContext = React.createContext<NavProviderValues>({
    menuData: undefined,
    courseSequence: null,
    nextPage: () => {},
    prevPage: () => {},
    showNext: false,
    showPrev: false,
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
    const [courseUid, setCourseUid] = useState('learn-js');
    const [showNextButton, setNextButton] = useState(true);
    const [showPrevButton, setPrevButton] = useState(true);
    const { data: session } = useSession();
    // const [courseData, setCourseData] = useState<MenuItem[]>([]);
    // const courseSequence = useRef<DoublyLinkedList | null>(null);
    const [hasAuth, setHasAuth] = useState(false);

    const { data, error } = useSWR(
        () => (session && !!httpClient.defaults.headers.common.Authorization ? '/api/chapters' : null),
        getChapters,
        { revalidateOnFocus: false, revalidateOnReconnect: false, shouldRetryOnError: false }
    );
    const router = useRouter();
    const { pageId } = router.query as { pageId: string };

    const menuChapters = useMemo(() => data && mapMenuChapters(data, 'learn-js'), [data]);
    const courseSequence = useMemo(() => menuChapters && createList(menuChapters), [menuChapters]);

    useEffect(() => {
        if (session?.jwt) setAuthToken(session?.jwt || '');
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

    console.log({ error });

    return (
        <NavContext.Provider
            value={{
                menuData: menuChapters,
                courseSequence,
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
