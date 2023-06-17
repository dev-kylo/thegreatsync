import { useEffect, useRef, useState } from 'react';

const useResponsivePanes = () => {
    const [visiblePane, setVisiblePane] = useState<'image' | 'text' | 'code'>('image');
    const [resizedToMobile, setResizedToMobile] = useState(false);
    const mql = useRef(typeof window !== 'undefined' && window.matchMedia('(max-width: 1200px)'));

    useEffect(() => {
        if (mql && mql.current) {
            mql.current.addEventListener('change', (e) => {
                if (e.matches) setResizedToMobile(true);
                else setResizedToMobile(false);
            });
        }
    }, []);

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1200;

    return {
        isMobile: isMobile || resizedToMobile,
        visiblePane,
        setVisiblePane,
    };
};

export default useResponsivePanes;
