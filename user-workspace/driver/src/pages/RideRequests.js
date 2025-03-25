import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  MapPinIcon,
  UserIcon,
  CurrencyDollarIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const RideRequests = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [rideRequests, setRideRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRideRequests();
    // Set up WebSocket connection for real-time updates
    const ws = new WebSocket(process.env.REACT_APP_WS_URL || 'ws://localhost:5000');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'NEW_RIDE_REQUEST') {
        setRideRequests(prev => [data.rideRequest, ...prev]);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const fetchRideRequests = async () => {
    try {
      // TODO: Implement API call
      // For now using mock data
      setRideRequests([
        {
          id: 1,
          rider: {
            name: 'John Doe',
            rating: 4.8
          },
          pickup: '123 Main St',
          dropoff: '456 Market St',
          distance: '3.2 miles',
          estimatedFare: 15.50,
          estimatedDuration: '15 mins',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          rider: {
            name: 'Jane Smith',
            rating: 4.9
          },
          pickup: '789 Park Ave',
          dropoff: '321 Lake St',
          distance: '2.8 miles',
          estimatedFare: 12.75,
          estimatedDuration: '12 mins',
          createdAt: new Date(Date.now() - 300000).toISOString()
        }
      ]);
    } catch (error) {
      addToast('Failed to fetch ride requests', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRide = async (rideId) => {
    try {
      // TODO: Implement API call to accept ride
      addToast('Ride accepted successfully', 'success');
      navigate('/active-ride');
    } catch (error) {
      addToast('Failed to accept ride', 'error');
    }
  };

  const handleDeclineRide = async (rideId) => {
    try {
      // TODO: Implement API call to decline ride
      setRideRequests(prev => prev.filter(ride => ride.id !== rideId));
      addToast('Ride declined', 'info');
    } catch (error) {
      addToast('Failed to decline ride', 'error');
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
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Ride Requests</h2>
        </div>

        {rideRequests.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No ride requests available at the moment
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {rideRequests.map((ride) => (
              <div key={ride.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-gray-100">
                      <UserIcon className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{ride.rider.name}</p>
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400" />
                        <span className="ml-1 text-sm text-gray-500">{ride.rider.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      ${ride.estimatedFare.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">{ride.distance}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                    <p className="ml-2 text-sm text-gray-600">{ride.pickup}</p>
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                    <p className="ml-2 text-sm text-gray-600">{ride.dropoff}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="h-5 w-5 mr-1" />
                    {ride.estimatedDuration}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CurrencyDollarIcon className="h-5 w-5 mr-1" />
                    Estimated fare
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleAcceptRide(ride.id)}
                    className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleDeclineRide(ride.id)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RideRequests;