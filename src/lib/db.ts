import mongoose from 'mongoose';

const DATABASE_URL = process.env.DATABASE_URL;
const CA_CERT = process.env.CA_CERT;

if (!DATABASE_URL) {
  throw new Error('Please define the DATABASE_URL environment variable');
}

interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: Cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    };

    if (CA_CERT) {
      opts.tls = true;
      opts.tlsCAFile = CA_CERT;
    }

    cached.promise = mongoose.connect(DATABASE_URL!, opts).then((mongoose) => {
      console.log('Connected to MongoDB');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
}

export default dbConnect;