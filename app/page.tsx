'use client';

import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import Tabs from './components/Tabs';
import SpaceCard from './components/SpaceCard';

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

export default function Home() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [filteredSpaces, setFilteredSpaces] = useState<Space[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetch('/api/spaces')
      .then(res => res.json())
      .then(data => {
        setSpaces(data);
        setFilteredSpaces(data);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (activeTab === 'all') {
      setFilteredSpaces(spaces);
    } else {
      setFilteredSpaces(spaces.filter(space => space.type === activeTab));
    }
  }, [activeTab, spaces]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Featured Spaces */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Spaces</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSpaces.map(space => (
              <SpaceCard key={space._id} space={space} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}