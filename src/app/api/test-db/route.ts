import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json({ message: 'Database connected successfully' }, { status: 200 });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ message: 'Database connection failed', error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}