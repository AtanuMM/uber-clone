import React from 'react';
import { ChevronUpDownIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const Table = ({
  columns,
  data,
  sortable = false,
  sortColumn,
  sortDirection,
  onSort,
  selectable = false,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  loading = false,
  emptyMessage = 'No data available',
  className = ''
}) => {
  const handleSort = (column) => {
    if (!sortable || !column.sortable) return;
    
    const newDirection = 
      sortColumn === column.key && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(column.key, newDirection);
  };

  const renderSortIcon = (column) => {
    if (!sortable || !column.sortable) return null;

    if (sortColumn === column.key) {
      return sortDirection === 'asc' ? (
        <ChevronUpIcon className="h-4 w-4" />
      ) : (
        <ChevronDownIcon className="h-4 w-4" />
      );
    }

    return <ChevronUpDownIcon className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {selectable && (
              <th scope="col" className="relative px-6 py-3">
                <input
                  type="checkbox"
                  className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={selectedRows.length === data.length}
                  onChange={(e) => onSelectAll(e.target.checked)}
                />
              </th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                  sortable && column.sortable ? 'cursor-pointer select-none' : ''
                }`}
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {sortable && column.sortable && renderSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className={`${
                  selectable && selectedRows.includes(row.id || rowIndex)
                    ? 'bg-primary-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                {selectable && (
                  <td className="relative px-6 py-4">
                    <input
                      type="checkbox"
                      className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={selectedRows.includes(row.id || rowIndex)}
                      onChange={(e) =>
                        onSelectRow(row.id || rowIndex, e.target.checked)
                      }
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      column.align === 'right'
                        ? 'text-right'
                        : column.align === 'center'
                        ? 'text-center'
                        : 'text-left'
                    } ${column.className || ''}`}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Example usage:
// const columns = [
//   {
//     key: 'id',
//     label: 'ID',
//     sortable: true,
//   },
//   {
//     key: 'name',
//     label: 'Name',
//     sortable: true,
//     render: (value, row) => (
//       <div className="flex items-center">
//         <Avatar src={row.avatar} size="sm" className="mr-2" />
//         <span>{value}</span>
//       </div>
//     ),
//   },
//   {
//     key: 'status',
//     label: 'Status',
//     align: 'center',
//     render: (value) => (
//       <Badge variant={value === 'active' ? 'success' : 'danger'}>
//         {value}
//       </Badge>
//     ),
//   },
// ];
//
// <Table
//   columns={columns}
//   data={data}
//   sortable
//   sortColumn="name"
//   sortDirection="asc"
//   onSort={(column, direction) => {
//     // Handle sorting
//   }}
//   selectable
//   selectedRows={selectedRows}
//   onSelectRow={(rowId, selected) => {
//     // Handle row selection
//   }}
//   onSelectAll={(selected) => {
//     // Handle select all
//   }}
// />

export default Table;