import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Modal = ({
  open,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
  actions,
  className = ''
}) => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
    '2xl': 'max-w-3xl',
    '3xl': 'max-w-4xl',
    '4xl': 'max-w-5xl',
    '5xl': 'max-w-6xl',
    'full': 'max-w-full'
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-50 inset-0 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizes[size]} w-full ${className}`}>
              {/* Header */}
              {(title || showClose) && (
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    {title && (
                      <Dialog.Title className="text-lg font-medium text-gray-900">
                        {title}
                      </Dialog.Title>
                    )}
                    {showClose && (
                      <button
                        type="button"
                        className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        onClick={onClose}
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-6 w-6" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="px-6 py-4">{children}</div>

              {/* Footer */}
              {actions && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex flex-row-reverse gap-2">
                    {actions}
                  </div>
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

// Confirmation Modal for simple yes/no dialogs
const ConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  size = 'sm'
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size={size}
      actions={
        <>
          <button
            type="button"
            className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              confirmVariant === 'danger'
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : confirmVariant === 'success'
                ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                : 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500'
            }`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={onClose}
          >
            {cancelText}
          </button>
        </>
      }
    >
      <p className="text-sm text-gray-500">{message}</p>
    </Modal>
  );
};

// Rating Modal specifically for ride ratings
const RatingModal = ({
  open,
  onClose,
  onSubmit,
  title = 'Rate Your Ride',
  size = 'sm'
}) => {
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');

  const handleSubmit = () => {
    onSubmit({ rating, comment });
    setRating(0);
    setComment('');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size={size}
      actions={
        <>
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={handleSubmit}
            disabled={!rating}
          >
            Submit Rating
          </button>
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={onClose}
          >
            Cancel
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`p-1 focus:outline-none ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
              onClick={() => setRating(star)}
            >
              <svg
                className="w-8 h-8"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 15.585l-6.327 3.323 1.209-7.037L.172 7.282l7.053-1.025L10 0l2.775 6.257 7.053 1.025-4.71 4.589 1.209 7.037z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          ))}
        </div>
        <textarea
          rows={4}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          placeholder="Add a comment (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
    </Modal>
  );
};

// Example usage:
// <Modal
//   open={isOpen}
//   onClose={() => setIsOpen(false)}
//   title="Modal Title"
//   actions={
//     <>
//       <Button onClick={handleSave}>Save</Button>
//       <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
//     </>
//   }
// >
//   Modal content here
// </Modal>
//
// <ConfirmationModal
//   open={isOpen}
//   onClose={() => setIsOpen(false)}
//   onConfirm={handleConfirm}
//   title="Confirm Action"
//   message="Are you sure you want to proceed?"
//   confirmVariant="danger"
// />
//
// <RatingModal
//   open={isOpen}
//   onClose={() => setIsOpen(false)}
//   onSubmit={handleRatingSubmit}
// />

export { Modal, ConfirmationModal, RatingModal };