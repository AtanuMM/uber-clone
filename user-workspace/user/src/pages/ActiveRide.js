import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  MapPinIcon,
  PhoneIcon,
  ChatBubbleLeftIcon,
  StarIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const ActiveRide = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [ride, setRide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRideDetails();
    // Set up WebSocket connection for real-time updates
    const ws = new WebSocket(process.env.REACT_APP_WS_URL || 'ws://localhost:5000');
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'RIDE_UPDATE') {
        setRide(data.ride);
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const fetchRideDetails = async () => {
    try {
      // TODO: Implement API call
      // For now using mock data
      setRide({
        id: 1,
        driver: {
          name: 'Michael Smith',
          phoneNumber: '+1234567890',
          rating: 4.9,
          vehicle: {
            model: 'Toyota Camry',
            color: 'Silver',
            plateNumber: 'ABC123'
          }
        },
        pickup: '123 Main St',
        dropoff: '456 Market St',
        distance: '3.2 miles',
        estimatedFare: 15.50,
        estimatedDuration: '15 mins',
        status: 'driver_en_route', // ['driver_en_route', 'driver_arrived', 'in_progress', 'completed']
        paymentMethod: 'Credit Card (**** 1234)'
      });
    } catch (error) {
      addToast('Failed to fetch ride details', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallDriver = () => {
    window.location.href = `tel:${ride.driver.phoneNumber}`;
  };

  const handleMessageDriver = () => {
    // TODO: Implement in-app messaging
    addToast('Messaging feature coming soon', 'info');
  };

  const handleCancelRide = async () => {
    try {
      // TODO: Implement API call
      addToast('Ride cancelled successfully', 'success');
      navigate('/');
    } catch (error) {
      addToast('Failed to cancel ride', 'error');
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
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Status Card */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Your Ride</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <div className="relative flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  ride.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-primary-100 text-primary-600'
                }`}>
                  <MapPinIcon className="w-6 h-6" />
                </div>
                <div className="flex-1 ml-4">
                  <p className="text-sm font-medium text-gray-900">Pickup Location</p>
                  <p className="text-sm text-gray-500">{ride.pickup}</p>
                </div>
              </div>
              <div className="absolute left-5 w-0.5 h-8 bg-gray-200"></div>
              <div className="relative flex items-center mt-8">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  ride.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <MapPinIcon className="w-6 h-6" />
                </div>
                <div className="flex-1 ml-4">
                  <p className="text-sm font-medium text-gray-900">Dropoff Location</p>
                  <p className="text-sm text-gray-500">{ride.dropoff}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="text-center text-sm font-medium text-gray-900 mb-4">
            {ride.status === 'driver_en_route' && 'Driver is on the way'}
            {ride.status === 'driver_arrived' && 'Driver has arrived'}
            {ride.status === 'in_progress' && 'On the way to destination'}
            {ride.status === 'completed' && 'Ride completed'}
          </div>

          {/* Cancel Button (only show if ride hasn't started) */}
          {['driver_en_route', 'driver_arrived'].includes(ride.status) && (
            <button
              onClick={handleCancelRide}
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
            >
              Cancel Ride
            </button>
          )}
        </div>
      </div>

      {/* Driver Details */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Driver Details</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-gray-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">{ride.driver.name}</p>
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-400" />
                  <span className="ml-1 text-sm text-gray-500">{ride.driver.rating}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCallDriver}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <PhoneIcon className="h-6 w-6" />
              </button>
              <button
                onClick={handleMessageDriver}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <ChatBubbleLeftIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Vehicle</p>
              <p className="text-sm font-medium text-gray-900">
                {ride.driver.vehicle.color} {ride.driver.vehicle.model}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Plate Number</p>
              <p className="text-sm font-medium text-gray-900">
                {ride.driver.vehicle.plateNumber}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ride Details */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Ride Details</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Distance</p>
              <p className="text-sm font-medium text-gray-900">{ride.distance}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estimated Duration</p>
              <p className="text-sm font-medium text-gray-900">{ride.estimatedDuration}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estimated Fare</p>
              <p className="text-sm font-medium text-gray-900">${ride.estimatedFare.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="text-sm font-medium text-gray-900">{ride.paymentMethod}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveRide;