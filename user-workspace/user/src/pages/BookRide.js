import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const BookRide = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState({
    pickup: '',
    dropoff: ''
  });
  const [rideOptions, setRideOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [estimatedPrice, setEstimatedPrice] = useState(null);

  useEffect(() => {
    // Load saved locations
    loadSavedLocations();
  }, []);

  const loadSavedLocations = async () => {
    try {
      // TODO: Implement API call
      // For now using mock data
      const savedLocations = [
        { id: 1, name: 'Home', address: '123 Home Street' },
        { id: 2, name: 'Office', address: '456 Office Avenue' },
        { id: 3, name: 'Gym', address: '789 Fitness Road' }
      ];
    } catch (error) {
      addToast('Failed to load saved locations', 'error');
    }
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setLocations(prev => ({
      ...prev,
      [name]: value
    }));

    if (locations.pickup && locations.dropoff) {
      fetchRideOptions();
    }
  };

  const fetchRideOptions = async () => {
    try {
      // TODO: Implement API call
      // For now using mock data
      setRideOptions([
        {
          id: 'standard',
          name: 'Standard',
          description: '4-door sedan, up to 4 passengers',
          estimatedTime: '15 mins',
          price: 25.50,
          multiplier: 1
        },
        {
          id: 'premium',
          name: 'Premium',
          description: 'Luxury vehicle, up to 4 passengers',
          estimatedTime: '15 mins',
          price: 35.75,
          multiplier: 1.4
        },
        {
          id: 'xl',
          name: 'XL',
          description: 'SUV or van, up to 6 passengers',
          estimatedTime: '18 mins',
          price: 42.00,
          multiplier: 1.8
        }
      ]);
    } catch (error) {
      addToast('Failed to fetch ride options', 'error');
    }
  };

  const handleBookRide = async () => {
    if (!selectedOption) {
      addToast('Please select a ride option', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement API call to book ride
      addToast('Ride booked successfully', 'success');
      navigate('/active-ride');
    } catch (error) {
      addToast('Failed to book ride', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Location Inputs */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="pickup" className="block text-sm font-medium text-gray-700">
              Pickup Location
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="pickup"
                id="pickup"
                value={locations.pickup}
                onChange={handleLocationChange}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter pickup location"
              />
            </div>
          </div>

          <div>
            <label htmlFor="dropoff" className="block text-sm font-medium text-gray-700">
              Dropoff Location
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="dropoff"
                id="dropoff"
                value={locations.dropoff}
                onChange={handleLocationChange}
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter dropoff location"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ride Options */}
      {rideOptions.length > 0 && (
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Select Ride Type</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {rideOptions.map((option) => (
              <div
                key={option.id}
                className={`p-6 cursor-pointer hover:bg-gray-50 ${
                  selectedOption?.id === option.id ? 'bg-primary-50' : ''
                }`}
                onClick={() => setSelectedOption(option)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{option.name}</h3>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${option.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">{option.estimatedTime}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Book Button */}
      <button
        onClick={handleBookRide}
        disabled={!selectedOption || isLoading}
        className={`w-full bg-primary-600 text-white py-3 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
          (!selectedOption || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Booking your ride...
          </div>
        ) : (
          'Book Ride'
        )}
      </button>
    </div>
  );
};

export default BookRide;