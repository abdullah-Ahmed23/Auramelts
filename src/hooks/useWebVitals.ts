import { useEffect } from 'react';

/**
 * Hook to track Core Web Vitals for performance monitoring
 * Tracks: LCP, FID, CLS, TTFB, INP
 */
export const useWebVitals = () => {
    useEffect(() => {
        // Only run in production
        if (import.meta.env.DEV) {
            return;
        }

        // Dynamically import web-vitals to avoid bundle bloat
        import('web-vitals').then(({ onCLS, onFID, onLCP, onTTFB, onINP }) => {
            const reportMetric = (metric: any) => {
                // Log to console in development
                console.log(metric);

                // Send to analytics in production
                if (window.gtag) {
                    window.gtag('event', metric.name, {
                        value: Math.round(metric.value),
                        metric_id: metric.id,
                        metric_delta: metric.delta,
                        metric_rating: metric.rating,
                    });
                }

                // You can also send to other analytics services
                // Example: Supabase, PostHog, etc.
            };

            // Track all Core Web Vitals
            onCLS(reportMetric);
            onFID(reportMetric);
            onLCP(reportMetric);
            onTTFB(reportMetric);
            onINP(reportMetric);
        }).catch((error) => {
            console.error('Failed to load web-vitals:', error);
        });
    }, []);
};

// Extend Window interface for TypeScript
declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
    }
}
