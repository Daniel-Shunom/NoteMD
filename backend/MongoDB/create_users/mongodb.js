import MongoClient from "mongoose";
import User from "../models/users";
import bcrypt from "bcrypt"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = { appName: "devrel.template.nextjs" };

let client = null
//: MongoClient || null = null;

export const connectMongoDB = async () => {
  try {
    if (!client) {
      // Initialize MongoClient only if it's not already initialized
      client = new MongoClient(uri, options);
    }

    await connectMongoDB();
    await User.create({ name, lname, email, password });
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB');
    
    return client.json({message: 'User registered!'}, {status: 200}); // Return the client instance if needed
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
};
