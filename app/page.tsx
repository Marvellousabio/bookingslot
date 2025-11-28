'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Space {
  _id: string;
  name: string;
  type: string;
  location: string;
  capacity: number;
  pricePerHour: number;
  images: string[];
}

export default function Home() {
  const [spaces, setSpaces] = useState<Space[]>([]);

  useEffect(() => {
    fetch('/api/spaces')
      .then(res => res.json())
      .then(data => setSpaces(data.slice(0, 3))) // Show first 3
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Book Your Perfect Space
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            Find and reserve coworking spaces, meeting rooms, event venues, and conference halls.
          </p>
          <div className="space-x-4">
            <Link href="/signup" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
              Get Started
            </Link>
            <Link href="/booking" className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600">
              Browse Spaces
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Spaces */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Spaces</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {spaces.map(space => (
              <div key={space._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={space.images[0] || '/placeholder.jpg'} alt={space.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{space.name}</h3>
                  <p className="text-gray-600 mb-2">{space.type} • {space.location}</p>
                  <p className="text-gray-600 mb-4">Capacity: {space.capacity}</p>
                  <p className="text-2xl font-bold text-blue-600">${space.pricePerHour}/hour</p>
                  <Link href={`/booking?space=${space._id}`} className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}