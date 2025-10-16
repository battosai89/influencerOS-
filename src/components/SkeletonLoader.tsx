import * as React from 'react';

// FIX: Implemented the SkeletonLoader component which was previously missing.
interface SkeletonLoaderProps {
    className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ className = 'h-4 bg-brand-surface rounded' }) => {
    return (
        <div className={`animate-pulse ${className}`}></div>
    );
};

export default SkeletonLoader;
