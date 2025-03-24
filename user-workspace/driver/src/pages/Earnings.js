import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  CurrencyDollarIcon,
  ClockIcon,
  MapIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Earnings = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // ['day', 'week', 'month']
  const [earnings, setEarnings] = useState({
    total: 0,
    rides: 0,
    hours: 0,
    average: 0,
    history: []
  });

  useEffect(() => {
    fetchEarnings(selectedPeriod);
  }, [selectedPeriod]);

  const fetchEarnings = async (period) => {
    try {
      // TODO: Implement API call
      // For now using mock data
      setEarnings({
        total: 854.50,
        rides: 32,
        hours: 28,
        average: 26.70,
        history: [
          {
            id: 1,
            date: '2023-08-15',
            rides: 8,
            amount: 215.75,
            hours: 7
          },
          {
            id: 2,
            date: '2023-08-14',
            rides: 6,
            amount: 168.50,
            hours: 5
          },
          {
            id: 3,
            date: '2023-08-13',
            rides: 9,
            amount: 245.25,
            hours: 8
          },
          {
            id: 4,
            date: '2023-08-12',
            rides: 9,
            amount: 225.00,
            hours: 8
          }
        ]
      });
    } catch (error) {
      addToast('Failed to fetch earnings data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
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
      {/* Period Selection */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="flex space-x-4">
            {['day', 'week', 'month'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                  selectedPeriod === period
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Earnings */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Earnings</p>
              <p className="text-lg font-semibold text-gray-900">${earnings.total.toFixed(2)}</p>
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
              <p className="text-lg font-semibold text-gray-900">{earnings.rides}</p>
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
              <p className="text-lg font-semibold text-gray-900">{earnings.hours}h</p>
            </div>
          </div>
        </div>

        {/* Average per Ride */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100">
              <ChartBarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Average per Ride</p>
              <p className="text-lg font-semibold text-gray-900">${earnings.average.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings History */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Earnings History</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {earnings.history.map((day) => (
            <div key={day.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{formatDate(day.date)}</p>
                  <p className="text-sm text-gray-500">{day.rides} rides · {day.hours} hours</p>
                </div>
                <p className="text-sm font-medium text-gray-900">${day.amount.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Earnings;