import { cookies } from 'next/headers';
import { verifyToken } from './auth';
import dbConnect from './mongodb';
import User from './models/User';

export async function getUserFromToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return null;
  }

  await dbConnect();
  const user = await User.findById(decoded.userId).select('-password');
  return user;
}