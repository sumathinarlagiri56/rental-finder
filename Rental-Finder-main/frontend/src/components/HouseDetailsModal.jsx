import React, { useEffect, useState } from 'react';

const HouseDetailsModal = ({ house, onClose }) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!house) return null;

  const imageSrc = !imageError && house.hasImage ? `/api/houses/image/${house.id}` : '/no-photo.svg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-3xl mx-4 card animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{house.type} • {house.city}</h3>
          <button onClick={onClose} className="btn-outline px-4 py-2">✕ Close</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 h-64 md:h-full flex items-center justify-center">
            <img
              src={imageSrc}
              alt={`${house.type} in ${house.city}`}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Location</div>
              <div className="text-lg font-medium text-gray-900 dark:text-white">{house.city}, {house.district}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Contact</div>
              <a href={`tel:${house.phoneNumber}`} className="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                {house.phoneNumber}
              </a>
            </div>
            {house.createdAt && (
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Listed on</div>
                <div className="text-lg font-medium text-gray-900 dark:text-white">{new Date(house.createdAt).toLocaleString()}</div>
              </div>
            )}
            <div className="pt-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600">Available</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseDetailsModal;
