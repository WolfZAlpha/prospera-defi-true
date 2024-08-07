import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    console.log('Attempting to connect to database for login');
    await dbConnect();
    console.log('Connected to database successfully for login');

    const { emailOrUsername, password } = await req.json();
    console.log(`Login attempt for: ${emailOrUsername}`);

    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername }
      ]
    });

    if (!user) {
      console.log(`User not found: ${emailOrUsername}`);
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log(`Invalid credentials for user: ${emailOrUsername}`);
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log(`Login successful for user: ${emailOrUsername}`);

    const response = NextResponse.json({ message: 'Login successful', user: user.toJSON() });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1 hour
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    console.error('Detailed login error:', error);
    if (error instanceof mongoose.Error) {
      return NextResponse.json({ message: 'Database error', error: (error as Error).message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Server error', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}