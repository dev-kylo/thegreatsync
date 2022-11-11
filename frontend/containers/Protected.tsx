import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { ReactNode } from "react";


type ProtectedProps = {
    children: ReactNode | ReactNode[]
}

const Protected = ({ children }: ProtectedProps) => {

    const { data: session, status } = useSession();

    console.log(session)

    // WILL USE THIS LATER ON FOR ROLE BASED ROUTES, OR FEATURE FLAG DETECTION
    if (!session) console.log('No Session detected')

    return (
        <>
            {children}
        </>
    )
};

export default Protected;