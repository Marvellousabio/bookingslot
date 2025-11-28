'use client';

import { useEffect, useState, useMemo } from 'react';
import SpaceCard from '../components/SpaceCard';

interface Space {
  _id: string;
  name: string;
  type: string;
  location: string;
  capacity: number;
  amenities: string[];
  description: string;
  pricePerHour: number;
  images: string[];
}

export default function AllSpaces() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    fetch('/api/spaces')
      .then(res => res.json())
      .then(data => setSpaces(data))
      .catch(err => console.error(err));
  }, []);

  const filteredSpaces = useMemo(() => {
    let filtered = spaces;
    if (typeFilter !== 'all') {
      filtered = filtered.filter(space => space.type === typeFilter);
    }
    if (locationFilter) {
      filtered = filtered.filter(space => space.location.toLowerCase().includes(locationFilter.toLowerCase()));
    }
    return filtered;
  }, [spaces, typeFilter, locationFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-black/70">All Available Spaces</h1>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                typeFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('coworking')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                typeFilter === 'coworking'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Coworking
            </button>
            <button
              onClick={() => setTypeFilter('meeting room')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                typeFilter === 'meeting room'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Meeting Room
            </button>
            <button
              onClick={() => setTypeFilter('event venue')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                typeFilter === 'event venue'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Event Venue
            </button>
            <button
              onClick={() => setTypeFilter('conference hall')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                typeFilter === 'conference hall'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Conference Hall
            </button>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="location-search" className="text-sm font-medium text-gray-700">Location:</label>
            <input
              id="location-search"
              type="text"
              placeholder="Search by location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Spaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSpaces.map(space => (
            <SpaceCard key={space._id} space={space} />
          ))}
        </div>

        {filteredSpaces.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No spaces found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}