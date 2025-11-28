'use client';

import { useEffect, useState } from 'react';

interface Booking {
  _id: string;
  space: {
    name: string;
    type: string;
    location: string;
  };
  startDate: string;
  endDate: string;
  status: string;
}

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      <div className="space-y-4">
        {bookings.map(booking => (
          <div key={booking._id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">{booking.space.name}</h3>
            <p className="text-gray-600 mb-2">{booking.space.type} • {booking.space.location}</p>
            <p className="text-gray-600 mb-2">
              From: {new Date(booking.startDate).toDateString()} To: {new Date(booking.endDate).toDateString()}
            </p>
            <p className={`font-semibold ${booking.status === 'confirmed' ? 'text-green-600' : booking.status === 'pending' ? 'text-yellow-600' : 'text-red-600'}`}>
              Status: {booking.status}
            </p>
          </div>
        ))}
        {bookings.length === 0 && (
          <p className="text-gray-600">No bookings yet.</p>
        )}
      </div>
    </div>
  );
}