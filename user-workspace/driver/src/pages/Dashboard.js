import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  CurrencyDollarIcon,
  StarIcon,
  ClockIcon,
  MapIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user, updateAvailability } = useAuth();
  const { addToast } = useToast();
  const [isOnline, setIsOnline] = useState(user?.isAvailable || false);
  const [stats, setStats] = useState({
    todayEarnings: 0,
    totalRides: 0,
    rating: 4.8,
    hoursOnline: 0
  });

  useEffect(() => {
    // Fetch dashboard stats
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // TODO: Implement API call to fetch stats
      // For now using mock data
      setStats({
        todayEarnings: 150.75,
        totalRides: 12,
        rating: 4.8,
        hoursOnline: 6
      });
    } catch (error) {
      addToast('Failed to fetch dashboard stats', 'error');
    }
  };

  const handleAvailabilityToggle = async () => {
    try {
      const success = await updateAvailability(!isOnline);
      if (success) {
        setIsOnline(!isOnline);
        addToast(`You are now ${!isOnline ? 'online' : 'offline'}`, 'success');
      }
    } catch (error) {
      addToast('Failed to update availability', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Driver Status</h2>
            <p className={`mt-1 text-sm ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
              {isOnline ? 'You are online and can receive ride requests' : 'You are currently offline'}
            </p>
          </div>
          <button
            onClick={handleAvailabilityToggle}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              isOnline
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isOnline ? 'Go Offline' : 'Go Online'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today's Earnings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Today's Earnings</p>
              <p className="text-lg font-semibold text-gray-900">${stats.todayEarnings.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Total Rides */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <MapIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Rides</p>
              <p className="text-lg font-semibold text-gray-900">{stats.totalRides}</p>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <StarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Rating</p>
              <p className="text-lg font-semibold text-gray-900">{stats.rating}/5.0</p>
            </div>
          </div>
        </div>

        {/* Hours Online */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <ClockIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Hours Online</p>
              <p className="text-lg font-semibold text-gray-900">{stats.hoursOnline}h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="border-t border-gray-200">
          <div className="divide-y divide-gray-200">
            {/* Sample activities - replace with real data */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Completed ride</p>
                  <p className="text-sm text-gray-500">Downtown to Airport</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">$35.00</p>
                  <p className="text-sm text-gray-500">30 mins ago</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Completed ride</p>
                  <p className="text-sm text-gray-500">Shopping Mall to Residence</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">$22.50</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;