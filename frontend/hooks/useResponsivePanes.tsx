import { useEffect, useRef, useState } from 'react';

type PaneTypes = 'image' | 'text' | 'code';

const useResponsivePanes = (visibleMobilePane?: PaneTypes) => {
    const [visiblePane, setVisiblePane] = useState<PaneTypes>(visibleMobilePane || 'image');
    const mql = useRef(typeof window !== 'undefined' && window.matchMedia('(max-width: 1200px)'));
    const [resizedToMobile, setResizedToMobile] = useState(
        typeof window !== 'undefined' && mql.current && mql.current.matches
    );

    useEffect(() => {
        if (typeof window !== 'undefined' && !mql.current) {
            mql.current = window.matchMedia('(max-width: 1200px)');
        }
        if (mql && mql.current) {
            mql.current.addEventListener('change', (e) => {
                if (e.matches) setResizedToMobile(true);
                else setResizedToMobile(false);
            });
        }
    }, []);

    const isMobile = typeof window !== 'undefined' && mql.current && mql.current.matches;

    return {
        isMobile: isMobile || resizedToMobile,
        visiblePane,
        setVisiblePane,
    };
};

export default useResponsivePanes;
