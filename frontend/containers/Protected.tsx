import { useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import axiosdb from "../libs/api";


type ProtectedProps = {
    children: ReactNode | ReactNode[]
}

const Protected = ({ children }: ProtectedProps) => {

    const { data: session, status } = useSession();
    // useEffect(() => {
    //     const accessToken = session?.jwt;
    //     if (accessToken) {
    //         axiosdb.interceptors.request.use(
    //             (config) => {
    //                 if (config.headers) config.headers['Authorization'] = `Bearer ${accessToken}`;
    //                 return config;
    //             }
    //         )
    //     }
    // })

    // console.log('------session-------', session);

    // WILL USE THIS LATER ON FOR ROLE BASED ROUTES, OR FEATURE FLAG DETECTION
    if (!session) console.log('No Session detected')

    return (
        <>
            {children}
        </>
    )
};

export default Protected;