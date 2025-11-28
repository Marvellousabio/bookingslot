import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Space from '@/lib/models/Space';
import User from '@/lib/models/User';
import { hashPassword } from '@/lib/auth';

const mockSpaces = [
  {
    name: 'Downtown Hub',
    type: 'coworking',
    location: '123 Main St, Downtown',
    capacity: 50,
    amenities: ['WiFi', 'Coffee', 'Parking', 'AC'],
    description: 'Modern coworking space in the heart of downtown with high-speed internet and comfortable seating.',
    pricePerHour: 15.99,
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'],
  },
  {
    name: 'Creative Studio',
    type: 'meeting room',
    location: '456 Art Ave, Arts District',
    capacity: 12,
    amenities: ['WiFi', 'Projector', 'Whiteboard', 'Coffee'],
    description: 'Perfect for creative meetings and brainstorming sessions with artistic surroundings.',
    pricePerHour: 25.00,
    images: ['https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'],
  },
  {
    name: 'Executive Suite',
    type: 'conference hall',
    location: '789 Business Blvd, Financial District',
    capacity: 100,
    amenities: ['WiFi', 'Projector', 'Whiteboard', 'Coffee', 'Parking', 'AC'],
    description: 'Large conference hall ideal for corporate events, presentations, and large meetings.',
    pricePerHour: 75.00,
    images: ['https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800', 'https://images.unsplash.com/photo-1511632810258-3c8e8c9c9b7c?w=800'],
  },
  {
    name: 'Garden Oasis',
    type: 'event venue',
    location: '321 Garden Ln, Suburban Area',
    capacity: 80,
    amenities: ['WiFi', 'Coffee', 'Parking', 'AC', 'Outdoor Space'],
    description: 'Beautiful outdoor venue with garden views, perfect for weddings and special events.',
    pricePerHour: 50.00,
    images: ['https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800'],
  },
  {
    name: 'Tech Loft',
    type: 'coworking',
    location: '654 Tech Park, Innovation District',
    capacity: 30,
    amenities: ['WiFi', 'Coffee', 'Parking', 'AC', 'Projector'],
    description: 'High-tech coworking space with modern amenities and fast internet for tech professionals.',
    pricePerHour: 20.00,
    images: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800'],
  },
];

export async function POST() {
  try {
    await dbConnect();

    // Clear existing data
    await Space.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    const hashedPassword = await hashPassword('admin123');
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
    });
    await adminUser.save();

    // Create regular user
    const userPassword = await hashPassword('user123');
    const regularUser = new User({
      name: 'Regular User',
      email: 'user@example.com',
      password: userPassword,
    });
    await regularUser.save();

    // Insert mock spaces
    const spaces = await Space.insertMany(mockSpaces);

    return NextResponse.json({
      message: 'Mock data seeded successfully',
      users: [
        { email: 'admin@example.com', password: 'admin123', role: 'admin' },
        { email: 'user@example.com', password: 'user123', role: 'user' },
      ],
      spacesCount: spaces.length,
      spaces: spaces.map(s => ({ id: s._id, name: s.name }))
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to seed mock data' }, { status: 500 });
  }
}