import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width = '100%', 
  height = '1rem' 
}) => (
  <div
    className={`animate-pulse bg-gray-200 rounded ${className}`}
    style={{ width, height }}
  />
);

export const GoalItemSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md border border-gray-100">
    {/* Header */}
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2 sm:gap-3 flex-1">
        <Skeleton width="16px" height="16px" className="rounded" />
        <Skeleton width="40px" height="40px" className="rounded-full" />
        <div className="flex-1">
          <Skeleton width="60%" height="20px" className="mb-2" />
          <Skeleton width="40%" height="16px" />
        </div>
      </div>
      <div className="flex space-x-1.5 ml-2">
        <Skeleton width="80px" height="36px" className="rounded-xl" />
        <Skeleton width="36px" height="36px" className="rounded-xl" />
      </div>
    </div>

    {/* Amount */}
    <div className="text-center mb-4">
      <Skeleton width="50%" height="28px" className="mb-1 mx-auto" />
      <Skeleton width="30%" height="16px" className="mx-auto" />
    </div>

    {/* Progress bar */}
    <div className="mb-4">
      <div className="flex justify-between mb-2">
        <Skeleton width="60px" height="16px" />
        <Skeleton width="40px" height="16px" />
      </div>
      <Skeleton width="100%" height="12px" className="rounded-full" />
    </div>

    {/* Footer */}
    <div className="flex items-center justify-between">
      <Skeleton width="100px" height="16px" />
      <Skeleton width="80px" height="24px" className="rounded-full" />
    </div>

    {/* Remaining amount */}
    <div className="mt-3">
      <Skeleton width="100%" height="40px" className="rounded-lg" />
    </div>
  </div>
);

export const TransactionItemSkeleton: React.FC = () => (
  <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4 flex-1">
        <Skeleton width="48px" height="48px" className="rounded-full" />
        <div className="flex-1">
          <Skeleton width="70%" height="20px" className="mb-2" />
          <Skeleton width="50%" height="16px" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <Skeleton width="80px" height="24px" className="mb-1" />
          <Skeleton width="60px" height="16px" />
        </div>
        <div className="flex space-x-2">
          <Skeleton width="36px" height="36px" className="rounded-lg" />
          <Skeleton width="36px" height="36px" className="rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md',
  color = 'text-blue-600'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex justify-center items-center py-4">
      <div className={`animate-spin ${sizeClasses[size]} ${color}`}>
        <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    </div>
  );
};
