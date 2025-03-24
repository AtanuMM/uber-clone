import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  MapPinIcon,
  StarIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const RideHistory = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [rides, setRides] = useState([]);
  const [expandedRide, setExpandedRide] = useState(null);
  const [filter, setFilter] = useState('all'); // ['all', 'completed', 'cancelled']

  useEffect(() => {
    fetchRideHistory();
  }, [filter]);

  const fetchRideHistory = async () => {
    try {
      // TODO: Implement API call
      // For now using mock data
      setRides([
        {
          id: 1,
          date: '2023-08-15T14:30:00Z',
          driver: {
            name: 'Michael Smith',
            rating: 4.9
          },
          pickup: '123 Main St',
          dropoff: '456 Market St',
          status: 'completed',
          fare: 25.50,
          distance: '3.2 miles',
          duration: '15 mins',
          paymentMethod: 'Credit Card (**** 1234)',
          rating: 5
        },
        {
          id: 2,
          date: '2023-08-14T09:15:00Z',
          driver: {
            name: 'Sarah Johnson',
            rating: 4.8
          },
          pickup: '789 Park Ave',
          dropoff: '321 Lake St',
          status: 'completed',
          fare: 18.75,
          distance: '2.8 miles',
          duration: '12 mins',
          paymentMethod: 'Credit Card (**** 1234)',
          rating: 4
        },
        {
          id: 3,
          date: '2023-08-13T19:45:00Z',
          driver: {
            name: 'David Wilson',
            rating: 4.7
          },
          pickup: '159 Pine St',
          dropoff: '753 Oak Ave',
          status: 'cancelled',
          cancellationReason: 'Changed plans'
        }
      ]);
    } catch (error) {
      addToast('Failed to fetch ride history', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  const handleRateRide = async (rideId, rating) => {
    try {
      // TODO: Implement API call
      addToast('Rating submitted successfully', 'success');
      // Update local state
      setRides(rides.map(ride => 
        ride.id === rideId ? { ...ride, rating } : ride
      ));
    } catch (error) {
      addToast('Failed to submit rating', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="flex space-x-4">
            {['all', 'completed', 'cancelled'].map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`py-2 px-4 rounded-md text-sm font-medium ${
                  filter === option
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rides List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Your Rides</h2>
        </div>

        {rides.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No rides found
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {rides.map((ride) => (
              <div key={ride.id} className="p-6">
                <div 
                  className="cursor-pointer"
                  onClick={() => setExpandedRide(expandedRide === ride.id ? null : ride.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{formatDate(ride.date)}</p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          ride.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    {ride.status === 'completed' && (
                      <p className="text-sm font-medium text-gray-900">${ride.fare.toFixed(2)}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                        <p className="ml-2 text-sm text-gray-600">{ride.pickup}</p>
                      </div>
                      <div className="flex items-center">
                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                        <p className="ml-2 text-sm text-gray-600">{ride.dropoff}</p>
                      </div>
                    </div>
                    {expandedRide === ride.id ? (
                      <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedRide === ride.id && ride.status === 'completed' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Driver</p>
                        <div className="flex items-center mt-1">
                          <p className="text-sm font-medium text-gray-900">{ride.driver.name}</p>
                          <div className="flex items-center ml-2">
                            <StarIcon className="h-4 w-4 text-yellow-400" />
                            <span className="ml-1 text-sm text-gray-500">{ride.driver.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment Method</p>
                        <p className="text-sm font-medium text-gray-900">{ride.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Distance</p>
                        <p className="text-sm font-medium text-gray-900">{ride.distance}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="text-sm font-medium text-gray-900">{ride.duration}</p>
                      </div>
                    </div>

                    {/* Rating Section */}
                    {!ride.rating && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-900 mb-2">Rate your ride</p>
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => handleRateRide(ride.id, rating)}
                              className="p-2 hover:bg-gray-100 rounded-full"
                            >
                              <StarIcon className={`h-6 w-6 ${
                                rating <= (ride.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                              }`} />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RideHistory;