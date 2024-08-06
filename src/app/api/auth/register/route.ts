import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, username, password, arbitrumWallet } = await req.json();

    let user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      email,
      username,
      password: hashedPassword,
      arbitrumWallet,
    });

    await user.save();

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json({ message: 'Server error', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}