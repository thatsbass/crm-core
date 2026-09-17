import app from "@/app";
import { connectDB } from "@infrastructure/database/connection";
import { ENV } from "@config/env";
import { MESSAGE } from "@shared/helpers/constant";

/**
 * Connects to MongoDB and starts the HTTP server.
 *
 * @returns A promise that resolves after startup has been initiated.
 */
const startServer = async () => {
  try {
    await connectDB();
    app.listen(ENV.PORT, () => {
      console.log(MESSAGE.SERVER_STARTED);
    });
  } catch (error) {
    console.error(MESSAGE.SERVER_ERROR, error);
  }
};

startServer();
