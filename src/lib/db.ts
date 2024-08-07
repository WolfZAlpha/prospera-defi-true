import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Accessing MongoDB URI and CA Certificate from environment variables
const MONGODB_URI: string | undefined = process.env.MONGODB_URI;
const CA_CERT: string | undefined = process.env.CA_CERT;

console.log('MONGODB_URI:', MONGODB_URI);

// Throw an error if the MONGODB_URI is not defined
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Cache object to store the database connection
let cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = (global as any).mongoose || { conn: null, promise: null };

// Function to decode Base64 encoded certificate and write to a temporary file
function getDecodedCACert(base64Cert: string): string {
  const decodedCert = Buffer.from(base64Cert, 'base64').toString('utf-8');
  const tempFilePath = path.join('/tmp', 'ca-cert.pem'); // Temp file path

  // Writing the decoded certificate to the temporary file
  fs.writeFileSync(tempFilePath, decodedCert);

  return tempFilePath;
}

// Database connection function
async function dbConnect() {
  // If a connection already exists, use it
  if (cached.conn) {
    console.log('Using existing database connection');
    return cached.conn;
  }

  // Create a new connection promise if one doesn't exist
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      // Buffer commands for serverless environments
      bufferCommands: false,
      // Timeout settings
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout for server selection
      socketTimeoutMS: 45000,          // 45 seconds timeout for socket
      // Connection pool settings
      maxPoolSize: 10,                 // Limit connection pool to 10 connections
    };

    // Handle TLS options if CA_CERT is provided
    if (CA_CERT) {
      opts.tls = true;

      if (CA_CERT.includes('BEGIN CERTIFICATE')) {
        // If CA_CERT is a raw certificate string
        const tempFilePath = path.join('/tmp', 'ca-cert.pem');
        fs.writeFileSync(tempFilePath, CA_CERT); // Write raw cert to file
        opts.tlsCAFile = tempFilePath;
      } else if (CA_CERT.match(/^([A-Za-z0-9+/=]+)$/)) {
        // If CA_CERT is Base64 encoded
        opts.tlsCAFile = getDecodedCACert(CA_CERT);
      } else {
        // If CA_CERT is a file path
        opts.tlsCAFile = CA_CERT;
      }

      opts.tlsAllowInvalidHostnames = false;
      opts.tlsAllowInvalidCertificates = false;
    }

    console.log('Creating new database connection');

    // Ensure MONGODB_URI is a valid string
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is undefined');
    }

    // Establish connection with Mongoose and cache the promise
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)  // MONGODB_URI is now guaranteed to be a string
      .then((mongoose) => {
        console.log('New database connection created successfully');
        return mongoose;
      })
      .catch((error) => {
        console.error('Error creating database connection:', error);
        throw error;
      });
  } else {
    console.log('Using existing database connection promise');
  }

  try {
    // Await the cached promise to establish the connection
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    // Reset the cached promise if an error occurs
    cached.promise = null;
    console.error('Error in database connection:', e);
    throw e;
  }
}

export default dbConnect;
