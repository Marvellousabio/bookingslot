import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Space from '@/lib/models/Space';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const space = await Space.findById(params.id);
    if (!space) {
      return NextResponse.json({ error: 'Space not found' }, { status: 404 });
    }
    return NextResponse.json(space);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}