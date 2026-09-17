import mongoose from "mongoose";
import { ENV } from "@config/env";
import { MESSAGE } from "@shared/helpers/constant";

/**
 * Opens the MongoDB connection using the configured environment variable.
 *
 * @returns A promise that resolves once the database connection is established.
 */
export const connectDB = async () => {
  const mongoUri = ENV.MONGO_URI;
  try {
    await mongoose.connect(mongoUri);
    console.log(MESSAGE.DB_CONNECTED);
  } catch (error) {
    console.error(MESSAGE.DB_ERROR, error);
    process.exit(1);
  }
};
