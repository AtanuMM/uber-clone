import React from 'react';
import { UserIcon } from '@heroicons/react/24/solid';

const sizes = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-14 w-14 text-xl',
  '2xl': 'h-16 w-16 text-2xl'
};

const variants = {
  circle: 'rounded-full',
  square: 'rounded-lg'
};

const colors = {
  gray: 'bg-gray-100 text-gray-600',
  red: 'bg-red-100 text-red-600',
  yellow: 'bg-yellow-100 text-yellow-600',
  green: 'bg-green-100 text-green-600',
  blue: 'bg-blue-100 text-blue-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  purple: 'bg-purple-100 text-purple-600',
  pink: 'bg-pink-100 text-pink-600'
};

const Avatar = ({
  src,
  alt,
  size = 'md',
  variant = 'circle',
  color = 'gray',
  fallback,
  className = '',
  ...props
}) => {
  const [error, setError] = React.useState(false);

  const handleError = () => {
    setError(true);
  };

  const sizeClass = sizes[size];
  const variantClass = variants[variant];
  const colorClass = colors[color];

  if (!src || error) {
    return (
      <div
        className={`inline-flex items-center justify-center ${sizeClass} ${variantClass} ${colorClass} ${className}`}
        {...props}
      >
        {fallback || (
          <UserIcon className="h-1/2 w-1/2" />
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={handleError}
      className={`object-cover ${sizeClass} ${variantClass} ${className}`}
      {...props}
    />
  );
};

// Avatar Group component for displaying multiple avatars
const AvatarGroup = ({
  avatars,
  max = 3,
  size = 'md',
  variant = 'circle',
  className = ''
}) => {
  const displayAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={`flex -space-x-2 ${className}`}>
      {displayAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          alt={avatar.alt}
          size={size}
          variant={variant}
          className="ring-2 ring-white"
        />
      ))}
      {remaining > 0 && (
        <div
          className={`inline-flex items-center justify-center ${sizes[size]} ${variants[variant]} bg-gray-100 text-gray-600 ring-2 ring-white`}
        >
          <span className="text-xs font-medium">+{remaining}</span>
        </div>
      )}
    </div>
  );
};

// Avatar with Status indicator
const AvatarWithStatus = ({
  status = 'offline',
  statusPosition = 'bottom-right',
  ...props
}) => {
  const statusColors = {
    online: 'bg-green-400',
    offline: 'bg-gray-400',
    busy: 'bg-red-400',
    away: 'bg-yellow-400'
  };

  const positions = {
    'top-right': '-top-1 -right-1',
    'top-left': '-top-1 -left-1',
    'bottom-right': '-bottom-1 -right-1',
    'bottom-left': '-bottom-1 -left-1'
  };

  return (
    <div className="relative inline-block">
      <Avatar {...props} />
      <span
        className={`absolute ${positions[statusPosition]} h-3 w-3 rounded-full ring-2 ring-white ${statusColors[status]}`}
      />
    </div>
  );
};

// Example usage:
// <Avatar src="path/to/image.jpg" size="lg" />
// <AvatarGroup
//   avatars={[
//     { src: 'user1.jpg', alt: 'User 1' },
//     { src: 'user2.jpg', alt: 'User 2' },
//     { src: 'user3.jpg', alt: 'User 3' },
//   ]}
//   max={2}
// />
// <AvatarWithStatus src="user.jpg" status="online" />

export { Avatar, AvatarGroup, AvatarWithStatus };