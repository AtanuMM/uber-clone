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

// Vertical Tabs component
const VerticalTabs = ({
  tabs,
  variant = 'default',
  size = 'md',
  className = '',
  onChange
}) => {
  const variants = {
    default: {
      list: 'border-r border-gray-200',
      tab: {
        base: 'border-r-2 border-transparent py-2 px-4 text-left font-medium',
        active: 'border-primary-500 text-primary-600 bg-primary-50',
        inactive: 'text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50',
      },
    },
    pills: {
      list: 'space-y-2',
      tab: {
        base: 'rounded-md py-2 px-4 text-left font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        active: 'bg-primary-100 text-primary-700',
        inactive: 'text-gray-500 hover:bg-gray-100 hover:text-gray-900',
      },
    },
  };

  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={`flex ${className}`}>
      <Tab.Group onChange={onChange} vertical>
        <Tab.List className={`flex flex-col w-48 ${variants[variant].list}`}>
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              className={({ selected }) =>
                `${variants[variant].tab.base} ${sizes[size]} ${
                  selected
                    ? variants[variant].tab.active
                    : variants[variant].tab.inactive
                } ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}`
              }
              disabled={tab.disabled}
            >
              <div className="flex items-center space-x-3">
                {tab.icon && <tab.icon className="h-5 w-5" />}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`ml-auto rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    tab.count === 0 ? 'bg-gray-100 text-gray-600' : 'bg-primary-100 text-primary-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </div>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="flex-1 ml-6">
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
    </div>
  );
};

// Example usage:
// const tabs = [
//   {
//     id: 'overview',
//     label: 'Overview',
//     icon: HomeIcon,
//     content: <OverviewPanel />,
//   },
//   {
//     id: 'earnings',
//     label: 'Earnings',
//     icon: CurrencyDollarIcon,
//     count: 3,
//     content: <EarningsPanel />,
//   },
//   {
//     id: 'settings',
//     label: 'Settings',
//     icon: CogIcon,
//     content: <SettingsPanel />,
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
// <VerticalTabs
//   tabs={tabs}
//   variant="default"
//   size="md"
//   onChange={(index) => console.log('Tab changed:', index)}
// />

export { Tabs, VerticalTabs };