import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import {
  UserIcon,
  StarIcon,
  TruckIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRides: 0,
    rating: 0,
    completionRate: 0,
    hoursOnline: 0
  });
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      // TODO: Implement API call
      // For now using mock data
      setStats({
        totalRides: 856,
        rating: 4.9,
        completionRate: 98,
        hoursOnline: 520
      });

      setDocuments([
        {
          id: 1,
          type: 'Driver\'s License',
          status: 'verified',
          expiryDate: '2024-12-31'
        },
        {
          id: 2,
          type: 'Vehicle Insurance',
          status: 'verified',
          expiryDate: '2024-06-30'
        },
        {
          id: 3,
          type: 'Vehicle Registration',
          status: 'verified',
          expiryDate: '2024-08-15'
        }
      ]);
    } catch (error) {
      addToast('Failed to fetch profile data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadDocument = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // TODO: Implement file upload
      addToast('Document uploaded successfully', 'success');
    } catch (error) {
      addToast('Failed to upload document', 'error');
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
                <span className="ml-1 text-sm text-gray-600">{stats.rating} Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <TruckIcon className="h-6 w-6 text-gray-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Rides</p>
              <p className="text-lg font-semibold text-gray-900">{stats.totalRides}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <StarIcon className="h-6 w-6 text-gray-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Rating</p>
              <p className="text-lg font-semibold text-gray-900">{stats.rating}/5.0</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <DocumentTextIcon className="h-6 w-6 text-gray-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Completion Rate</p>
              <p className="text-lg font-semibold text-gray-900">{stats.completionRate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <ClockIcon className="h-6 w-6 text-gray-400" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Hours Online</p>
              <p className="text-lg font-semibold text-gray-900">{stats.hoursOnline}h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Documents</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.type}</p>
                  <p className="text-sm text-gray-500">Expires: {new Date(doc.expiryDate).toLocaleDateString()}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  doc.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                </span>
              </div>
            ))}
          </div>

          {/* Upload Document */}
          <div className="mt-6">
            <label
              htmlFor="document-upload"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload New Document
            </label>
            <input
              id="document-upload"
              type="file"
              onChange={handleUploadDocument}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-medium
                file:bg-primary-50 file:text-primary-700
                hover:file:bg-primary-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;