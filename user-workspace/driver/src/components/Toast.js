import React, { useEffect } from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const icons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  info: InformationCircleIcon,
  warning: ExclamationCircleIcon,
};

const colors = {
  success: 'bg-green-50 text-green-800',
  error: 'bg-red-50 text-red-800',
  info: 'bg-blue-50 text-blue-800',
  warning: 'bg-yellow-50 text-yellow-800',
};

const iconColors = {
  success: 'text-green-400',
  error: 'text-red-400',
  info: 'text-blue-400',
  warning: 'text-yellow-400',
};

const Toast = ({
  message,
  type = 'info',
  onClose,
  duration = 5000,
  position = 'top-right'
}) => {
  const Icon = icons[type];

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 transform transition-all duration-300 ease-in-out`}
    >
      <div className={`rounded-lg p-4 ${colors[type]} shadow-lg max-w-sm w-full`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={`h-5 w-5 ${iconColors[type]}`} />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className={`inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                type === 'error'
                  ? 'focus:ring-red-500'
                  : type === 'success'
                  ? 'focus:ring-green-500'
                  : type === 'warning'
                  ? 'focus:ring-yellow-500'
                  : 'focus:ring-blue-500'
              }`}
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className={`h-5 w-5 ${iconColors[type]}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
          position={toast.position}
        />
      ))}
    </>
  );
};

export { Toast, ToastContainer };