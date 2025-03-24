import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../contexts/ToastContext';
import {
  MagnifyingGlassIcon,
  TruckIcon,
  StarIcon,
  MapPinIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { addToast } = useToast();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const driversPerPage = 10;

  useEffect(() => {
    fetchDrivers();
  }, [currentPage, filterStatus]);

  const fetchDrivers = async () => {
    try {
      // In a real application, this would be an API call with pagination
      // Simulated data for demonstration
      const mockDrivers = Array.from({ length: 25 }, (_, index) => ({
        id: index + 1,
        firstName: `Driver${index + 1}`,
        lastName: `LastName${index + 1}`,
        email: `driver${index + 1}@example.com`,
        phone: `+1234567${index.toString().padStart(4, '0')}`,
        isActive: index % 3 !== 0,
        rating: (3 + Math.random() * 2).toFixed(1),
        totalRides: Math.floor(Math.random() * 500) + 50,
        vehicle: {
          model: `Car Model ${index + 1}`,
          plateNumber: `ABC${index.toString().padStart(4, '0')}`,
          color: ['Black', 'White', 'Silver', 'Blue', 'Red'][Math.floor(Math.random() * 5)]
        },
        currentLocation: {
          address: `Location ${index + 1}`,
          coordinates: [40.7128 + Math.random() * 0.1, -74.0060 + Math.random() * 0.1]
        },
        earnings: {
          total: Math.floor(Math.random() * 5000) + 1000,
          today: Math.floor(Math.random() * 200) + 50
        },
        createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
      }));

      setDrivers(mockDrivers);
      setTotalPages(Math.ceil(mockDrivers.length / driversPerPage));
    } catch (error) {
      addToast('Failed to fetch drivers', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredDrivers = drivers.filter(driver => {
    const matchesSearch = (
      driver.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'active' && driver.isActive) ||
      (filterStatus === 'inactive' && !driver.isActive);

    return matchesSearch && matchesStatus;
  });

  const paginatedDrivers = filteredDrivers.slice(
    (currentPage - 1) * driversPerPage,
    currentPage * driversPerPage
  );

  const toggleDriverStatus = async (driverId) => {
    try {
      // In a real application, this would be an API call
      setDrivers(drivers.map(driver => 
        driver.id === driverId 
          ? { ...driver, isActive: !driver.isActive }
          : driver
      ));
      addToast('Driver status updated successfully', 'success');
    } catch (error) {
      addToast('Failed to update driver status', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Drivers</h1>
        <div className="mt-4 sm:mt-0 sm:flex sm:space-x-4">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Search */}
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
      </div>

      {/* Drivers Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedDrivers.map((driver) => (
          <div
            key={driver.id}
            className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
          >
            <div className="px-4 py-5 sm:px-6">
              {/* Driver Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <TruckIcon className="h-6 w-6 text-gray-500" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {driver.firstName} {driver.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{driver.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleDriverStatus(driver.id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    driver.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {driver.isActive ? 'Active' : 'Inactive'}
                </button>
              </div>

              {/* Driver Stats */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <StarIcon className="h-5 w-5 text-yellow-400" />
                  <span className="ml-2 text-sm text-gray-600">
                    {driver.rating} ({driver.totalRides} rides)
                  </span>
                </div>
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 text-sm text-gray-600">
                    {driver.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="px-4 py-4 sm:px-6">
              <div className="text-sm text-gray-900">
                <p className="font-medium">Vehicle Details</p>
                <p className="mt-1 text-gray-600">
                  {driver.vehicle.model} • {driver.vehicle.color}
                </p>
                <p className="text-gray-600">{driver.vehicle.plateNumber}</p>
              </div>
            </div>

            {/* Location & Earnings */}
            <div className="px-4 py-4 sm:px-6">
              <div className="flex justify-between text-sm">
                <div>
                  <p className="font-medium text-gray-900">Current Location</p>
                  <p className="mt-1 text-gray-600 flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {driver.currentLocation.address}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">Earnings</p>
                  <p className="mt-1 text-gray-600">
                    Today: ${driver.earnings.today}
                  </p>
                  <p className="text-gray-600">
                    Total: ${driver.earnings.total}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * driversPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * driversPerPage, filteredDrivers.length)}
              </span>{' '}
              of <span className="font-medium">{filteredDrivers.length}</span> results
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    currentPage === i + 1
                      ? 'z-10 bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drivers;