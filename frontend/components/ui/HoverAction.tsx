import { useState } from 'react';
import Spinner from './Spinner';

const HoverAction = ({
    action,
    pageId,
    children,
    unMark,
}: {
    pageId: string | number;
    children: React.ReactNode;
    unMark?: boolean;
    action: (page: string | number, unMark?: boolean) => Promise<void>;
}) => {
    const [hovered, setHovered] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const hoverBox = (
        <aside className="bg-transparent shadow sm:rounded-lg absolute top-0 right-0 z-50">
            <div className="mt-8">
                <button
                    onClick={async (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log({ action, pageId });
                        setIsLoading(true);
                        await action(pageId, unMark);
                        setIsLoading(false);
                    }}
                    type="button"
                    disabled={isLoading}
                    className={`${
                        unMark ? 'bg-secondary_red' : 'bg-primary_green'
                    } inline-flex items-center justify-center w-40 rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500`}
                >
                    {unMark && !isLoading ? 'mark incomplete' : null}
                    {!unMark && !isLoading ? 'mark complete' : null}
                    {isLoading && <Spinner />}
                </button>
            </div>
        </aside>
    );

    if (!action) return <div>{children}</div>;

    return (
        <button
            type="button"
            className="relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {hovered ? hoverBox : null}

            {children}
        </button>
    );
};

export default HoverAction;
