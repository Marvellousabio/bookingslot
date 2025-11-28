'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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

interface SpaceCardProps {
  space: Space;
}

export default function SpaceCard({ space }: SpaceCardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleBookClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/signin');
    } else {
      router.push(`/booking?space=${space._id}`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img src={space.images[0] || '/placeholder.jpg'} alt={space.name} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{space.name}</h3>
        <p className="text-gray-600 mb-2">{space.type} • {space.location}</p>
        <p className="text-gray-600 mb-2">Capacity: {space.capacity}</p>
        <p className="text-gray-600 mb-2">Amenities: {space.amenities.join(', ')}</p>
        <p className="text-gray-600 mb-4">{space.description}</p>
        <p className="text-2xl font-bold text-blue-600 mb-4">${space.pricePerHour}/hour</p>
        <div className="flex space-x-2">
          <Link href={`/spaces/${space._id}`} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
            View Details
          </Link>
          <button onClick={handleBookClick} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}