import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.MONGODB_URL);

export const connectToDB = async () => {
  try {
    const url: string = process.env.MONGODB_URL as string;
    await mongoose.connect(url, {});

    console.log("Successfully connected to the database.");
  } catch (error: any) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1);
  }
};

export default connectToDB;
