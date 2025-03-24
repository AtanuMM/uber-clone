import React from 'react';

const sizes = {
  xs: 'h-4 w-4',
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
};

const variants = {
  primary: 'text-primary-600',
  white: 'text-white',
  gray: 'text-gray-600'
};

const Loading = ({
  size = 'md',
  variant = 'primary',
  fullScreen = false,
  className = ''
}) => {
  const sizeClass = sizes[size];
  const variantClass = variants[variant];

  const Spinner = () => (
    <svg
      className={`animate-spin ${sizeClass} ${variantClass} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75">
        <Spinner />
      </div>
    );
  }

  return <Spinner />;
};

// Loading overlay for cards and sections
const LoadingOverlay = ({ show = false, blur = false }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
      <Loading />
    </div>
  );
};

// Loading skeleton for content placeholders
const LoadingSkeleton = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-200 rounded ${className}`}></div>
);

// Example usage:
// <Loading size="lg" variant="primary" />
// <LoadingOverlay show={isLoading} />
// <LoadingSkeleton className="h-4 w-24" />

export { Loading, LoadingOverlay, LoadingSkeleton };