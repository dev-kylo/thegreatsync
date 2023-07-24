import { useEffect, useState } from 'react';

const useScrollToTop = (threshold: number) => {
    const [showScrollButton, setShowScrollButton] = useState(false);

    const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        console.log('work');
        e.preventDefault();
        const elem = document.querySelector('#contentBlock');
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY > threshold) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        });
    }, [threshold]);

    return { showScrollButton, handleScrollToTop };
};

export default useScrollToTop;
