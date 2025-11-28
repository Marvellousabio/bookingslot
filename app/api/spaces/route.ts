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

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const space = new Space(body);
    await space.save();
    return NextResponse.json(space, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}