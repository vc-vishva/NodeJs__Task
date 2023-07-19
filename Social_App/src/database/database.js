import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.MONGODB_URL);

export const connectToDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(" SuccessFully Connected to the database.");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1);
  }
};
