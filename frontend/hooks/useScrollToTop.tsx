import { useEffect, useState } from 'react';

const useScrollToTop = (threshold = 0) => {
    const [showScrollButton, setShowScrollButton] = useState(false);

    const handleScrollToTop = () => {
        console.log('work');
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth', // You can change this to 'auto' for instant scrolling
        });
    };

    useEffect(() => {
        console.log(window.onscroll);
        window.addEventListener('scroll', () => {
            console.log(window.scrollY);
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
