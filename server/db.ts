import { MongoClient, Db } from "mongodb";

let client: MongoClient;
let db: Db;

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = "intelliserveDB";

export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log("MongoDB connected successfully to:", DB_NAME);
    return db;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export function getDatabase(): Db {
  if (!db) {
    throw new Error(
      "Database not initialized. Call connectToDatabase() first.",
    );
  }
  return db;
}

export async function closeDatabaseConnection(): Promise<void> {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
}
