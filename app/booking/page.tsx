'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Calendar from 'react-calendar';

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

export default function Booking() {
  const router = useRouter();
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    fetch('/api/spaces')
      .then(res => res.json())
      .then(data => setSpaces(data))
      .catch(err => console.error(err));
  }, []);

  const filteredSpaces = useMemo(() => {
    let filtered = spaces;
    if (typeFilter) {
      filtered = filtered.filter(space => space.type === typeFilter);
    }
    if (locationFilter) {
      filtered = filtered.filter(space => space.location.toLowerCase().includes(locationFilter.toLowerCase()));
    }
    return filtered;
  }, [spaces, typeFilter, locationFilter]);

  const handleSpaceSelect = async (space: Space) => {
    setSelectedSpace(space);
    setSelectedDates([]);
    setShowCalendar(true);
    // Fetch booked dates
    const res = await fetch(`/api/spaces/${space._id}/bookings`);
    const dates = await res.json();
    setBookedDates(dates.map((d: string) => new Date(d)));
  };

  const isDateBooked = (date: Date) => {
    return bookedDates.some(bookedDate =>
      bookedDate.toDateString() === date.toDateString()
    );
  };

  const handleDateClick = (date: Date) => {
    if (isDateBooked(date)) return;

    setSelectedDates(prev => {
      if (prev.length === 0) return [date];
      if (prev.length === 1) {
        const start = prev[0];
        const end = date;
        if (start > end) return [end, start];
        // Check if range is available
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          if (isDateBooked(d)) return prev; // Invalid range
        }
        return [start, end];
      }
      return [date];
    });
  };

  const handleBooking = () => {
    if (!selectedSpace || selectedDates.length !== 2) return;

    const totalHours = Math.ceil((selectedDates[1].getTime() - selectedDates[0].getTime()) / (1000 * 60 * 60));

    // Redirect to payment page with booking details
    const params = new URLSearchParams({
      spaceId: selectedSpace._id,
      spaceName: selectedSpace.name,
      startDate: selectedDates[0].toISOString(),
      endDate: selectedDates[1].toISOString(),
      totalHours: totalHours.toString(),
      pricePerHour: selectedSpace.pricePerHour.toString(),
    });

    router.push(`/payment?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Book a Space</h1>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4">
        <div>
          <label htmlFor="type-filter" className="block text-sm font-medium mb-1">Space Type</label>
          <select
            id="type-filter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2"
            title="Filter spaces by type"
          >
            <option value="">All Types</option>
            <option value="coworking">Coworking</option>
            <option value="meeting room">Meeting Room</option>
            <option value="event venue">Event Venue</option>
            <option value="conference hall">Conference Hall</option>
          </select>
        </div>
        <div>
          <label htmlFor="location-filter" className="block text-sm font-medium mb-1">Location</label>
          <input
            id="location-filter"
            type="text"
            placeholder="Filter by location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2"
          />
        </div>
      </div>

      {/* Space List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredSpaces.map(space => (
          <div key={space._id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={space.images[0] || '/placeholder.jpg'} alt={space.name} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{space.name}</h3>
              <p className="text-gray-600 mb-2">{space.type} • {space.location}</p>
              <p className="text-gray-600 mb-4">Capacity: {space.capacity}</p>
              <p className="text-2xl font-bold text-blue-600 mb-4">${space.pricePerHour}/hour</p>
              <button
                onClick={() => handleSpaceSelect(space)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Select for Booking
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Calendar and Booking Form */}
      {showCalendar && selectedSpace && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Book {selectedSpace.name}</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Select Dates</h3>
              <Calendar
                onClickDay={handleDateClick}
                tileDisabled={({ date }) => isDateBooked(date)}
                selectRange={true}
                value={selectedDates.length === 2 ? selectedDates as [Date, Date] : null}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Booking Details</h3>
              {selectedDates.length === 2 && (
                <div className="mb-4">
                  <p>From: {selectedDates[0].toDateString()}</p>
                  <p>To: {selectedDates[1].toDateString()}</p>
                  <p>Total Hours: {Math.ceil((selectedDates[1].getTime() - selectedDates[0].getTime()) / (1000 * 60 * 60))}</p>
                </div>
              )}
              {bookingError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {bookingError}
                </div>
              )}
              <button
                onClick={handleBooking}
                disabled={selectedDates.length !== 2}
                className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}