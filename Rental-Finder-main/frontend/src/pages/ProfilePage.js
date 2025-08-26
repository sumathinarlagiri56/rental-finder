import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HouseCard from '../components/HouseCard';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [userHouses, setUserHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated]);

  const loadUserData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const reqConfig = { params: { t: Date.now() }, headers: { 'Cache-Control': 'no-cache', ...headers } };
      const [profileResponse, housesResponse] = await Promise.all([
        axios.get('/api/user/profile', reqConfig),
        axios.get('/api/houses/my', reqConfig),
      ]);

      setUserProfile(profileResponse.data);
      setUserHouses(housesResponse.data.houses || []);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        navigate('/login');
        return;
      }
      setError(err.response?.data?.error || 'Error loading user data. Please try again.');
      console.error('Profile loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteHouse = async (houseId) => {
    try {
      setLoading(true);
      await axios.delete(`/api/houses/${houseId}`);
      setUserHouses((prev) => prev.filter((h) => h.id !== houseId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete house');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-600 dark:text-gray-300">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 animate-fade-in-up">
            <div className="flex items-center">
              <span className="text-red-500 text-xl mr-3">⚠️</span>
              <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* User Profile Section */}
        <div className="card animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-amber-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                {userProfile?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Profile</h1>
                <p className="text-gray-600 dark:text-gray-400">Member since {userProfile?.createdAt ? formatDate(userProfile.createdAt) : 'N/A'}</p>
              </div>
            </div>
            <Link to="/add-house" className="btn-accent px-6">
              ➕ Add New House
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                <p className="text-lg text-gray-900 dark:text-white">{userProfile?.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <p className="text-lg text-gray-900 dark:text-white">{userProfile?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <p className="text-lg text-gray-900 dark:text-white">{userProfile?.phoneNumber || 'Not provided'}</p>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Account Statistics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Houses Listed:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{userHouses.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Active Listings:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">{userHouses.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User's Houses Section */}
        <div className="card animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My House Listings</h2>
            {userHouses.length > 0 && (
              <button onClick={loadUserData} className="btn-outline px-5">🔄 Refresh</button>
            )}
          </div>

          {userHouses.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No houses listed yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start by adding your first house listing to connect with potential tenants.
              </p>
              <Link to="/add-house" className="btn-primary px-6">Add Your First House</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userHouses.map((house) => (
                <HouseCard key={house.id} house={house} showOwnerActions onDelete={deleteHouse} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 