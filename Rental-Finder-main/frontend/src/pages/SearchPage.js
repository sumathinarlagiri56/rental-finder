import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HouseCard from '../components/HouseCard';
import { useTheme } from '../context/ThemeContext';

const SearchPage = () => {
  const [houses, setHouses] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isDarkMode } = useTheme();

  // Load Telangana districts and cities from JSON file
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

  // Update cities when district changes
  useEffect(() => {
    const loadCities = async () => {
      if (selectedDistrict) {
        try {
          const response = await fetch('/telangana_districts_cities.json');
          const data = await response.json();
          setCities(data[selectedDistrict] || []);
        } catch (error) {
          console.error('Error loading cities:', error);
        }
      } else {
        setCities([]);
      }
      setSelectedCity('');
    };

    loadCities();
  }, [selectedDistrict]);

  const searchHouses = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {};
      if (selectedDistrict) params.district = selectedDistrict;
      if (selectedCity) params.city = selectedCity;

      const response = await axios.get('/api/houses/search', { params });
      setHouses(response.data.houses);
    } catch (error) {
      setError('Error searching houses. Please try again.');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchHouses();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-accent-500 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
            <span className="text-3xl">🔍</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Find Your Perfect Home
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover amazing rental properties across Telangana with our comprehensive search
          </p>
        </div>

        {/* Search Form */}
        <div className="card backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-0 shadow-2xl mb-12 animate-fade-in-up">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Search Criteria
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Select your preferred location to find available houses
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="district" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  🏛️ District
                </label>
                <div className="relative">
                  <select
                    id="district"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="input-field appearance-none cursor-pointer"
                  >
                    <option value="">Choose a district</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-400">▼</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  🏙️ City
                </label>
                <div className="relative">
                  <select
                    id="city"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="input-field appearance-none cursor-pointer"
                    disabled={!selectedDistrict}
                  >
                    <option value="">
                      {selectedDistrict ? 'Choose a city' : 'Select district first'}
                    </option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-gray-400">▼</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <button
                type="submit"
                disabled={loading || (!selectedDistrict && !selectedCity)}
                className="btn-primary text-lg py-4 px-8 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Searching...
                  </div>
                ) : (
                  '🔍 Search Houses'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8 animate-fade-in-up">
            <div className="flex items-center">
              <span className="text-red-500 text-xl mr-3">⚠️</span>
              <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {houses.length > 0 ? `Found ${houses.length} house${houses.length === 1 ? '' : 's'}` : 'No houses found'}
            </h2>
            {houses.length > 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full">
                {selectedDistrict && selectedCity 
                  ? `${selectedDistrict} • ${selectedCity}`
                  : selectedDistrict 
                    ? selectedDistrict 
                    : 'All locations'
                }
              </div>
            )}
          </div>
        </div>

        {/* Houses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {houses.map((house) => (
            <div key={house.id} className="animate-fade-in-up">
              <HouseCard house={house} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {houses.length === 0 && !loading && !error && (
          <div className="text-center py-16 animate-fade-in-up">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🏠</span>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              No houses found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-md mx-auto">
              Try adjusting your search criteria or browse all available properties
            </p>
            <button
              onClick={() => {
                setSelectedDistrict('');
                setSelectedCity('');
                setHouses([]);
              }}
              className="mt-6 btn-outline"
            >
              🔄 Clear Search
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="mx-auto w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Searching for houses...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage; 