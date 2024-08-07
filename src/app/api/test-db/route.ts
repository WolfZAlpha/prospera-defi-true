import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import mongoose from 'mongoose';

export async function GET() {
  try {
    await dbConnect();
    
    // Check if the connection is ready
    if (mongoose.connection.readyState === 1) {
      // Try a simple database operation
      const collections = await mongoose.connection.db.listCollections().toArray();
      
      return NextResponse.json({ 
        message: 'Database connection successful', 
        connectionState: 'Connected',
        collections: collections.map(col => col.name)
      }, { status: 200 });
    } else {
      return NextResponse.json({ 
        message: 'Database not connected', 
        connectionState: mongoose.STATES[mongoose.connection.readyState] 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      message: 'Failed to connect to database', 
      error: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}