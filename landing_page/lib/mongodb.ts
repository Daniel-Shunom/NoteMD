import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = { appName: "devrel.template.nextjs" };

let client: MongoClient | null = null;

export const connectMongoDB = async () => {
  try {
    if (!client) {
      // Initialize MongoClient only if it's not already initialized
      client = new MongoClient(uri, options);
    }

    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB');
    
    return client; // Return the client instance if needed
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};
