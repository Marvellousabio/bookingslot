import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';
import { getUserFromToken } from '@/lib/getUserFromToken';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const bookings = await Booking.find({ user: user._id }).populate('space');
    return NextResponse.json(bookings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { spaceId, startDate, endDate } = await request.json();

    if (!spaceId || !startDate || !endDate) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await dbConnect();

    // Check for conflicting bookings
    const conflictingBooking = await Booking.findOne({
      space: spaceId,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        { startDate: { $lt: new Date(endDate), $gte: new Date(startDate) } },
        { endDate: { $gt: new Date(startDate), $lte: new Date(endDate) } },
        { startDate: { $lte: new Date(startDate) }, endDate: { $gte: new Date(endDate) } }
      ]
    });

    if (conflictingBooking) {
      return NextResponse.json({ error: 'Space is not available for the selected dates' }, { status: 400 });
    }

    const booking = new Booking({
      user: user._id,
      space: spaceId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    await booking.save();
    return NextResponse.json({ message: 'Booking created successfully', booking });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}