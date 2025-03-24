import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  actions,
  noPadding = false,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = ''
}) => {
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      {(title || subtitle) && (
        <div className={`px-6 py-4 border-b border-gray-200 ${headerClassName}`}>
          {title && (
            <h3 className="text-lg font-medium text-gray-900">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
      )}
      
      <div className={`${noPadding ? '' : 'p-6'} ${bodyClassName}`}>
        {children}
      </div>

      {actions && (
        <div className={`px-6 py-4 border-t border-gray-200 ${footerClassName}`}>
          <div className="flex justify-end space-x-3">
            {actions}
          </div>
        </div>
      )}
    </div>
  );
};

// Card Section component for organizing content within cards
const CardSection = ({
  children,
  title,
  subtitle,
  className = '',
  noPadding = false
}) => {
  return (
    <div className={`${!noPadding && 'px-6 py-4'} ${className}`}>
      {title && (
        <h4 className="text-base font-medium text-gray-900 mb-1">
          {title}
        </h4>
      )}
      {subtitle && (
        <p className="text-sm text-gray-500 mb-4">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
};

// Card Grid component for creating responsive grid layouts
const CardGrid = ({
  children,
  columns = {
    default: 1,
    sm: 2,
    md: 3,
    lg: 4
  },
  gap = 6,
  className = ''
}) => {
  const getGridCols = () => {
    const cols = [];
    if (columns.default) cols.push(`grid-cols-${columns.default}`);
    if (columns.sm) cols.push(`sm:grid-cols-${columns.sm}`);
    if (columns.md) cols.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) cols.push(`lg:grid-cols-${columns.lg}`);
    return cols.join(' ');
  };

  return (
    <div className={`grid ${getGridCols()} gap-${gap} ${className}`}>
      {children}
    </div>
  );
};

// Example usage:
// <Card title="Card Title">
//   <CardSection title="Section Title">
//     <CardGrid columns={{ default: 1, md: 2 }}>
//       <div>Grid Item 1</div>
//       <div>Grid Item 2</div>
//     </CardGrid>
//   </CardSection>
// </Card>

export { Card, CardSection, CardGrid };