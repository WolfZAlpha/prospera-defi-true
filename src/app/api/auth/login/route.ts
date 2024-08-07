import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    console.log('Attempting to connect to database');
    await dbConnect();
    console.log('Connected to database successfully');

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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    console.log(`Login successful for user: ${emailOrUsername}`);

    return NextResponse.json({ token, user: user.toJSON() });
  } catch (error: unknown) {
    console.error('Detailed login error:', error);
    if (error instanceof mongoose.Error) {
      return NextResponse.json({ message: 'Database error', error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Server error', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}