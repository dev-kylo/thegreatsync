import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';

type ProtectedProps = {
    children: ReactNode | ReactNode[];
};

const Protected = ({ children }: ProtectedProps) => {
    const { data: session } = useSession();

    // console.log('------session-------', session);

    // WILL USE THIS LATER ON FOR ROLE BASED ROUTES, OR FEATURE FLAG DETECTION
    if (!session) console.log('No session.');

    return <div>{children}</div>;
};

export default Protected;
