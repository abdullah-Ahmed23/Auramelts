import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component
 * Automatically scrolls to the top of the page when navigating to a new route
 * Delays scroll to allow page transition fade-out to complete smoothly
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // Delay scroll to top to allow fade-out animation to complete
        // This prevents the jarring "jump to top then fade" effect
        const timer = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 150); // Half of the 300ms transition duration

        return () => clearTimeout(timer);
    }, [pathname]);

    return null;
};

export default ScrollToTop;
