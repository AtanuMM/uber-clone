import React from 'react';

const variants = {
  primary: 'bg-primary-100 text-primary-800',
  secondary: 'bg-gray-100 text-gray-800',
  success: 'bg-green-100 text-green-800',
  danger: 'bg-red-100 text-red-800',
  warning: 'bg-yellow-100 text-yellow-800',
  info: 'bg-blue-100 text-blue-800',
  purple: 'bg-purple-100 text-purple-800',
  pink: 'bg-pink-100 text-pink-800'
};

const sizes = {
  xs: 'px-1.5 py-0.5 text-xs',
  sm: 'px-2 py-1 text-xs',
  md: 'px-2.5 py-1.5 text-sm',
  lg: 'px-3 py-2 text-base'
};

const Badge = ({
  children,
  variant = 'primary',
  size = 'sm',
  rounded = true,
  dot = false,
  removable = false,
  onRemove,
  className = ''
}) => {
  const baseClasses = 'inline-flex items-center font-medium';
  const variantClasses = variants[variant];
  const sizeClasses = sizes[size];
  const roundedClasses = rounded ? 'rounded-full' : 'rounded';

  return (
    <span className={`${baseClasses} ${variantClasses} ${sizeClasses} ${roundedClasses} ${className}`}>
      {dot && (
        <span
          className={`-ml-0.5 mr-1.5 h-2 w-2 rounded-full ${
            variant === 'primary' ? 'bg-primary-400' :
            variant === 'success' ? 'bg-green-400' :
            variant === 'danger' ? 'bg-red-400' :
            variant === 'warning' ? 'bg-yellow-400' :
            variant === 'info' ? 'bg-blue-400' :
            variant === 'purple' ? 'bg-purple-400' :
            variant === 'pink' ? 'bg-pink-400' :
            'bg-gray-400'
          }`}
        />
      )}
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className={`-mr-0.5 ml-1.5 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full focus:outline-none focus:text-white ${
            variant === 'primary' ? 'hover:bg-primary-200 focus:bg-primary-500' :
            variant === 'success' ? 'hover:bg-green-200 focus:bg-green-500' :
            variant === 'danger' ? 'hover:bg-red-200 focus:bg-red-500' :
            variant === 'warning' ? 'hover:bg-yellow-200 focus:bg-yellow-500' :
            variant === 'info' ? 'hover:bg-blue-200 focus:bg-blue-500' :
            variant === 'purple' ? 'hover:bg-purple-200 focus:bg-purple-500' :
            variant === 'pink' ? 'hover:bg-pink-200 focus:bg-pink-500' :
            'hover:bg-gray-200 focus:bg-gray-500'
          }`}
        >
          <span className="sr-only">Remove</span>
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

// Status Badge specifically for displaying status states
const StatusBadge = ({ status, className = '' }) => {
  const statusConfig = {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'secondary', label: 'Inactive' },
    pending: { variant: 'warning', label: 'Pending' },
    error: { variant: 'danger', label: 'Error' },
    completed: { variant: 'success', label: 'Completed' },
    cancelled: { variant: 'danger', label: 'Cancelled' },
    processing: { variant: 'info', label: 'Processing' }
  };

  const config = statusConfig[status] || statusConfig.inactive;

  return (
    <Badge
      variant={config.variant}
      dot={true}
      className={className}
    >
      {config.label}
    </Badge>
  );
};

// Example usage:
// <Badge variant="success" size="sm">Completed</Badge>
// <Badge variant="danger" removable onRemove={() => {}}>Remove me</Badge>
// <StatusBadge status="active" />

export { Badge, StatusBadge };