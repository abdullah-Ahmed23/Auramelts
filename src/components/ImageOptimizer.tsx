/**
 * Image Optimizer Component
 * Provides responsive images with modern formats (WebP/AVIF)
 * and lazy loading for better performance
 */

import { useState } from 'react';

interface ImageOptimizerProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    sizes?: string;
}

export const ImageOptimizer = ({
    src,
    alt,
    width,
    height,
    className = '',
    priority = false,
    sizes = '100vw'
}: ImageOptimizerProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Generate srcset for responsive images
    const generateSrcSet = (baseSrc: string, format?: string) => {
        const widths = [320, 640, 768, 1024, 1280, 1536];
        const formatParam = format ? `&format=${format}` : '';

        return widths
            .map(w => `${baseSrc}?w=${w}${formatParam} ${w}w`)
            .join(', ');
    };

    // Fallback image
    const fallbackSrc = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3C/svg%3E';

    return (
        <picture>
            {/* AVIF format - best compression */}
            <source
                srcSet={generateSrcSet(src, 'avif')}
                type="image/avif"
                sizes={sizes}
            />

            {/* WebP format - good compression, wide support */}
            <source
                srcSet={generateSrcSet(src, 'webp')}
                type="image/webp"
                sizes={sizes}
            />

            {/* Fallback to original format */}
            <img
                src={hasError ? fallbackSrc : src}
                alt={alt}
                width={width}
                height={height}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
                    } ${className}`}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    setHasError(true);
                    setIsLoaded(true);
                }}
                style={{
                    aspectRatio: width && height ? `${width} / ${height}` : undefined,
                }}
            />
        </picture>
    );
};
