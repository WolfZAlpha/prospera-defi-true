import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import mongoose from 'mongoose';
import { sendEmail } from '@/helpers/mailer';

export async function POST(req: Request) {
  console.log('Registration route hit');
  try {
    console.log('Attempting to connect to database for registration');
    await dbConnect();
    console.log('Connected to database successfully for registration');

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

    console.log('Attempting to save new user');
    await newUser.save();
    console.log(`User registered successfully: ${email}`);

    // Send verification email
    await sendEmail({ email, emailType: "VERIFY", userId: newUser._id });
    console.log(`Verification email sent to: ${email}`);

    return NextResponse.json({ message: 'User registered successfully. Please check your email to verify your account.', user: newUser.toJSON() }, { status: 201 });
  } catch (error: unknown) {
    console.error('Detailed registration error:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      console.error('Validation error:', error.errors);
      return NextResponse.json({ message: 'Validation error', error: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Server error', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}