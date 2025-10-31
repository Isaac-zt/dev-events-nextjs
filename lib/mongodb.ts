import mongoose from 'mongoose';

// Extend the global namespace to include mongoose connection cache
declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  } | undefined;
}

// MongoDB connection URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI;

// Validate that the MongoDB URI is provided
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Establishes a connection to MongoDB using Mongoose.
 * Caches the connection to prevent multiple connections during development hot reloads
 * and serverless function invocations.
 * 
 * @returns Promise<mongoose.Connection> - The active MongoDB connection
 */
async function connectToDatabase(): Promise<mongoose.Connection> {
  // Return cached connection if it exists
  if (cached.conn) {
    return cached.conn;
  }

  // If no promise exists, create a new connection
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false, // Disable mongoose buffering to fail fast in serverless environments
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout for server selection
      socketTimeoutMS: 45000, // 45 seconds timeout for socket operations
    };

    // Create a new connection promise and cache it
    cached.promise = mongoose.connect(MONGODB_URI as string, opts).then((mongooseInstance) => {
      return mongooseInstance.connection;
    });
  }

  try {
    // Await the promise and cache the connection
    cached.conn = await cached.promise;
  } catch (error) {
    // If connection fails, reset the promise to allow retry
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;
