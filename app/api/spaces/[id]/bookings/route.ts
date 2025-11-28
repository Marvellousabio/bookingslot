import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Booking from '@/lib/models/Booking';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await dbConnect();

    const bookings = await Booking.find({
      space: id,
      status: { $in: ['pending', 'confirmed'] }
    }).select('startDate endDate');

    const bookedDates = [];
    bookings.forEach(booking => {
      const start = new Date(booking.startDate);
      const end = new Date(booking.endDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        bookedDates.push(new Date(d));
      }
    });

    return NextResponse.json(bookedDates);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}