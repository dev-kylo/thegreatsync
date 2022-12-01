import React, { ReactNode, useEffect, useRef, useState } from "react";
import { mapMenuChapters } from "../libs/helpers";
import { MenuItem, ChaptersResponse } from "../types";
import useSWR from 'swr'
import { getChapters } from "../services/queries";
import { DoublyLinkedList, Node } from "../libs/doublyLinkedList";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";



type NavProviderValues = {
    menuData: MenuItem[]
    courseSequence?: DoublyLinkedList | null
    nextPage: () => void
    prevPage: () => void
    showNext: boolean
    showPrev: boolean
}

export const NavContext = React.createContext<NavProviderValues>({
    menuData: [],
    courseSequence: null,
    nextPage: () => { },
    prevPage: () => { },
    showNext: false,
    showPrev: false
});

function addToList(item: MenuItem, list: DoublyLinkedList) {
    if (item.children) item.children.forEach(itemChild => addToList(itemChild, list))
    else list.addToTail(item)
}

function createList(menuItems: MenuItem[]) {
    const list = new DoublyLinkedList();
    menuItems.forEach(item => addToList(item, list));
    console.log('-------- AND Queue of PAGES -------');
    console.log(list.printList())
    return list
}


const NavContextProvider = ({ children }: { children: ReactNode | ReactNode[] }) => {

    const [courseUid, setCourseUid] = useState('learn-js-inside-the-great-sync');
    const [showNextButton, setNextButton] = useState(true);
    const [showPrevButton, setPrevButton] = useState(true);
    const { data: session, status } = useSession();
    const [courseData, setCourseData] = useState<MenuItem[]>([]);
    const courseSequence = useRef<DoublyLinkedList | null>(null);

    const { data, error } = useSWR(() => session ? '/api/chapters' : null, getChapters, { revalidateOnFocus: false, revalidateOnReconnect: false, shouldRetryOnError: false })
    const router = useRouter();
    const { pageId } = router.query as { pageId: string };


    const nextPage = () => {
        if (!courseSequence.current) return;
        const nextNode = courseSequence.current.currentPageNode?.next;
        if (nextNode) {
            courseSequence.current.currentPageNode = nextNode;
            router.replace(nextNode.data.href!)
        }
    }

    const prevPage = () => {
        if (!courseSequence.current) return;
        const prevNode = courseSequence.current.currentPageNode?.previous;
        if (prevNode) {
            courseSequence.current.currentPageNode = prevNode;
            router.replace(prevNode.data.href!)
        }
    }

    useEffect(() => {
        const list = courseSequence.current;
        if (pageId && list) {
            if (+pageId !== list.currentPageNode?.data.id) {
                const foundNode = list.getByDataId(+pageId);
                if (foundNode) list.currentPageNode = foundNode
            }
        }
    }, [pageId, courseSequence.current])

    useEffect(() => {
        if (data && (courseData.length < 1)) {
            console.log('Setting Page Doubly Linked List')
            const mappedMenuItems = mapMenuChapters(data, 'learn-js-inside-the-great-sync');
            setCourseData(mappedMenuItems);
            courseSequence.current = createList(mappedMenuItems)
        }
    }, [data])

    return (
        <NavContext.Provider value={{
            menuData: courseData,
            courseSequence: courseSequence.current,
            showNext: !!(courseSequence.current?.currentPageNode?.next),
            showPrev: true,
            nextPage,
            prevPage
        }}>
            {children}
        </NavContext.Provider>
    )

};

export default NavContextProvider;