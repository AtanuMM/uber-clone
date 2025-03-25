import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  MapPinIcon,
  PhoneIcon,
  ChatBubbleLeftIcon,
  // CheckCircleIcon,
  UserIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const ActiveRide = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [ride, setRide] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState('heading_to_pickup'); // ['heading_to_pickup', 'arrived_at_pickup', 'in_progress', 'completed']

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
        rider: {
          name: 'John Doe',
          phoneNumber: '+1234567890',
          rating: 4.8
        },
        pickup: '123 Main St',
        dropoff: '456 Market St',
        distance: '3.2 miles',
        estimatedFare: 15.50,
        estimatedDuration: '15 mins',
        status: 'in_progress'
      });
    } catch (error) {
      addToast('Failed to fetch ride details', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRideStatus = async (newStatus) => {
    try {
      // TODO: Implement API call
      setCurrentStep(newStatus);
      if (newStatus === 'completed') {
        addToast('Ride completed successfully', 'success');
        setTimeout(() => navigate('/'), 2000);
      } else {
        addToast('Status updated successfully', 'success');
      }
    } catch (error) {
      addToast('Failed to update ride status', 'error');
    }
  };

  const handleCallRider = () => {
    window.location.href = `tel:${ride.rider.phoneNumber}`;
  };

  const handleMessageRider = () => {
    // TODO: Implement in-app messaging
    addToast('Messaging feature coming soon', 'info');
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
      {/* Status Steps */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Active Ride</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <div className="relative flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep === 'heading_to_pickup' ? 'bg-primary-100 text-primary-600' : 'bg-green-100 text-green-600'
                }`}>
                  <MapPinIcon className="w-6 h-6" />
                </div>
                <div className="flex-1 ml-4">
                  <p className="text-sm font-medium text-gray-900">Heading to pickup</p>
                  <p className="text-sm text-gray-500">{ride.pickup}</p>
                </div>
              </div>
              <div className="absolute left-5 w-0.5 h-8 bg-gray-200"></div>
              <div className="relative flex items-center mt-8">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep === 'in_progress' ? 'bg-primary-100 text-primary-600' : 
                  currentStep === 'completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <MapPinIcon className="w-6 h-6" />
                </div>
                <div className="flex-1 ml-4">
                  <p className="text-sm font-medium text-gray-900">Drop-off</p>
                  <p className="text-sm text-gray-500">{ride.dropoff}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {currentStep === 'heading_to_pickup' && (
              <button
                onClick={() => handleUpdateRideStatus('arrived_at_pickup')}
                className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700"
              >
                Arrived at Pickup
              </button>
            )}
            {currentStep === 'arrived_at_pickup' && (
              <button
                onClick={() => handleUpdateRideStatus('in_progress')}
                className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700"
              >
                Start Ride
              </button>
            )}
            {currentStep === 'in_progress' && (
              <button
                onClick={() => handleUpdateRideStatus('completed')}
                className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700"
              >
                Complete Ride
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Rider Details */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Rider Details</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-gray-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">{ride.rider.name}</p>
                <div className="flex items-center">
                  <StarIcon className="h-4 w-4 text-yellow-400" />
                  <span className="ml-1 text-sm text-gray-500">{ride.rider.rating}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleCallRider}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <PhoneIcon className="h-6 w-6" />
              </button>
              <button
                onClick={handleMessageRider}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <ChatBubbleLeftIcon className="h-6 w-6" />
              </button>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveRide;