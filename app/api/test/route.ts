import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Test API works' });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ message: 'Received', data: body });
}