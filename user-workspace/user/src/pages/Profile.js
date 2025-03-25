import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  UserIcon,
  StarIcon,
  MapIcon,
  CreditCardIcon,
  HomeIcon,
  OfficeBuildingIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRides: 0,
    totalSpent: 0,
    averageRating: 0
  });
  const [savedLocations, setSavedLocations] = useState([]);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      // TODO: Implement API call
      // For now using mock data
      setStats({
        totalRides: 48,
        totalSpent: 857.50,
        averageRating: 4.8
      });

      setSavedLocations([
        {
          id: 1,
          name: 'Home',
          address: '123 Home Street, City',
          type: 'home'
        },
        {
          id: 2,
          name: 'Office',
          address: '456 Office Avenue, City',
          type: 'office'
        },
        {
          id: 3,
          name: 'Gym',
          address: '789 Fitness Road, City',
          type: 'other'
        }
      ]);
    } catch (error) {
      addToast('Failed to fetch profile data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLocation = async () => {
    // TODO: Implement location addition
    addToast('Location adding feature coming soon', 'info');
  };

  const handleRemoveLocation = async (locationId) => {
    try {
      // TODO: Implement API call
      setSavedLocations(prev => prev.filter(loc => loc.id !== locationId));
      addToast('Location removed successfully', 'success');
    } catch (error) {
      addToast('Failed to remove location', 'error');
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
      {/* Profile Overview */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Profile Overview</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center">
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
              <UserIcon className="h-12 w-12 text-gray-500" />
            </div>
            <div className="ml-6">
              <h3 className="text-xl font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </h3>
              <div className="flex items-center mt-1">
                <StarIcon className="h-5 w-5 text-yellow-400" />
                <span className="ml-1 text-sm text-gray-600">{stats.averageRating} Average Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <MapIcon className="h-6 w-6 text-gray-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Rides</p>
              <p className="text-lg font-semibold text-gray-900">{stats.totalRides}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <CreditCardIcon className="h-6 w-6 text-gray-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Spent</p>
              <p className="text-lg font-semibold text-gray-900">${stats.totalSpent.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <StarIcon className="h-6 w-6 text-gray-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Average Rating</p>
              <p className="text-lg font-semibold text-gray-900">{stats.averageRating}/5.0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Saved Locations */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Saved Locations</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {savedLocations.map((location) => (
              <div
                key={location.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center">
                  {location.type === 'home' ? (
                    <HomeIcon className="h-5 w-5 text-gray-400" />
                  ) : location.type === 'office' ? (
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <MapIcon className="h-5 w-5 text-gray-400" />
                  )}
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{location.name}</p>
                    <p className="text-sm text-gray-500">{location.address}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveLocation(location.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Add Location Button */}
          <button
            onClick={handleAddLocation}
            className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Add New Location
          </button>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Account Information</h2>
        </div>
        <div className="p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
              <dd className="mt-1 text-sm text-gray-900">{user?.phoneNumber}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Member Since</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(user?.createdAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default Profile;