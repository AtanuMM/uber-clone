import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  MapIcon,
  ClockIcon,
  StarIcon,
  HeartIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [recentRides, setRecentRides] = useState([]);
  const [favoriteLocations, setFavoriteLocations] = useState([]);

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // TODO: Implement API calls to fetch data
      // For now using mock data
      setRecentRides([
        {
          id: 1,
          from: 'Home',
          to: 'Office',
          date: '2 hours ago',
          cost: 25.50,
          status: 'completed'
        },
        {
          id: 2,
          from: 'Shopping Mall',
          to: 'Home',
          date: 'Yesterday',
          cost: 18.75,
          status: 'completed'
        }
      ]);

      setFavoriteLocations([
        {
          id: 1,
          name: 'Home',
          address: '123 Home Street'
        },
        {
          id: 2,
          name: 'Office',
          address: '456 Office Avenue'
        },
        {
          id: 3,
          name: 'Gym',
          address: '789 Fitness Road'
        }
      ]);
    } catch (error) {
      addToast('Failed to fetch dashboard data', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Book Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Book</h2>
        <Link
          to="/book-ride"
          className="block w-full bg-primary-600 text-white text-center py-3 rounded-md hover:bg-primary-700 transition-colors duration-200"
        >
          Book a Ride
        </Link>
      </div>

      {/* Favorite Locations */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">Favorite Locations</h2>
        </div>
        <div className="border-t border-gray-200">
          <div className="divide-y divide-gray-200">
            {favoriteLocations.map((location) => (
              <div key={location.id} className="p-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-red-100">
                    <HeartIcon className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900">{location.name}</p>
                    <p className="text-sm text-gray-500">{location.address}</p>
                  </div>
                  <Link
                    to={`/book-ride?destination=${encodeURIComponent(location.address)}`}
                    className="flex items-center text-primary-600 hover:text-primary-700"
                  >
                    Book
                    <ArrowRightIcon className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Rides */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recent Rides</h2>
            <Link
              to="/ride-history"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View all
            </Link>
          </div>
        </div>
        <div className="border-t border-gray-200">
          <div className="divide-y divide-gray-200">
            {recentRides.map((ride) => (
              <div key={ride.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 rounded-full bg-blue-100">
                      <MapIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">{ride.from}</p>
                        <ArrowRightIcon className="mx-2 h-4 w-4 text-gray-400" />
                        <p className="text-sm font-medium text-gray-900">{ride.to}</p>
                      </div>
                      <p className="text-sm text-gray-500">{ride.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${ride.cost.toFixed(2)}</p>
                    <p className="text-sm text-green-600 capitalize">{ride.status}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/ride-history"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Ride History</p>
              <p className="text-sm text-gray-500">View all your past rides</p>
            </div>
          </div>
        </Link>

        <Link
          to="/payment"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <StarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Payment Methods</p>
              <p className="text-sm text-gray-500">Manage your payment options</p>
            </div>
          </div>
        </Link>

        <Link
          to="/settings"
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <HeartIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">Saved Places</p>
              <p className="text-sm text-gray-500">Manage your favorite locations</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;