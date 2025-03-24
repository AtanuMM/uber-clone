import React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid';

const sizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg'
};

const Select = ({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  label,
  error,
  size = 'md',
  disabled = false,
  className = '',
  fullWidth = false,
  multiple = false
}) => {
  const sizeClass = sizes[size];

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <Listbox.Label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </Listbox.Label>
      )}
      <div className="relative">
        <Listbox
          value={value}
          onChange={onChange}
          multiple={multiple}
          disabled={disabled}
        >
          <div className="relative">
            <Listbox.Button
              className={`relative w-full cursor-default rounded-md border ${
                error
                  ? 'border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
              } bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-1 disabled:bg-gray-50 disabled:text-gray-500 ${sizeClass}`}
            >
              <span className={`block truncate ${!value ? 'text-gray-500' : ''}`}>
                {multiple
                  ? value.length
                    ? `${value.length} selected`
                    : placeholder
                  : value
                  ? options.find(option => option.value === value)?.label || placeholder
                  : placeholder}
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={React.Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {options.map((option) => (
                  <Listbox.Option
                    key={option.value}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'
                      }`
                    }
                    value={option.value}
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {option.label}
                        </span>
                        {selected ? (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Searchable Select component
const SearchableSelect = ({
  value,
  onChange,
  options,
  onSearch,
  placeholder = 'Search...',
  label,
  error,
  size = 'md',
  disabled = false,
  className = '',
  fullWidth = false,
  loading = false
}) => {
  const [query, setQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);

  const filteredOptions = query === ''
    ? options
    : options.filter((option) =>
        option.label
          .toLowerCase()
          .replace(/\s+/g, '')
          .includes(query.toLowerCase().replace(/\s+/g, ''))
      );

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          className={`w-full rounded-md border ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
          } shadow-sm ${sizes[size]}`}
          placeholder={placeholder}
          value={query}
          onChange={handleSearch}
          onFocus={() => setIsOpen(true)}
          disabled={disabled}
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent"></div>
          </div>
        )}
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
            <ul className="max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className={`relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-primary-100 ${
                    value === option.value ? 'bg-primary-50' : ''
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setQuery('');
                  }}
                >
                  <span className={`block truncate ${value === option.value ? 'font-semibold' : 'font-normal'}`}>
                    {option.label}
                  </span>
                  {value === option.value && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-600">
                      <CheckIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  )}
                </li>
              ))}
              {filteredOptions.length === 0 && (
                <li className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-500">
                  No results found
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Example usage:
// <Select
//   value={selectedValue}
//   onChange={setValue}
//   options={[
//     { value: '1', label: 'Option 1' },
//     { value: '2', label: 'Option 2' },
//   ]}
//   label="Select an option"
// />
//
// <SearchableSelect
//   value={selectedValue}
//   onChange={setValue}
//   options={options}
//   onSearch={handleSearch}
//   label="Search and select"
//   loading={isLoading}
// />

export { Select, SearchableSelect };