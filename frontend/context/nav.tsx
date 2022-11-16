import React, { ReactNode, useState } from "react";
import { mapMenuChapters } from "../libs/helpers";
import { MenuItem, ChaptersResponse } from "../types";
import useSWR from 'swr'
import { getChapters } from "../services/queries";

export const NavContext = React.createContext<{ menuData: MenuItem[] }>({
    menuData: []
});



const NavContextProvider = ({ children }: { children: ReactNode | ReactNode[] }) => {

    const [course, setCourse] = useState(null);

    const { data, error } = useSWR('/api/chapters', getChapters) // update so it only fetches when course is truthy


    return (
        <NavContext.Provider value={{ menuData: data ? mapMenuChapters(data, 'the-great-sync-learn-js') : [] }}>
            {children}
        </NavContext.Provider>
    )

};

export default NavContextProvider;