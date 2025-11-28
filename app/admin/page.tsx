'use client';

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

export default function AdminDashboard() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [editingSpace, setEditingSpace] = useState<Space | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'coworking',
    location: '',
    capacity: 1,
    amenities: [] as string[],
    description: '',
    pricePerHour: 0,
    images: [] as string[],
  });

  const fetchSpaces = async () => {
    const res = await fetch('/api/spaces');
    const data = await res.json();
    setSpaces(data);
  };

  useEffect(() => {
    fetchSpaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingSpace ? `/api/spaces/${editingSpace._id}` : '/api/spaces';
    const method = editingSpace ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      fetchSpaces();
      resetForm();
    }
  };

  const handleEdit = (space: Space) => {
    setEditingSpace(space);
    setFormData({
      name: space.name,
      type: space.type,
      location: space.location,
      capacity: space.capacity,
      amenities: space.amenities,
      description: space.description,
      pricePerHour: space.pricePerHour,
      images: space.images,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this space?')) {
      const res = await fetch(`/api/spaces/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchSpaces();
      }
    }
  };

  const resetForm = () => {
    setEditingSpace(null);
    setFormData({
      name: '',
      type: 'coworking',
      location: '',
      capacity: 1,
      amenities: [],
      description: '',
      pricePerHour: 0,
      images: [],
    });
  };

  const handleAmenityChange = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard - Manage Spaces</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingSpace ? 'Edit Space' : 'Add New Space'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="space-name" className="block text-sm font-medium mb-1">Name</label>
              <input
                id="space-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Enter space name"
                required
              />
            </div>

            <div>
              <label htmlFor="space-type" className="block text-sm font-medium mb-1">Type</label>
              <select
                id="space-type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2 border rounded"
                title="Select space type"
              >
                <option value="coworking">Coworking</option>
                <option value="meeting room">Meeting Room</option>
                <option value="event venue">Event Venue</option>
                <option value="conference hall">Conference Hall</option>
              </select>
            </div>

            <div>
              <label htmlFor="space-location" className="block text-sm font-medium mb-1">Location</label>
              <input
                id="space-location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Enter location address"
                required
              />
            </div>

            <div>
              <label htmlFor="space-capacity" className="block text-sm font-medium mb-1">Capacity</label>
              <input
                id="space-capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                className="w-full p-2 border rounded"
                placeholder="Enter maximum capacity"
                min="1"
                required
              />
            </div>

            <div>
              <label htmlFor="space-description" className="block text-sm font-medium mb-1">Description</label>
              <textarea
                id="space-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Describe the space"
                rows={3}
                required
              />
            </div>

            <div>
              <label htmlFor="space-price" className="block text-sm font-medium mb-1">Price per Hour</label>
              <input
                id="space-price"
                type="number"
                value={formData.pricePerHour}
                onChange={(e) => setFormData({ ...formData, pricePerHour: parseFloat(e.target.value) })}
                className="w-full p-2 border rounded"
                placeholder="Enter price per hour"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Image URLs (comma-separated)</label>
              <input
                type="text"
                value={formData.images.join(', ')}
                onChange={(e) => setFormData({ ...formData, images: e.target.value.split(',').map(url => url.trim()) })}
                className="w-full p-2 border rounded"
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Amenities</label>
              <div className="space-y-2">
                {['WiFi', 'Coffee', 'Parking', 'AC', 'Projector', 'Whiteboard'].map(amenity => (
                  <label key={amenity} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="mr-2"
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                {editingSpace ? 'Update' : 'Add'} Space
              </button>
              {editingSpace && (
                <button type="button" onClick={resetForm} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Existing Spaces</h2>
          <div className="space-y-4">
            {spaces.map(space => (
              <div key={space._id} className="border rounded p-4">
                <h3 className="font-semibold">{space.name}</h3>
                <p className="text-sm text-gray-600">{space.type} • {space.location}</p>
                <p className="text-sm text-gray-600">Capacity: {space.capacity} • ${space.pricePerHour}/hour</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(space)}
                    className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(space._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {spaces.length === 0 && (
              <p className="text-gray-600">No spaces yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}