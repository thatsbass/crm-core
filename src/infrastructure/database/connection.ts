import mongoose from "mongoose";
import { ENV } from "@config/env";
import { SYSTEM_MESSAGE } from "@shared/constants/message.constant";

/**
 * Opens the MongoDB connection using the configured environment variable.
 *
 * @returns A promise that resolves once the database connection is established.
 */
export const connectDB = async () => {
  const mongoUri = ENV.MONGO_URI;
  try {
    await mongoose.connect(mongoUri);
    console.log(SYSTEM_MESSAGE.DB_CONNECTED);
  } catch (error) {
    console.error(SYSTEM_MESSAGE.DB_ERROR, error);
    process.exit(1);
  }
};
