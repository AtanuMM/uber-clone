import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../contexts/ToastContext';
import {
  UserGroupIcon,
  TruckIcon,
  CurrencyDollarIcon,
  MapIcon,
} from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDrivers: 0,
    totalRides: 0,
    totalRevenue: 0,
    recentRides: [],
    activeDrivers: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  // Chart data
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Daily Rides',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Daily Revenue',
        data: [],
        borderColor: 'rgb(153, 102, 255)',
        tension: 0.1
      }
    ]
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // In a real application, these would be separate API endpoints
      const [usersResponse, ridesResponse, driversResponse] = await Promise.all([
        axios.get('/users/stats'),
        axios.get('/rides/stats'),
        axios.get('/drivers/stats')
      ]);

      // Simulated data for demonstration
      const mockData = {
        totalUsers: 1250,
        totalDrivers: 380,
        totalRides: 5670,
        totalRevenue: 28500,
        activeDrivers: 145,
        recentRides: [
          { id: 1, rider: 'John Doe', driver: 'Mike Smith', status: 'completed', fare: 25 },
          { id: 2, rider: 'Jane Smith', driver: 'David Wilson', status: 'in-progress', fare: 30 },
          { id: 3, rider: 'Alice Johnson', driver: 'Sarah Brown', status: 'completed', fare: 18 }
        ],
        chartData: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          rides: [65, 59, 80, 81, 56, 95, 78],
          revenue: [650, 590, 800, 810, 560, 950, 780]
        }
      };

      setStats(mockData);
      setChartData({
        labels: mockData.chartData.labels,
        datasets: [
          {
            label: 'Daily Rides',
            data: mockData.chartData.rides,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          },
          {
            label: 'Daily Revenue',
            data: mockData.chartData.revenue,
            borderColor: 'rgb(153, 102, 255)',
            tension: 0.1
          }
        ]
      });
    } catch (error) {
      addToast('Failed to fetch dashboard data', 'error');
    } finally {
      setIsLoading(false);
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
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-lg font-semibold text-gray-900">{stats.totalUsers}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TruckIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Drivers</dt>
                  <dd className="text-lg font-semibold text-gray-900">{stats.activeDrivers}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <MapIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Rides</dt>
                  <dd className="text-lg font-semibold text-gray-900">{stats.totalRides}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    ${stats.totalRevenue.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Weekly Statistics</h3>
            <div className="mt-4" style={{ height: '300px' }}>
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Recent Rides */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900">Recent Rides</h3>
            <div className="mt-4">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {stats.recentRides.map((ride) => (
                    <li key={ride.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {ride.rider} → {ride.driver}
                          </p>
                          <p className="text-sm text-gray-500">
                            Status: {ride.status} | Fare: ${ride.fare}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;