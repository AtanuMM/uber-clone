import React from 'react';
import { Tab } from '@headlessui/react';

const Tabs = ({
  tabs,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className = '',
  onChange
}) => {
  const variants = {
    default: {
      list: 'border-b border-gray-200',
      tab: {
        base: 'border-b-2 border-transparent py-4 px-1 text-center font-medium',
        active: 'border-primary-500 text-primary-600',
        inactive: 'text-gray-500 hover:border-gray-300 hover:text-gray-700',
      },
    },
    pills: {
      list: 'space-x-2',
      tab: {
        base: 'rounded-md py-2 px-4 text-center font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        active: 'bg-primary-100 text-primary-700',
        inactive: 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
      },
    },
    boxed: {
      list: 'border border-gray-200 rounded-lg bg-gray-50 p-1',
      tab: {
        base: 'rounded-md py-2 px-4 text-center font-medium focus:outline-none',
        active: 'bg-white shadow text-gray-900',
        inactive: 'text-gray-500 hover:text-gray-900',
      },
    },
  };

  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <Tab.Group onChange={onChange}>
      <Tab.List className={`flex ${fullWidth ? 'w-full' : ''} ${variants[variant].list} ${className}`}>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            className={({ selected }) =>
              `${variants[variant].tab.base} ${sizes[size]} ${
                selected
                  ? variants[variant].tab.active
                  : variants[variant].tab.inactive
              } ${fullWidth ? 'flex-1' : ''} ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`
            }
            disabled={tab.disabled}
          >
            <div className="flex items-center justify-center space-x-2">
              {tab.icon && <tab.icon className="h-5 w-5" />}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  tab.count === 0 ? 'bg-gray-100 text-gray-600' : 'bg-primary-100 text-primary-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </div>
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className="mt-4">
        {tabs.map((tab) => (
          <Tab.Panel
            key={tab.id}
            className={`focus:outline-none ${tab.panelClassName || ''}`}
          >
            {tab.content}
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

// Steps component for ride booking flow
const Steps = ({
  steps,
  currentStep,
  className = ''
}) => {
  return (
    <div className={className}>
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Step */}
            <div className="relative flex items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  index < currentStep
                    ? 'bg-primary-600'
                    : index === currentStep
                    ? 'bg-primary-600'
                    : 'bg-gray-200'
                }`}
              >
                {index < currentStep ? (
                  <CheckIcon className="h-5 w-5 text-white" />
                ) : (
                  <span className={`text-sm font-medium ${
                    index === currentStep ? 'text-white' : 'text-gray-500'
                  }`}>
                    {index + 1}
                  </span>
                )}
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-sm text-gray-500">{step.description}</p>
                )}
              </div>
            </div>
            {/* Connector */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div className={`h-0.5 ${
                  index < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                }`} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

// Example usage:
// const tabs = [
//   {
//     id: 'upcoming',
//     label: 'Upcoming',
//     icon: ClockIcon,
//     count: 2,
//     content: <UpcomingRides />,
//   },
//   {
//     id: 'history',
//     label: 'History',
//     icon: ArchiveIcon,
//     content: <RideHistory />,
//   },
// ];
//
// <Tabs
//   tabs={tabs}
//   variant="pills"
//   size="md"
//   onChange={(index) => console.log('Tab changed:', index)}
// />
//
// const steps = [
//   {
//     id: 'location',
//     label: 'Location',
//     description: 'Choose pickup & drop-off',
//   },
//   {
//     id: 'vehicle',
//     label: 'Vehicle',
//     description: 'Select your ride',
//   },
//   {
//     id: 'payment',
//     label: 'Payment',
//     description: 'Choose payment method',
//   },
// ];
//
// <Steps
//   steps={steps}
//   currentStep={1}
//   className="mb-8"
// />

export { Tabs, Steps };