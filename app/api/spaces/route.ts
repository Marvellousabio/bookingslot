import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Space from '@/lib/models/Space';

export async function GET() {
  try {
    await dbConnect();
    const spaces = await Space.find({});
    return NextResponse.json(spaces);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}