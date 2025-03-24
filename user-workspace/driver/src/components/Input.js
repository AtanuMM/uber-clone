import React from 'react';

const variants = {
  default: 'border-gray-300 focus:ring-primary-500 focus:border-primary-500',
  error: 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500',
  success: 'border-green-300 text-green-900 placeholder-green-300 focus:ring-green-500 focus:border-green-500',
};

const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-3 py-2',
  lg: 'px-4 py-3 text-lg',
};

const Input = ({
  type = 'text',
  label,
  error,
  success,
  size = 'md',
  fullWidth = false,
  className = '',
  icon: Icon,
  ...props
}) => {
  const variant = error ? 'error' : success ? 'success' : 'default';
  
  const baseClasses = 'block rounded-md shadow-sm focus:outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed';
  const variantClasses = variants[variant];
  const sizeClasses = sizes[size];
  const widthClasses = fullWidth ? 'w-full' : '';
  const iconClasses = Icon ? 'pl-10' : '';

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label
          htmlFor={props.id}
          className={`block text-sm font-medium mb-1 ${
            error ? 'text-red-600' : 'text-gray-700'
          }`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon
              className={`h-5 w-5 ${
                error ? 'text-red-400' : success ? 'text-green-400' : 'text-gray-400'
              }`}
            />
          </div>
        )}
        <input
          type={type}
          className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${iconClasses} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {success && !error && (
        <p className="mt-1 text-sm text-green-600">{success}</p>
      )}
    </div>
  );
};

export default Input;