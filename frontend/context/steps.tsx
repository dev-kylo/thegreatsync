import React, { ReactNode, useEffect, useRef, useState } from "react";
import { mapMenuChapters } from "../libs/helpers";
import { MenuItem, ChaptersResponse, PageResponse, PageStep } from "../types";
import useSWR from 'swr'
import { getChapters, getPage } from "../services/queries";
import { DoublyLinkedList, Node } from "../libs/doublyLinkedList";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";



type NavProviderValues = {

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
    const [serverFetchedData, setServerFetchedData] = useState<PageResponse | null>(null);
    const [clientFetcherId, setClientFetcher] = useState(false);
    const { data, error } = useSWR(() => clientFetcher ? '/api/chapters' : null, getPage, { revalidateOnFocus: false, revalidateOnReconnect: false, shouldRetryOnError: false })
    const router = useRouter();
    const { pageId } = router.query as { pageId: string };


    const storeServerData = (data: PageResponse) => {
        setServerFetchedData(data);
    }

    const getData = () => {
        if (serverFetchedData) return serverFetchedData
        else {
            if (!clientFetcher) setClientFetcher(true);
            return data;
        }
    }

    function getSteps(){
        const pageData = getData()
        if (!pageData) return [];
        return pageData  .map((topic: Partial<PageStep>) => {
            topic.status = viewed.includes(topic.id!) ? 'complete' : 'default';
            return topic
        }) as PageStep[]
    
    }



    return (
        <NavContext.Provider value={{
            steps: getSteps() || pageSteps
        }}>
            {children}
        </NavContext.Provider>
    )

};

export default NavContextProvider;