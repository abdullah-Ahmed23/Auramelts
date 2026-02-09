import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
    children: ReactNode;
}

/**
 * PageTransition component
 * Wraps page content with smooth fade in/out animations
 */
const PageTransition = ({ children }: PageTransitionProps) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                duration: 0.3,
                ease: 'easeInOut'
            }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
