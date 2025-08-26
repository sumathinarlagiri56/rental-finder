import React, { useState } from 'react';
import HouseDetailsModal from './HouseDetailsModal.jsx';

const HouseCard = ({ house, showOwnerActions = false, onDelete }) => {
  const [open, setOpen] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = () => {
    if (!onDelete) return;
    onDelete(house.id);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-200 dark:border-gray-800">
      <div className="h-48 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
        {house.hasImage ? (
          <img
            src={`/api/houses/image/${house.id}`}
            alt={`${house.type} house in ${house.city}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`flex items-center justify-center ${house.hasImage ? 'hidden' : 'flex'}`}>
          <div className="text-gray-400 text-6xl">🏠</div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{house.type}</h3>
          <span className="px-2 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600">
            Available
          </span>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <span className="mr-2">📍</span>
            <span>{house.city}, {house.district}</span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <span className="mr-2">📞</span>
            <a 
              href={`tel:${house.phoneNumber}`}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {house.phoneNumber}
            </a>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <span className="mr-2">📅</span>
            <span>Listed on {formatDate(house.createdAt)}</span>
          </div>
        </div>
        
        <div className={`grid ${showOwnerActions ? 'grid-cols-3' : 'grid-cols-2'} gap-2`}>
          <button className="btn-primary" onClick={() => (window.location.href = `tel:${house.phoneNumber}`)}>Contact Owner</button>
          <button className="btn-outline" onClick={() => setOpen(true)}>View Details</button>
          {showOwnerActions && (
            <button className="px-3 py-2 text-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200" onClick={handleDelete}>
              🗑️ Delete
            </button>
          )}
        </div>
      </div>

      {open && <HouseDetailsModal house={house} onClose={() => setOpen(false)} />}
    </div>
  );
};

export default HouseCard; 