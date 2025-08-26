import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddHousePage = () => {
  const [formData, setFormData] = useState({
    type: '',
    phoneNumber: '',
    district: '',
    city: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const loadTelanganaData = async () => {
      try {
        const response = await fetch('/telangana_districts_cities.json');
        const data = await response.json();
        setDistricts(Object.keys(data));
      } catch (error) {
        console.error('Error loading Telangana data:', error);
      }
    };

    loadTelanganaData();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      if (formData.district) {
        try {
          const response = await fetch('/telangana_districts_cities.json');
          const data = await response.json();
          setCities(data[formData.district] || []);
        } catch (error) {
          console.error('Error loading cities:', error);
        }
      } else {
        setCities([]);
      }
      setFormData(prev => ({ ...prev, city: '' }));
    };

    loadCities();
  }, [formData.district]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError('Image size should be less than 10MB');
        return;
      }
      setImageFile(file);
      setError('');
    } else {
      setImageFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!imageFile) {
      setError('Please upload a house image (required).');
      return;
    }

    setLoading(true);
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('type', formData.type);
      formDataToSend.append('phoneNumber', formData.phoneNumber);
      formDataToSend.append('district', formData.district);
      formDataToSend.append('city', formData.city);
      formDataToSend.append('image', imageFile);

      await axios.post('/api/houses/add', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('House added successfully!');
      setFormData({ type: '', phoneNumber: '', district: '', city: '' });
      setImageFile(null);
      const fileInput = document.getElementById('image');
      if (fileInput) fileInput.value = '';

      setTimeout(() => {
        navigate('/profile');
      }, 1200);

    } catch (error) {
      setError(error.response?.data?.error || 'Error adding house. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-2xl">
            <span className="text-3xl">🏠</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Add New House Listing</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Provide details below to publish your listing</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 animate-fade-in-up">
            <div className="flex items-center">
              <span className="text-red-500 text-lg mr-2">⚠️</span>
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6 animate-fade-in-up">
            <div className="flex items-center">
              <span className="text-green-600 text-lg mr-2">✅</span>
              <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
            </div>
          </div>
        )}

        <div className="card backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-2xl animate-fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="type" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                House Type *
              </label>
              <select id="type" name="type" required value={formData.type} onChange={handleChange} className="input-field appearance-none cursor-pointer">
                <option value="">Select House Type</option>
                <option value="1BHK">1 BHK</option>
                <option value="2BHK">2 BHK</option>
                <option value="3BHK">3 BHK</option>
                <option value="4BHK">4 BHK</option>
              </select>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Contact Phone Number *
              </label>
              <input type="tel" id="phoneNumber" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange} placeholder="Enter contact phone number" className="input-field" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="district" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">District *</label>
                <select id="district" name="district" required value={formData.district} onChange={handleChange} className="input-field appearance-none cursor-pointer">
                  <option value="">Select District</option>
                  {districts.map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">City *</label>
                <select id="city" name="city" required value={formData.city} onChange={handleChange} className="input-field appearance-none cursor-pointer" disabled={!formData.district}>
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                House Image *
              </label>
              <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Maximum file size: 10MB. Supported formats: JPG, PNG, GIF</p>
            </div>

            <div className="flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0">
              <button type="submit" disabled={loading} className="btn-accent flex-1">
                {loading ? 'Adding House...' : 'Add House'}
              </button>
              <button type="button" onClick={() => navigate('/profile')} className="btn-outline flex-1">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddHousePage; 