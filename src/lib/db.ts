import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const CA_CERT = process.env.CA_CERT;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = (global as any).mongoose || { conn: null, promise: null };

async function dbConnect(): Promise<typeof mongoose> {
  if (cached.conn) {
    console.log('Using existing database connection');
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    if (CA_CERT) {
      console.log('Using CA certificate for MongoDB connection');
      opts.tls = true;
      opts.tlsCAFile = CA_CERT;
    }

    console.log('Creating new database connection');
    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongoose) => {
      console.log('New database connection created successfully');
      return mongoose;
    });

    const connection = mongoose.connection;

    connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    connection.on('error', (err) => {
      console.log('MongoDB connection error: ' + err);
      process.exit(1);
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    console.error('Error in database connection:', e);
    throw e;
  }
}

export default dbConnect;