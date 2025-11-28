'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

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

export default function SpaceDetails() {
  const params = useParams();
  const router = useRouter();
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated] = useState(() => !!localStorage.getItem('token'));

  useEffect(() => {
    if (params.id) {
      fetch(`/api/spaces/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setSpace(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [params.id]);

  const handleBookClick = () => {
    if (!isAuthenticated) {
      router.push('/signin');
    } else {
      router.push(`/booking?space=${space?._id}`);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!space) {
    return <div className="min-h-screen flex items-center justify-center">Space not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            <div>
              <img src={space.images[0] || '/placeholder.jpg'} alt={space.name} className="w-full h-64 object-cover rounded-lg" />
              <div className="mt-4 grid grid-cols-2 gap-2">
                {space.images.slice(1).map((img, index) => (
                  <img key={index} src={img} alt={`${space.name} ${index + 1}`} className="w-full h-32 object-cover rounded" />
                ))}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-4 text-black/70">{space.name}</h1>
              <p className="text-gray-600 mb-2">Type: {space.type}</p>
              <p className="text-gray-600 mb-2">Location: {space.location}</p>
              <p className="text-gray-600 mb-2">Capacity: {space.capacity}</p>
              <p className="text-gray-600 mb-4">Amenities: {space.amenities.join(', ')}</p>
              <p className="text-gray-600 mb-4">{space.description}</p>
              <p className="text-2xl font-bold text-blue-600 mb-6">${space.pricePerHour}/hour</p>
              <button onClick={handleBookClick} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
                Book Now
              </button>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}