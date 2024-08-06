import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    console.log('Attempting to connect to database');
    await dbConnect();
    console.log('Connected to database successfully');

    const { email, username, password, arbitrumWallet } = await req.json();
    console.log(`Registration attempt for email: ${email}, username: ${username}`);

    let existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.trim() }
      ]
    });

    if (existingUser) {
      console.log(`User already exists: ${email} or ${username}`);
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email: email.toLowerCase(),
      username: username.trim(),
      password: hashedPassword,
      arbitrumWallet: arbitrumWallet ? arbitrumWallet.trim() : undefined,
    });

    await newUser.save();
    console.log(`User registered successfully: ${email}`);

    return NextResponse.json({ message: 'User registered successfully', user: newUser.toJSON() }, { status: 201 });
  } catch (error) {
    console.error('Detailed registration error:', error);
    return NextResponse.json({ message: 'Server error', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}