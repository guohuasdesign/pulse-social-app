import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

export const connectToDatabase = async () => {
  if (!uri) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  try {
    const client = await MongoClient.connect(uri);
    return client;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw new Error("Database connection failed");
  }
};
