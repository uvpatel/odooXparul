import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI")
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

const globalForMongoose = globalThis as typeof globalThis & {
  mongoose?: MongooseCache
}

let cached = globalForMongoose.mongoose

if (!cached) {
  cached = globalForMongoose.mongoose = {
    conn: null,
    promise: null,
  }
}

const mongooseCache = cached

export async function connectDB() {
  if (mongooseCache.conn) {
    return mongooseCache.conn
  }

  if (!mongooseCache.promise) {
    mongooseCache.promise = mongoose.connect(MONGODB_URI)
  }

  mongooseCache.conn = await mongooseCache.promise

  return mongooseCache.conn
}
