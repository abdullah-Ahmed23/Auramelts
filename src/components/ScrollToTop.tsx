import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component
 * Automatically scrolls to the top of the page when navigating to a new route
 * Uses instant scrolling for immediate feedback
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Scroll to top immediately on route change
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' // Instant scroll for immediate feedback
        });
    }, [pathname]);

    return null;
};

export default ScrollToTop;
