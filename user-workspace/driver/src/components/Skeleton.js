import React from 'react';

const Skeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
  count = 1,
  animate = true
}) => {
  const baseClasses = 'bg-gray-200 rounded';
  const animationClasses = animate ? 'animate-pulse' : '';

  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 w-3/4';
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-md';
      case 'avatar':
        return 'rounded-full h-10 w-10';
      default:
        return '';
    }
  };

  const style = {
    width: width,
    height: height
  };

  const renderSkeleton = () => (
    <div
      className={`${baseClasses} ${animationClasses} ${getVariantClasses()} ${className}`}
      style={style}
    />
  );

  if (count === 1) {
    return renderSkeleton();
  }

  return (
    <div className="space-y-2">
      {[...Array(count)].map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
};

// Predefined skeleton layouts
const TableRowSkeleton = ({ columns = 4, className = '' }) => (
  <div className={`flex space-x-4 p-4 ${className}`}>
    {[...Array(columns)].map((_, index) => (
      <Skeleton
        key={index}
        className={`flex-1 ${index === 0 ? 'w-1/4' : ''}`}
      />
    ))}
  </div>
);

const CardSkeleton = ({ className = '' }) => (
  <div className={`p-4 border rounded-lg shadow-sm ${className}`}>
    <Skeleton className="w-3/4 mb-4" />
    <Skeleton count={3} className="w-full" />
    <div className="flex justify-end mt-4 space-x-2">
      <Skeleton width={100} height={36} variant="rectangular" />
      <Skeleton width={100} height={36} variant="rectangular" />
    </div>
  </div>
);

const ProfileSkeleton = ({ className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    <div className="flex items-center space-x-4">
      <Skeleton variant="avatar" width={64} height={64} />
      <div className="flex-1">
        <Skeleton className="w-1/3 mb-2" />
        <Skeleton className="w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton count={4} className="w-full" />
    </div>
  </div>
);

const StatsSkeleton = ({ count = 4, className = '' }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
    {[...Array(count)].map((_, index) => (
      <div key={index} className="p-4 border rounded-lg">
        <Skeleton className="w-1/2 mb-2" />
        <Skeleton className="w-3/4" />
      </div>
    ))}
  </div>
);

// Example usage:
// Basic skeleton
// <Skeleton />
// <Skeleton variant="text" width={200} />
// <Skeleton variant="circular" width={40} height={40} />
// <Skeleton variant="rectangular" width="100%" height={200} />
// <Skeleton count={3} className="w-full" />

// Predefined layouts
// <TableRowSkeleton columns={4} />
// <CardSkeleton />
// <ProfileSkeleton />
// <StatsSkeleton count={4} />

export {
  Skeleton,
  TableRowSkeleton,
  CardSkeleton,
  ProfileSkeleton,
  StatsSkeleton
};