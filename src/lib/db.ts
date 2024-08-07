import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// Accessing MongoDB URI and CA Certificate from environment variables
const MONGODB_URI: string = process.env.MONGODB_URI!;
const CA_CERT: string | undefined = process.env.CA_CERT;

console.log('MONGODB_URI:', MONGODB_URI);
console.log('CA_CERT:', CA_CERT ? 'Present' : 'Not Defined');

// Throw an error if the MONGODB_URI is not defined
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

// Cache object to store the database connection
let cached: {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
} = (global as any).mongoose || { conn: null, promise: null };

// Function to decode Base64 encoded certificate and write to a temporary file
function getDecodedCACert(base64Cert: string): string {
  const decodedCert = Buffer.from(base64Cert, 'base64').toString('utf-8');
  const tempFilePath = path.join('/tmp', 'ca-cert.pem'); // Temp file path

  // Writing the decoded certificate to the temporary file
  fs.writeFileSync(tempFilePath, decodedCert);
  console.log('CA Certificate written to temporary file:', tempFilePath);

  return tempFilePath;
}

// Database connection function
async function dbConnect(): Promise<mongoose.Mongoose> {
  // If a connection already exists, use it
  if (cached.conn) {
    console.log('Using existing database connection');
    return cached.conn;
  }

  // Create a new connection promise if one doesn't exist
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      tls: !!CA_CERT, // Enable TLS if CA_CERT is defined
      tlsAllowInvalidHostnames: false,
      tlsAllowInvalidCertificates: false,
      tlsCAFile: CA_CERT && (CA_CERT.includes('BEGIN CERTIFICATE') || CA_CERT.match(/^([A-Za-z0-9+/=]+)$/))
        ? getDecodedCACert(CA_CERT)
        : undefined
    };

    console.log('Creating new database connection');

    // Ensure MONGODB_URI is a valid string
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is undefined');
    }

    // Establish connection with Mongoose and cache the promise
    cached.promise = mongoose
      .connect(MONGODB_URI, opts) 
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
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    console.error('Error in database connection:', e);
    throw e;
  }
}

export default dbConnect;
