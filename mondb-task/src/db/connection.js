import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.MONGODB_URL;
const client = new MongoClient(url);

export async function main() {
  try {
    await client.connect();
    console.log("Connected successfully to server");
  } catch (error) {
    console.log("error", error);
  }
}

export default client;
